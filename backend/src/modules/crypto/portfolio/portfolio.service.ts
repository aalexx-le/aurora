import { InjectKafka, KafkaService } from "@claudeseo/nest-kafka";
import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaService } from "nestjs-prisma";
import { AssetPrice } from "src/entities/asset-price";
import { HistoricalAssetProfit } from "src/entities/historical-asset-profit";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { CEXExchanges, CreateExecutionStatus } from "../../../entities/prisma";
import { KafkaTopic } from "../../../shared/constants/kafka";
import { EncryptionService } from "../../../shared/encryption.service";
import { PaginationInput } from "../../../shared/pagination/pagination.args";
import { getTimeframeMaterializedViewName } from "../../../shared/utils/get-timeframe-materialized-view-name";
import { DataInterval } from "../asset/enum/data-interval";
import { CreateCryptoPortfolioInput } from "./dto/create-crypto-portfolio.input";
import { AssetInfoOutput } from "./dto/get-asset-info.output";
import { GetHistoricalAssetProfitInput } from "./dto/get-historical-asset-profit.input";
import { GetHistoricalBalanceInput } from "./dto/get-historical-balance.input";

@Injectable()
export class CryptoPortfolioService {
    private readonly logger = new Logger(CryptoPortfolioService.name);

    constructor(
        private prisma: PrismaService,
        @InjectKafka() private readonly kafkaService: KafkaService,
        private readonly encryptionService: EncryptionService,
    ) {}

    async createPortfolio(
        userId: number,
        createCryptoPortfolioInput: CreateCryptoPortfolioInput,
    ) {
        // createCryptoPortfolioInput.secretKey =
        //     await this.encryptionService.generateEncryptedKey(
        //         createCryptoPortfolioInput.secretKey,
        //     );

        const execution = await this.prisma.createPortfolioExecution.create({
            data: {
                userId,
                status: CreateExecutionStatus.QUEUE,
            },
        });

        // Ensure secretKey is properly encoded before sending
        const msgPayload = {
            userId,
            ...createCryptoPortfolioInput,
            executionId: execution.id,
            secretKey: createCryptoPortfolioInput.secretKey, // Already encrypted string
        };

        // Stringify with proper encoding
        const msg = Buffer.from(JSON.stringify(msgPayload), "utf-8");

        const res = await this.kafkaService.sendMessage({
            topic: KafkaTopic.CREATE_CRYPTO_PORTFOLIO,
            messages: [
                {
                    value: msg,
                    headers: {
                        "content-encoding": "utf-8", // Add encoding header
                    },
                },
            ],
        });

        this.logger.log(
            `Message sent to topic(${KafkaTopic.CREATE_CRYPTO_PORTFOLIO})`,
        );
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

    async findBalances(cryptoPortfolioId: string, exchange: CEXExchanges) {
        if (exchange == CEXExchanges.ALL) {
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
}
