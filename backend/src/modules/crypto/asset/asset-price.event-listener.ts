import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { InjectPgSubscriber, PgSubscriber } from "nestjs-pg-pubsub";
import { PortfolioEventListener } from "../profile/portfolio-event-listener.service";
import { DatabaseEvent } from "../../../shared/constants/database.event";
import { AssetPrice } from "src/entities/asset-price";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import { CryptoAssetService } from "./asset.service";

@Injectable()
export class AssetPriceEventListener implements OnModuleDestroy, OnModuleInit {
    public static readonly NEW_ASSET_PRICE_1m_PAYLOAD_NAME = "newAssetPrice1m";
    public static readonly NEW_ASSET_PRICE_5m_PAYLOAD_NAME = "newAssetPrice5m";
    private readonly logger = new Logger(PortfolioEventListener.name);

    constructor(
        @InjectPgSubscriber() private readonly pgSubscriber: PgSubscriber,
        private cryptoAssetService: CryptoAssetService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {
        // IMPORTANT - need this line to respond to events
    }
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
                    [AssetPriceEventListener.NEW_ASSET_PRICE_1m_PAYLOAD_NAME]:
                        payload,
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
                    [AssetPriceEventListener.NEW_ASSET_PRICE_5m_PAYLOAD_NAME]:
                        payload,
                });
            },
        );
    }
}
