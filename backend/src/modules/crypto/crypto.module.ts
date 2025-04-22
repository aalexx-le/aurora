import { KafkaModule, KafkaModuleOptions } from "@claudeseo/nest-kafka";
import { Module, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ConnectionStringParser } from "connection-string-parser";
import { PgPubSubModule } from "nestjs-pg-pubsub";
import { EncryptionService } from "../../shared/encryption.service";
import { CryptoAssetInfoResolver } from "./asset/asset-info.resolver";
import { AssetPriceEventListener } from "./asset/asset-price.event-listener";
import { CryptoAssetPriceResolver } from "./asset/asset-price.resolver";
import { CryptoAssetService } from "./asset/asset.service";
import { TradeResolver } from "./asset/trade.resolver";
import { CryptoBalanceResolver } from "./portfolio/balance.resolver";
import { HistoricalAssetProfitEventListener } from "./portfolio/historical-asset-profit.event-listener";
import { HistoricalAssetProfitResolver } from "./portfolio/historical-asset-profit.resolver";
import { HistoricalCryptoBalanceEventListener } from "./portfolio/historical-balance.event-listener";
import { HistoricalBalanceResolver } from "./portfolio/historical-balance.resolver";
import { PortfolioEventListener } from "./portfolio/portfolio-event-listener.service";
import { CryptoPortfolioResolver } from "./portfolio/portfolio.resolver";
import { CryptoPortfolioService } from "./portfolio/portfolio.service";
import { SUBSCRIPTION_PUB_SUB_PROVIDER } from "src/shared/providers/pubsub";

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
        KafkaModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService,
            ): Promise<KafkaModuleOptions> => {
                const broker = configService.get("MESSAGE_BROKER_URL");
                return {
                    consume_method: "each",
                    options: {
                        client: {
                            brokers: [broker],
                            clientId: "nestjs-kafka",
                        },
                        consumer: {
                            groupId: "backend-server",
                            allowAutoTopicCreation: true,
                        },
                        producer: {
                            allowAutoTopicCreation: true,
                        },
                        subscribe: {
                            fromBeginning: false,
                        },
                        run: {
                            autoCommit: true,
                        },
                    },
                };
            },
        }),
        // KafkaModule.forRootAsync({
        //     useFactory: (configService: ConfigService) => {
        //         const groupId = "crypto-profile";
        //         const brokerList =
        //             configService.get<string>("MESSAGE_BROKER_URL");
        //         const clientId = "crypto-profile-nestjs";
        //         return {
        //             global: true,
        //             consumer: {
        //                 conf: {
        //                     "group.id": groupId,
        //                     "metadata.broker.list": brokerList,
        //                 },
        //             },
        //             producer: {
        //                 conf: {
        //                     "client.id": clientId,
        //                     "metadata.broker.list": brokerList,
        //                 },
        //             },
        //             adminClient: {
        //                 conf: {
        //                     "metadata.broker.list": brokerList,
        //                 },
        //             },
        //         };
        //     },
        //     inject: [ConfigService],
        // }),
    ],
    providers: [
        CryptoPortfolioResolver,
        CryptoBalanceResolver,
        CryptoAssetInfoResolver,
        CryptoAssetPriceResolver,
        HistoricalBalanceResolver,
        {
            provide: HistoricalAssetProfitResolver,
            useClass: HistoricalAssetProfitResolver,
            scope: Scope.DEFAULT,
        },
        TradeResolver,

        CryptoPortfolioService,
        CryptoAssetService,
        PortfolioEventListener,
        AssetPriceEventListener,
        HistoricalCryptoBalanceEventListener,
        HistoricalAssetProfitEventListener,

        EncryptionService,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
    exports: [
        CryptoPortfolioService,
        CryptoAssetService,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
})
export class CryptoModule {}
