import { Module } from "@nestjs/common";
import { CryptoPortfolioService } from "./profile/portfolio.service";
import { CryptoPortfolioResolver } from "./profile/portfolio.resolver";
import { ConfigService } from "@nestjs/config";
import { PubSub } from "graphql-subscriptions";
import { CryptoBalanceResolver } from "./profile/balance.resolver";
import { PortfolioEventListener } from "./profile/portfolio-event-listener.service";
import { CryptoAssetPriceResolver } from "./asset/asset-price.resolver";
import { CryptoAssetService } from "./asset/asset.service";
import { CryptoAssetInfoResolver } from "./asset/asset-info.resolver";
import { PgPubSubModule } from "nestjs-pg-pubsub";
import { AssetPriceEventListener } from "./asset/asset-price.event-listener";
import { KafkaModule, KafkaModuleOptions } from "@claudeseo/nest-kafka";
import { ConnectionStringParser } from "connection-string-parser";
import { HistoricalBalanceResolver } from "./profile/historical-balance.resolver";
import { HistoricalAssetProfitResolver } from "./profile/historical-asset-profit.resolver";
import { HistoricalCryptoBalanceEventListener } from "./profile/historical-balance.event-listener";
import { HistoricalAssetProfitEventListener } from "./profile/historical-asset-profit.event-listener";
import { EncryptionService } from "../../shared/encryption.service";

const SUBSCRIPTION_PUB_SUB_PROVIDER = {
    provide: "SUBSCRIPTION_PUB_SUB",
    useValue: new PubSub(),
};

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
                            groupId: "crypto",
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
        HistoricalAssetProfitResolver,

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
