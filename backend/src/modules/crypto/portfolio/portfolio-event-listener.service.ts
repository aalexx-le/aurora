import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { PubSub } from "graphql-subscriptions";
import { PrismaService } from "nestjs-prisma";
import { CreateExecutionStatus } from "src/entities/prisma";
import { SubscriptionEvent } from "src/shared/constants/subscription.event";

interface PortfolioStatusPayload {
    executionId: number;
    status: 'PROCESSING' | 'SUCCESS' | 'FAILED';
    portfolioId?: string;
    error?: string;
    timestamp: Date;
    offset?: string;
    partition?: number;
}

@Controller()
export class PortfolioEventListener {
    private readonly logger = new Logger(PortfolioEventListener.name);

    constructor(
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
        private readonly prisma: PrismaService,
    ) {}
    
    @EventPattern('create-crypto-portfolio-status')
    async handleStatusUpdate(
        @Payload() payload: PortfolioStatusPayload,
        @Ctx() context: KafkaContext
    ) {
        const { executionId } = payload;

        this.logger.log(`Received portfolio status update for execution ${executionId}: ${payload.status}`);

        // Get the execution details
        const execution = await this.prisma.createPortfolioExecution.findUnique({
            where: { id: executionId },
        });

        if (!execution) {
            this.logger.error(`No execution found for ID: ${executionId}`);
            return;
        }

        // Update execution status if provided
        if (payload.status) {
            await this.prisma.createPortfolioExecution.update({
                where: { id: executionId },
                data: { 
                    status: payload.status === 'SUCCESS' ? CreateExecutionStatus.SUCCESS : 
                           payload.status === 'FAILED' ? CreateExecutionStatus.FAILED : CreateExecutionStatus.PROCESSING
                }
            });
        }

        // Publish the status update with the execution data
        await this.pubSub.publish(
            SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS,
            {
                [SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS]: execution,
            },
        );

        this.logger.log(`Published status update for execution ${executionId}`);
    }
}
