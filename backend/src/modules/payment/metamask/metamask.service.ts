import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MembershipSubscriptionStatus, PaymentProvider, PaymentStatus } from "@prisma/client";
import * as ccxt from "ccxt";
import { ethers } from "ethers";
import { PrismaService } from "nestjs-prisma";
import { PaymentSessionService } from "../payment-session.service";
import {
    CreateMetaMaskPaymentMethodDto,
    CreateMetaMaskSubscriptionFromSessionDto,
    CreateMetaMaskTransactionDto,
    CryptoPriceResult,
} from "./dtos/metamask-payment.dto";

interface TokenConfig {
    name: string;
    address: string;
    decimals: number;
    tradingPairs: string[];
    isStablecoin?: boolean;
}

interface ExchangeConfig {
    class: typeof ccxt.Exchange;
    name: string;
}

@Injectable()
export class MetaMaskService {
    private readonly logger = new Logger(MetaMaskService.name);
    private readonly provider: ethers.JsonRpcProvider;
    private readonly exchanges: ccxt.Exchange[] = [];

    // Optimized exchange configuration
    private readonly EXCHANGE_CONFIGS: ExchangeConfig[] = [
        { class: ccxt.binance, name: "binance" },
        { class: ccxt.coinbase, name: "coinbase" },
        { class: ccxt.kraken, name: "kraken" },
        { class: ccxt.okx, name: "okx" },
    ];

    // Mock prices for fallback (extracted as constants)
    private readonly FALLBACK_PRICES: Record<string, number> = {
        ETH: 2000,
        USDC: 1,
        USDT: 1,
    };

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly paymentSessionService: PaymentSessionService,
    ) {
        const rpcUrl = this.configService.get<string>("ETHEREUM_RPC_URL");
        if (!rpcUrl) {
            throw new Error(
                "ETHEREUM_RPC_URL environment variable is required",
            );
        }
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.initializeExchanges();
    }

    private initializeExchanges(): void {
        const isProduction =
            this.configService.get<string>("NODE_ENV") === "production";

        for (const { class: ExchangeClass, name } of this.EXCHANGE_CONFIGS) {
            try {
                const exchange = new ExchangeClass({
                    sandbox: !isProduction,
                    enableRateLimit: true,
                    timeout: 10000,
                });

                this.exchanges.push(exchange);
            } catch (error) {
                this.logger.warn(
                    `Failed to initialize exchange ${name}: ${error.message}`,
                );
            }
        }

        this.logger.log(
            `Initialized ${this.exchanges.length} CCXT exchanges for price fetching`,
        );
    }

    async createPaymentMethod(
        data: CreateMetaMaskPaymentMethodDto,
        userId: number,
    ) {
        const normalizedAddress = data.walletAddress.toLowerCase();

        // Check for existing payment method
        const existingPaymentMethod = await this.prisma.paymentMethod.findFirst(
            {
                where: {
                    userId,
                    provider: PaymentProvider.METAMASK,
                    metaMaskPaymentMethod: {
                        walletAddress: normalizedAddress,
                    },
                },
            },
        );

        if (existingPaymentMethod) {
            throw new BadRequestException("Wallet address already registered");
        }

        // Resolve ENS name if needed
        const ensName =
            data.ensName || (await this.resolveENSName(data.walletAddress));

        return await this.prisma.paymentMethod.create({
            data: {
                userId,
                provider: PaymentProvider.METAMASK,
                metaMaskPaymentMethod: {
                    create: {
                        walletAddress: normalizedAddress,
                        ensName,
                    },
                },
            },
            include: {
                metaMaskPaymentMethod: true,
            },
        });
    }

    private async resolveENSName(
        walletAddress: string,
    ): Promise<string | null> {
        try {
            return await this.provider.lookupAddress(walletAddress);
        } catch (error) {
            this.logger.debug(
                `ENS lookup failed for ${walletAddress}: ${error.message}`,
            );
            return null;
        }
    }

    async getCryptoPrice(
        tokenSymbol: string,
        usdAmount: number,
    ): Promise<CryptoPriceResult> {
        const usdPrice = await this.fetchTokenPrice(tokenSymbol);
        const tokenAmount = this.calculateTokenAmount(
            usdAmount,
            usdPrice,
        );

        return {
            tokenSymbol,
            usdPrice,
            tokenAmount,
        };
    }

    private async fetchTokenPrice(
        tokenSymbol: string,
    ): Promise<number> {
        for (const exchange of this.exchanges) {
            const price = await this.fetchPriceFromExchange(
                exchange,
                tokenSymbol,
            );
            if (price > 0) {
                return price;
            }
        }

        throw new BadRequestException(`Unsupported token: ${tokenSymbol}`);
    }

    private async fetchPriceFromExchange(
        exchange: ccxt.Exchange,
        tokenSymbol: string,
    ): Promise<number> {
        try {
            await exchange.loadMarkets();

            const tradingPair = `${tokenSymbol}/USDC`;

            if (
                exchange.has["fetchTicker"] &&
                exchange.markets[tradingPair]
            ) {
                const ticker = await exchange.fetchTicker(tradingPair);
                const price = ticker.last || ticker.close;

                if (price > 0) {
                    this.logger.debug(
                        `Fetched ${tokenSymbol} price from ${exchange.id} (${tradingPair}): $${price}`,
                    );
                    return price;
                }
            }
        } catch (error) {
            this.logger.warn(
                `${exchange.id} API failed for ${tokenSymbol}: ${error.message}`,
            );
        }

        return 0;
    }

    private calculateTokenAmount(
        usdAmount: number,
        usdPrice: number,
    ): string {
        const tokenAmount = usdAmount / usdPrice;
        return tokenAmount.toFixed(6);
    }

    async createTransaction(data: CreateMetaMaskTransactionDto) {
        return await this.prisma.metaMaskPaymentTransaction.create({
            data: {
                paymentTransactionId: data.paymentTransactionId,
                transactionHash: data.transactionHash,
                tokenAddress: data.tokenAddress,
                tokenSymbol: data.tokenSymbol,
                blockNumber: data.blockNumber,
                gasUsed: data.gasUsed,
                gasPrice: data.gasPrice,
            },
            include: {
                paymentTransaction: {
                    include: {
                        membershipSubscription: true,
                    },
                },
            },
        });
    }

    async createMembershipSubscriptionFromSession(
        data: CreateMetaMaskSubscriptionFromSessionDto,
        userId: number,
    ) {
        this.logger.log(
            `Creating MetaMask subscription from session ${data.sessionId} for user ${userId}`,
        );

        // Validate and consume the payment session
        const sessionData = await this.paymentSessionService.validateAndConsumeSession(
            data.sessionId,
            userId,
        );

        // Create subscription with session data (including discount)
        const subscription = await this.createMembershipSubscriptionAndTransaction({
            userId,
            planId: sessionData.planId,
            priceId: sessionData.priceId,
            transactionHash: data.transactionHash,
            tokenSymbol: data.tokenSymbol,
            tokenAddress: data.tokenAddress,
            blockNumber: data.blockNumber,
            gasUsed: data.gasUsed,
            gasPrice: data.gasPrice,
            discountId: sessionData.discountId,
            originalAmount: sessionData.finalAmount,
            discountAmount: sessionData.discountAmount,
        });

        return subscription;
    }

    // Enhanced createMembershipSubscriptionAndTransaction to support discount information
    async createMembershipSubscriptionAndTransaction(data: {
        userId: number;
        planId: string;
        priceId: string;
        transactionHash: string;
        tokenSymbol: string;
        tokenAddress?: string;
        blockNumber?: number;
        gasUsed?: string;
        gasPrice?: string;
        discountId?: string;
        originalAmount?: number;
        discountAmount?: number;
    }) {
        // Find the membership plan and price
        const membershipPlan = await this.prisma.membershipPlan.findUnique({
            where: { id: data.planId },
        });

        const price = await this.prisma.membershipPrice.findUnique({
            where: { id: data.priceId },
            include: {
                unitPrice: true,
            }
        });

        if (!membershipPlan) {
            throw new BadRequestException("Membership plan not found");
        }

        // Calculate end date based on plan (assuming monthly for now)
        const now = new Date();
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

        // Create the membership subscription with correct schema fields
        const membershipSubscription = await this.prisma.membershipSubscription.create({
            data: {
                userId: data.userId,
                planId: data.planId,
                status: MembershipSubscriptionStatus.active,
                startDate: new Date(),
                endDate: endDate,
            },
        });

        // Create payment transaction with correct schema fields
        const paymentTransaction = await this.prisma.paymentTransaction.create({
            data: {
                membershipSubscriptionId: membershipSubscription.id,
                userId: data.userId,
                amount: data.originalAmount || price.unitPrice.amount,
                currency: price.unitPrice.currencyCode,
                status: PaymentStatus.captured,
            },
        });

        // Create MetaMask payment transaction
        await this.prisma.metaMaskPaymentTransaction.create({
            data: {
                paymentTransactionId: paymentTransaction.id,
                transactionHash: data.transactionHash,
                tokenSymbol: data.tokenSymbol,
                tokenAddress: data.tokenAddress,
                blockNumber: data.blockNumber,
                gasUsed: data.gasUsed,
                gasPrice: data.gasPrice,
            },
        });
        
        return membershipSubscription;
    }
}
