import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { PubSub } from "graphql-subscriptions";
import { KafkaTopic } from "../../../shared/constants/kafka";
import { SubscriptionEvent } from "../../../shared/constants/subscription.event";
import {
    InjectKafka,
    KafkaEachPayload,
    KafkaService,
    KafkaSubscribeTo,
} from "@claudeseo/nest-kafka";

@Injectable()
export class PortfolioEventListener implements OnModuleInit {
    public static readonly CREATE_SUCCESS_PAYLOAD_NAME = "portfolioCreated";

    private readonly logger = new Logger(PortfolioEventListener.name);

    constructor(
        private prisma: PrismaService,
        @InjectKafka() private readonly kafkaService: KafkaService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    async onModuleInit() {
        this.logger.log(
            `Subscribe to topic(${KafkaTopic.CRYPTO_PORTFOLIO_CREATED_SUCCESS})`,
        );
        this.kafkaService.subscribeOf(
            KafkaTopic.CRYPTO_PORTFOLIO_CREATED_SUCCESS,
            this,
        );
    }

    @KafkaSubscribeTo(KafkaTopic.CRYPTO_PORTFOLIO_CREATED_SUCCESS)
    private async consume(payload: KafkaEachPayload): Promise<void> {
        const value = payload.message.value;
        const userId = value["userId"];
        const id = value["cryptoPortfolioId"];
        this.logger.log(`Crypto profile is created successfully for ${userId}`);
        const cryptoPortfolio = await this.prisma.cryptoPortfolio.findUnique({
            where: { id, userId },
        });
        await this.pubSub.publish(SubscriptionEvent.CRYPTO_PORTFOLIO_CREATED, {
            [PortfolioEventListener.CREATE_SUCCESS_PAYLOAD_NAME]:
                cryptoPortfolio,
        });
    }
}
