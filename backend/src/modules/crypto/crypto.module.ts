import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConnectionStringParser } from "connection-string-parser";
import { PgPubSubModule } from "nestjs-pg-pubsub";
import { SUBSCRIPTION_PUB_SUB_PROVIDER } from "src/shared/providers/pubsub";
import { EncryptionService } from "../../shared/encryption.service";
import { CryptoAssetInfoResolver } from "./asset/asset-info.resolver";
import { AssetPriceEventListener } from "./asset/asset-price.event-listener";
import { CryptoAssetPriceResolver } from "./asset/asset-price.resolver";
import { CryptoAssetService } from "./asset/asset.service";
import { TradeResolver } from "./asset/trade.resolver";
import { ExportModule } from "./export/export.module";
import { CryptoBalanceResolver } from "./portfolio/balance.resolver";
import { HistoricalAssetProfitEventListener } from "./portfolio/historical-asset-profit.event-listener";
import { HistoricalAssetProfitResolver } from "./portfolio/historical-asset-profit.resolver";
import { HistoricalCryptoBalanceEventListener } from "./portfolio/historical-balance.event-listener";
import { HistoricalBalanceResolver } from "./portfolio/historical-balance.resolver";
import { PortfolioController } from "./portfolio/portfolio.controller";
import { CryptoPortfolioResolver } from "./portfolio/portfolio.resolver";
import { CryptoPortfolioService } from "./portfolio/portfolio.service";

@Module({
    imports: [
        PgPubSubModule.registerAsync({
            useFactory: (configService: ConfigService) => {
                const db_url = configService.get("DATABASE_URL");

                const connectionStringParser = new ConnectionStringParser({
                    scheme: "postgresql",
                    hosts: [],
                });
                const {
                    hosts: [{ host, port }],
                    username,
                    password,
                    endpoint,
                } = connectionStringParser.parse(db_url);
                return {
                    host,
                    port,
                    user: username,
                    password,
                    database: endpoint,
                };
            },
            inject: [ConfigService],
        }),
        ClientsModule.registerAsync([
            {
                name: "KAFKA_SERVICE",
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => {
                    const broker = configService.get("MESSAGE_BROKER_URL");
                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: "backend-producer",
                                brokers: [broker],
                            },
                            consumer: {
                                groupId: "backend-consumer",
                                allowAutoTopicCreation: true,
                            },
                            producer: {
                                allowAutoTopicCreation: true,
                            },
                        },
                    };
                },
            },
        ]),
        ExportModule,
    ],
    controllers: [PortfolioController],
    providers: [
        CryptoPortfolioResolver,
        CryptoBalanceResolver,
        CryptoAssetInfoResolver,
        CryptoAssetPriceResolver,
        HistoricalBalanceResolver,
        HistoricalAssetProfitResolver,
        TradeResolver,

        CryptoPortfolioService,
        CryptoAssetService,

        AssetPriceEventListener,
        HistoricalCryptoBalanceEventListener,
        HistoricalAssetProfitEventListener,

        EncryptionService,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
    exports: [CryptoPortfolioService, CryptoAssetService, ExportModule],
})
export class CryptoModule {}
