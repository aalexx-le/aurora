import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { KafkaTopic } from "../../../shared/constants/kafka";
import { CreateCryptoPortfolioInput } from "./dto/create-crypto-portfolio.input";
import { AssetPrice } from "../../../entities/asset-price";
import { AssetInfoOutput } from "./dto/get-asset-info.output";
import { CryptoAssetService } from "../asset/asset.service";
import { InjectKafka, KafkaService } from "@claudeseo/nest-kafka";

@Injectable()
export class CryptoPortfolioService {
    private readonly logger = new Logger(CryptoPortfolioService.name);
    constructor(
        private prisma: PrismaService,
        private cryptoAssetService: CryptoAssetService,
        @InjectKafka() private readonly kafkaService: KafkaService,
    ) {}

    createPortfolio(createCryptoPortfolioInput: CreateCryptoPortfolioInput) {
        createCryptoPortfolioInput.userId = Number(
            createCryptoPortfolioInput.userId,
        );

        const msg = Buffer.from(JSON.stringify(createCryptoPortfolioInput));
        this.kafkaService.sendMessage({
            topic: KafkaTopic.CREATE_CRYPTO_PORTFOLIO,
            messages: [{ value: msg }],
        });
        this.logger.log(
            `Message sent to topic(${KafkaTopic.CREATE_CRYPTO_PORTFOLIO}): ${msg}`,
        );
    }

    findPortfolios(userId: number) {
        return this.prisma.cryptoPortfolio.findMany({
            where: { userId },
        });
    }

    findBalances(cryptoPortfolioId: string) {
        return this.prisma.assetBalance.findMany({
            where: { cryptoPortfolioId },
        });
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

    async findHistoricalBalance(cryptoPortfolioId: string) {
        return this.prisma.historical_crypto_balance_1h.findMany({
            where: { cryptoPortfolioId },
        });
    }
}
