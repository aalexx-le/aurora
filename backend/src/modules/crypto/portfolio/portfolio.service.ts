import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaService } from "nestjs-prisma";
import { AssetPrice } from "src/entities/asset-price";
import { HistoricalAssetProfit } from "src/entities/historical-asset-profit";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { Exchanges } from "../../../entities/prisma";
import { KafkaTopic } from "../../../shared/constants/kafka";
import { EncryptionService } from "../../../shared/encryption.service";
import { PaginationInput } from "../../../shared/pagination/pagination.args";
import {
    isPassphraseRequired,
    validatePassphraseRequirement,
} from "../../../shared/utils/exchange-requirements.util";
import { getTimeframeMaterializedViewName } from "../../../shared/utils/get-timeframe-materialized-view-name";
import { DataInterval } from "../asset/enum/data-interval";
import { CreateCryptoPortfolioInput } from "./dto/create-crypto-portfolio.input";
import { AssetInfoOutput } from "./dto/get-asset-info.output";
import { GetHistoricalAssetProfitInput } from "./dto/get-historical-asset-profit.input";
import { GetHistoricalBalanceInput } from "./dto/get-historical-balance.input";
import {
    CreateSupportTicketArgs,
    UpdateCredentialsInput,
} from "./dto/portfolio-recovery.input";

@Injectable()
export class CryptoPortfolioService {
    private readonly logger = new Logger(CryptoPortfolioService.name);

    constructor(
        private prisma: PrismaService,
        @Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
        private readonly encryptionService: EncryptionService,
    ) {}

    async createPortfolio(
        userId: number,
        createCryptoPortfolioInput: CreateCryptoPortfolioInput,
    ) {
        // Validate passphrase requirement based on exchange
        const isPassphraseValid = validatePassphraseRequirement(
            createCryptoPortfolioInput.exchanges,
            createCryptoPortfolioInput.passphrase,
        );

        if (!isPassphraseValid) {
            throw new Error(
                `Passphrase is required for ${createCryptoPortfolioInput.exchanges} exchange`,
            );
        }

        this.logger.log(
            `Creating portfolio for exchange: ${createCryptoPortfolioInput.exchanges}, passphrase required: ${isPassphraseRequired(createCryptoPortfolioInput.exchanges)}`,
        );

        // Encrypt credentials before storing
        const encryptedApiKey = await this.encryptionService.encryptApiKey(
            createCryptoPortfolioInput.apiKey,
        );
        const encryptedSecretKey = await this.encryptionService.encryptApiKey(
            createCryptoPortfolioInput.secretKey,
        );
        const encryptedPassphrase = createCryptoPortfolioInput.passphrase
            ? await this.encryptionService.encryptApiKey(
                  createCryptoPortfolioInput.passphrase,
              )
            : undefined;

        // Prepare execution context for future retry/update operations
        const executionContext = {
            name: createCryptoPortfolioInput.name,
            exchanges: createCryptoPortfolioInput.exchanges,
            apiKey: encryptedApiKey,
            secretKey: encryptedSecretKey,
            passphrase: encryptedPassphrase,
        };

        // Create execution record with context
        const execution = await this.prisma.createPortfolioExecution.create({
            data: {
                userId,
                executionContext: JSON.stringify(executionContext),
            },
        });

        // Emit Kafka message with encrypted credentials
        this.kafkaClient.emit(KafkaTopic.CREATE_CRYPTO_PORTFOLIO, {
            userId,
            executionId: execution.id,
            name: createCryptoPortfolioInput.name,
            exchanges: createCryptoPortfolioInput.exchanges,
            apiKey: encryptedApiKey,
            secretKey: encryptedSecretKey,
            passphrase: encryptedPassphrase,
        });

        this.logger.log(
            `Portfolio creation message emitted for execution ${execution.id} with stored context`,
        );

        return execution;
    }

    findPortfolio(cryptoPortfolioId: string) {
        return this.prisma.cryptoPortfolio.findUnique({
            where: { id: cryptoPortfolioId },
        });
    }

    findPortfolios(userId: number) {
        return this.prisma.cryptoPortfolio.findMany({
            where: { userId },
        });
    }

    async findBalances(cryptoPortfolioId: string, exchange: Exchanges) {
        if (exchange == Exchanges.ALL) {
            const childPortfolios = await this.prisma.cryptoPortfolio.findMany({
                where: { parentPortfolioId: cryptoPortfolioId },
                select: {
                    id: true,
                },
            });

            return this.prisma.assetBalance.findMany({
                where: {
                    cryptoPortfolioId: {
                        in: childPortfolios.map((portfolio) => portfolio.id),
                    },
                },
            });
        } else {
            return this.prisma.assetBalance.findMany({
                where: { cryptoPortfolioId },
            });
        }
    }

    async findAssetInfo(id: string): Promise<AssetInfoOutput> {
        const assetInfo = await this.prisma.assetInfo.findUnique({
            where: { id },
        });

        if (!assetInfo) {
            throw new Error("AssetInfo not found");
        }

        if (assetInfo.symbol === "USDT") {
            return { ...assetInfo, lastPrice: 1 };
        }

        const { openPrice } = await this.findLatestPrice(id);
        return { ...assetInfo, lastPrice: openPrice };
    }

    async findLatestPrice(
        assetInfoId: string,
    ): Promise<Pick<AssetPrice, "openPrice">> {
        return this.prisma.assetPrice.findFirst({
            where: {
                assetInfoId,
            },
            select: {
                openPrice: true,
            },
            orderBy: {
                open_time: "desc",
            },
            take: 1,
        });
    }

    async findHistoricalBalances(
        input: GetHistoricalBalanceInput,
        pagination: PaginationInput,
    ) {
        const { cryptoPortfolioId, timeFrame } = input;
        const { take, after } = pagination;

        let historicalCryptoBalances: HistoricalCryptoBalance[] = [];
        const args: Prisma.HistoricalCryptoBalanceFindManyArgs<DefaultArgs> = {
            where: {
                cryptoPortfolioId,
            },
            take: -1 * take,
            orderBy: {
                time: "asc",
            },
        };
        if (after) {
            args.skip = 1;
            args.cursor = {
                cryptoPortfolioId_time: {
                    cryptoPortfolioId,
                    time: after,
                },
            };
        }

        if (timeFrame === DataInterval.MINUTE_1) {
            historicalCryptoBalances =
                await this.prisma.historicalCryptoBalance.findMany(args);
        } else {
            historicalCryptoBalances =
                this.prisma[
                    getTimeframeMaterializedViewName(
                        timeFrame,
                        "historical_crypto_balance",
                    )
                ].findMany(args);
        }

        return historicalCryptoBalances;
    }

    async findOneHistoricalAssetProfit(
        input: GetHistoricalAssetProfitInput,
        pagination: PaginationInput,
    ) {
        const { take, after } = pagination;
        const { cryptoPortfolioId, assetInfoId, timeFrame } = input;

        const args: Prisma.HistoricalAssetProfitFindManyArgs<DefaultArgs> = {
            where: {
                cryptoPortfolioId,
                assetInfoId,
            },
            take: -1 * take,
            orderBy: {
                time: "asc",
            },
        };
        if (after) {
            args.skip = 1;
            args.cursor = {
                cryptoPortfolioId_assetInfoId_time: {
                    cryptoPortfolioId,
                    assetInfoId,
                    time: after,
                },
            };
        }

        if (timeFrame === DataInterval.MINUTE_1) {
            return this.prisma.historicalAssetProfit.findMany(args);
        } else {
            return this.prisma[
                getTimeframeMaterializedViewName(
                    timeFrame,
                    "historical_asset_profit",
                )
            ].findMany(args);
        }
    }

    async findHistoricalAssetProfits(
        cryptoPortfolioId: string,
        pagination: PaginationInput,
    ) {
        const historicalAssetProfits: HistoricalAssetProfit[] = [];

        const assetInfos = await this.prisma.historicalAssetProfit.findMany({
            distinct: ["assetInfoId"],
            where: {
                cryptoPortfolioId,
            },
            select: {
                assetInfoId: true,
            },
        });

        for (const { assetInfoId } of assetInfos) {
            const historicalAssetProfit =
                await this.findOneHistoricalAssetProfit(
                    {
                        cryptoPortfolioId,
                        assetInfoId,
                        timeFrame: DataInterval.HOUR_1,
                    },
                    pagination,
                );
            historicalAssetProfits.push(...historicalAssetProfit);
        }

        return historicalAssetProfits;
    }

    async getCreatePortfolioExecutions(userId: number) {
        return this.prisma.createPortfolioExecution.findMany({
            where: { userId },
        });
    }

    // =============================================================================
    // PORTFOLIO RECOVERY METHODS
    // =============================================================================

    /**
     * Retry portfolio creation for a failed execution using pure event-driven approach
     */
    async retryPortfolioCreation(userId: number, executionId: number) {
        this.logger.log(
            `🔄 Initiating portfolio retry for execution ${executionId}`,
        );

        // Verify execution belongs to user and check retry limits
        const execution = await this.prisma.createPortfolioExecution.findFirst({
            where: { id: executionId, userId },
        });

        if (!execution) {
            throw new Error("Execution not found or access denied");
        }

        if (execution.retryCount >= execution.maxRetries) {
            throw new Error("Maximum retry attempts exceeded");
        }

        // Emit Kafka event for asynchronous retry processing (no status updates here)
        this.kafkaClient.emit(KafkaTopic.RETRY_CRYPTO_PORTFOLIO, {
            userId,
            executionId,
            currentRetryCount: execution.retryCount,
            timestamp: new Date().toISOString(),
        });

        this.logger.log(
            `✅ Portfolio retry event emitted for execution ${executionId}`,
        );

        // Return current execution state without modifications (like createPortfolio)
        return execution;
    }

    /**
     * Update credentials for a failed execution and retry using pure event-driven approach
     */
    async updateExecutionCredentials(
        userId: number,
        executionId: number,
        credentials: UpdateCredentialsInput,
    ) {
        this.logger.log(
            `🔑 Initiating credential update for execution ${executionId}`,
        );

        // Verify execution belongs to user
        const execution = await this.prisma.createPortfolioExecution.findFirst({
            where: { id: executionId, userId },
        });

        if (!execution) {
            throw new Error("Execution not found or access denied");
        }

        // Encrypt new credentials
        const encryptedCredentials = {
            apiKey: await this.encryptionService.encryptApiKey(
                credentials.apiKey,
            ),
            secretKey: await this.encryptionService.encryptApiKey(
                credentials.secretKey,
            ),
            passphrase: credentials.passphrase
                ? await this.encryptionService.encryptApiKey(
                      credentials.passphrase,
                  )
                : undefined,
        };

        // Emit Kafka event for asynchronous credential update processing (no status updates here)
        this.kafkaClient.emit(KafkaTopic.UPDATE_CRYPTO_PORTFOLIO_CREDENTIALS, {
            userId,
            executionId,
            ...encryptedCredentials,
            timestamp: new Date().toISOString(),
        });

        this.logger.log(
            `✅ Credential update event emitted for execution ${executionId}`,
        );

        // Return current execution state without modifications (like createPortfolio)
        return execution;
    }

    /**
     * Create a support ticket for a failed execution
     */
    async createSupportTicket(
        userId: number,
        ticketData: CreateSupportTicketArgs,
    ): Promise<boolean> {
        this.logger.log(
            `🎫 Creating support ticket for execution ${ticketData.data.executionId}`,
        );

        // Verify execution belongs to user
        const execution = await this.prisma.createPortfolioExecution.findFirst({
            where: { id: ticketData.data.executionId, userId },
        });

        if (!execution) {
            throw new Error("Execution not found or access denied");
        }

        try {
            // For now, create an internal support request
            // In the future, this could integrate with Zendesk, Intercom, etc.
            const supportTicket = {
                userId,
                executionId: ticketData.data.executionId,
                subject:
                    ticketData.data.subject ||
                    `Portfolio Creation Failed - Execution ${ticketData.data.executionId}`,
                description: `${ticketData.data.description}\n\nExecution Details:\n- ID: ${execution.id}\n- Current Step: ${execution.currentStep}\n- Error: ${execution.errorMessage}\n- Retry Count: ${execution.retryCount}`,
                category: ticketData.data.category || "CRYPTO_PORTFOLIO",
                priority: ticketData.data.priority || "HIGH",
                status: "OPEN",
                createdAt: new Date(),
            };

            // Log the support ticket (in production, this would create a real ticket)
            this.logger.log(
                `📧 Support ticket created: ${JSON.stringify(supportTicket)}`,
            );

            // TODO: Integrate with actual support system
            // await this.supportService.createTicket(supportTicket);
            // await this.notificationService.notifySupport(supportTicket);

            this.logger.log(
                `✅ Support ticket logged for execution ${ticketData.data.executionId}`,
            );
            return true;
        } catch (error) {
            this.logger.error(
                `❌ Failed to create support ticket: ${error.message}`,
            );
            throw new Error(
                `Failed to create support ticket: ${error.message}`,
            );
        }
    }
}
