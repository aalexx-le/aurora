import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { InjectPgSubscriber, PgSubscriber } from "nestjs-pg-pubsub";
import { DatabaseEvent } from "../../../shared/constants/database.event";
import { HistoricalAssetProfit } from "src/entities/historical-asset-profit";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";

@Injectable()
export class HistoricalAssetProfitEventListener
    implements OnModuleDestroy, OnModuleInit
{
    public static readonly NEW_HISTORICAL_ASSET_PROFIT_1m_PAYLOAD_NAME =
        "newHistoricalAssetProfit1m";
    public static readonly NEW_HISTORICAL_ASSET_PROFIT_1h_PAYLOAD_NAME =
        "newHistoricalAssetProfit1h";
    private readonly logger = new Logger(
        HistoricalAssetProfitEventListener.name,
    );

    constructor(
        @InjectPgSubscriber() private readonly pgSubscriber: PgSubscriber,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    onModuleDestroy(): any {
        this.pgSubscriber.unlistenAll().then(() => {});
    }

    async onModuleInit() {
        this.logger.log(`Listen historical asset profit insert event`);
        this.pgSubscriber
            .listenTo(DatabaseEvent.HISTORICAL_ASSET_PROFIT_1m_INSERT)
            .then(() => {});
        this.pgSubscriber.notifications.on(
            DatabaseEvent.HISTORICAL_ASSET_PROFIT_1m_INSERT,
            async (payload: HistoricalAssetProfit) => {
                payload.time = new Date(payload.time + "Z");
                this.pubSub.publish(
                    SubscriptionEvent.HISTORICAL_ASSET_PROFIT_1m_INSERTED,
                    {
                        [HistoricalAssetProfitEventListener.NEW_HISTORICAL_ASSET_PROFIT_1m_PAYLOAD_NAME]:
                            payload,
                    },
                );
            },
        );

        this.pgSubscriber
            .listenTo(DatabaseEvent.HISTORICAL_ASSET_PROFIT_1h_INSERT)
            .then(() => {});
        this.pgSubscriber.notifications.on(
            DatabaseEvent.HISTORICAL_ASSET_PROFIT_1h_INSERT,
            async (payload: HistoricalAssetProfit) => {
                payload.time = new Date(payload.time + "Z");
                this.pubSub.publish(
                    SubscriptionEvent.HISTORICAL_ASSET_PROFIT_1h_INSERTED,
                    {
                        [HistoricalAssetProfitEventListener.NEW_HISTORICAL_ASSET_PROFIT_1h_PAYLOAD_NAME]:
                            payload,
                    },
                );
            },
        );
    }
}
