import {
    Inject,
    Injectable,
    Logger,
    LoggerService,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { InjectPgSubscriber, PgSubscriber } from "nestjs-pg-pubsub";
import { AssetPrice } from "src/entities/asset-price";
import { DatabaseEvent } from "../../../shared/constants/database.event";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import { AbbreviatedTimeFrameEnum } from "src/shared/constants/timeframe";

@Injectable()
export class AssetPriceEventListener implements OnModuleDestroy, OnModuleInit {
    private readonly logger = new Logger(AssetPriceEventListener.name);

    public static readonly NEW_ASSET_PRICE_PAYLOAD_NAME = "newAssetPrice";
    public static readonly TIME_FRAME = "timeframe";

    constructor(
        @InjectPgSubscriber() private readonly pgSubscriber: PgSubscriber,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    onModuleDestroy(): any {
        this.pgSubscriber.unlistenAll().then(() => {});
    }

    async onModuleInit() {
        this.logger.log(`Listen asset price insert event`);
        this.pgSubscriber
            .listenTo(DatabaseEvent.ASSET_PRICE_1m_INSERT)
            .then(() => {});
        this.pgSubscriber.notifications.on(
            DatabaseEvent.ASSET_PRICE_1m_INSERT,
            async (payload: AssetPrice) => {
                payload.open_time = new Date(payload.open_time + "Z");
                payload.close_time = new Date(payload.close_time + "Z");
                this.pubSub.publish(SubscriptionEvent.ASSET_PRICE_1m_INSERTED, {
                    [AssetPriceEventListener.NEW_ASSET_PRICE_PAYLOAD_NAME]:
                        payload,
                    [AssetPriceEventListener.TIME_FRAME]: AbbreviatedTimeFrameEnum.ONE_MINUTE
                });
            },
        );

        this.pgSubscriber
            .listenTo(DatabaseEvent.ASSET_PRICE_5m_INSERT)
            .then(() => {});
        this.pgSubscriber.notifications.on(
            DatabaseEvent.ASSET_PRICE_5m_INSERT,
            async (payload: AssetPrice) => {
                payload.open_time = new Date(payload.open_time + "Z");
                this.pubSub.publish(SubscriptionEvent.ASSET_PRICE_5m_INSERTED, {
                    [AssetPriceEventListener.NEW_ASSET_PRICE_PAYLOAD_NAME]:
                        payload,
                    [AssetPriceEventListener.TIME_FRAME]: AbbreviatedTimeFrameEnum.FIVE_MINUTES
                });
            },
        );
    }
}
