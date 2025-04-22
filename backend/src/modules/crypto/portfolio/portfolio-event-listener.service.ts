import { Inject, Injectable } from "@nestjs/common";
import { PubSub } from "graphql-subscriptions";
import { PrismaService } from "nestjs-prisma";
import { SubscriptionEvent } from "src/shared/constants/subscription.event";

@Injectable()
export class PortfolioEventListener {
    constructor(
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
        private readonly prisma: PrismaService,
    ) {}

    async consume(payload: any) {
        const { executionId } = payload;

        // Get the execution details
        const execution = await this.prisma.createPortfolioExecution.findUnique(
            {
                where: { id: executionId },
            },
        );

        if (!execution) {
            console.error(`No execution found for ID: ${executionId}`);
            return;
        }

        // Publish the status update with the execution data
        await this.pubSub.publish(
            SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS,
            {
                [SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS]: execution,
            },
        );
    }
}
