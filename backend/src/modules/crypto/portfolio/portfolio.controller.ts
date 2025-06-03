import { Controller, Inject, Logger } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { PubSub } from "graphql-subscriptions";
import { PrismaService } from "nestjs-prisma";
import { KafkaTopic } from "src/shared/constants/kafka";
import { SubscriptionEvent } from "src/shared/constants/subscription.event";
import {
    PortfolioCreationEvent,
    PortfolioCreationSubscriptionPayload
} from "./types/portfolio-event.types";

@Controller()
export class PortfolioController {
    private readonly logger = new Logger(PortfolioController.name);

    constructor(
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
        private readonly prisma: PrismaService,
    ) {}

    /**
     * Enhanced Portfolio Creation Event Handler
     * Handles enum-based progress tracking events from crypto-portfolio-service
     */
    @EventPattern(KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS)
    async handlePortfolioCreationStatus(
        @Payload() payload: PortfolioCreationEvent,
        @Ctx() context: KafkaContext
    ) {
        const { executionId, currentStep, currentMilestone, progressPercent, eventType } = payload;

        this.logger.log(
            `Enhanced portfolio status: execution=${executionId}, step=${currentStep}, ` +
            `milestone=${currentMilestone}, progress=${progressPercent}%, type=${eventType}`
        );

        try {
            // Update the database with comprehensive progress information
            const updatedExecution = await this.prisma.createPortfolioExecution.update({
                where: { id: executionId },
                data: {
                    currentStep: payload.currentStep,
                    currentMilestone: payload.currentMilestone,
                    progressPercent: payload.progressPercent,
                    errorMessage: payload.errorMessage,
                    recoveryAction: payload.recoveryAction,
                    retryCount: payload.retryCount,
                    maxRetries: payload.maxRetries,
                    exchangeType: payload.exchangeType,
                    executionContext: payload.executionContext,
                    updatedAt: new Date(),
                    completedAt: payload.completedAt,
                }
            });

            // Create comprehensive subscription payload
            const subscriptionPayload: PortfolioCreationSubscriptionPayload = {
                execution: {
                    ...payload,
                    updatedAt: updatedExecution.updatedAt,
                },
                isRealTimeUpdate: true,
                source: 'KAFKA_EVENT'
            };

            // Publish to GraphQL subscription with enhanced payload
            await this.pubSub.publish(
                SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS,
                {
                    [SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS]: subscriptionPayload,
                },
            );

            this.logger.log(
                `Published enhanced portfolio creation status for execution ${executionId} ` +
                `(${eventType}): ${currentStep} -> ${currentMilestone} (${progressPercent}%)`
            );

            // Log error details if present
            if (payload.errorMessage) {
                this.logger.warn(
                    `Error in execution ${executionId}: ${payload.errorMessage} ` +
                    `(Recovery: ${payload.recoveryAction}, Retry: ${payload.retryCount}/${payload.maxRetries})`
                );
            }

        } catch (error) {
            this.logger.error(
                `Failed to process enhanced portfolio creation event for execution ${executionId}:`,
                error.stack
            );
        }
    }
}
