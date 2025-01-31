import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { InjectPgSubscriber, PgSubscriber } from "nestjs-pg-pubsub";
import { DatabaseEvent } from "../../../shared/constants/database.event";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";

@Injectable()
export class HistoricalCryptoBalanceEventListener
    implements OnModuleDestroy, OnModuleInit
{
    public static readonly NEW_HISTORICAL_CRYPTO_BALANCE_1m_PAYLOAD_NAME =
        "newHistoricalCryptoBalance1m";
    public static readonly NEW_HISTORICAL_CRYPTO_BALANCE_1h_PAYLOAD_NAME =
        "newHistoricalCryptoBalance1h";
    private readonly logger = new Logger(
        HistoricalCryptoBalanceEventListener.name,
    );

    constructor(
        @InjectPgSubscriber() private readonly pgSubscriber: PgSubscriber,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {
        // IMPORTANT - need this line to respond to events
    }

    onModuleDestroy(): any {
        this.pgSubscriber.unlistenAll().then(() => {});
    }

    async onModuleInit() {
        this.logger.log(`Listen historical crypto balance insert event`);
        this.pgSubscriber
            .listenTo(DatabaseEvent.HISTORICAL_CRYPTO_BALANCE_1m_INSERT)
            .then(() => {});
        this.pgSubscriber.notifications.on(
            DatabaseEvent.HISTORICAL_CRYPTO_BALANCE_1m_INSERT,
            async (payload: HistoricalCryptoBalance) => {
                payload.time = new Date(payload.time + "Z");
                this.pubSub.publish(
                    SubscriptionEvent.HISTORICAL_CRYPTO_BALANCE_1m_INSERTED,
                    {
                        [HistoricalCryptoBalanceEventListener.NEW_HISTORICAL_CRYPTO_BALANCE_1m_PAYLOAD_NAME]:
                            payload,
                    },
                );
            },
        );

        this.pgSubscriber
            .listenTo(DatabaseEvent.HISTORICAL_CRYPTO_BALANCE_1h_INSERT)
            .then(() => {});
        this.pgSubscriber.notifications.on(
            DatabaseEvent.HISTORICAL_CRYPTO_BALANCE_1h_INSERT,
            async (payload: HistoricalCryptoBalance) => {
                payload.time = new Date(payload.time + "Z");
                this.pubSub.publish(
                    SubscriptionEvent.HISTORICAL_CRYPTO_BALANCE_1h_INSERTED,
                    {
                        [HistoricalCryptoBalanceEventListener.NEW_HISTORICAL_CRYPTO_BALANCE_1h_PAYLOAD_NAME]:
                            payload,
                    },
                );
            },
        );
    }
}
