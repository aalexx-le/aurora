import { Controller, Inject, Logger } from "@nestjs/common";
import {
    Ctx,
    EventPattern,
    KafkaContext,
    Payload,
} from "@nestjs/microservices";
import { PubSub } from "graphql-subscriptions";
import { PrismaService } from "nestjs-prisma";
import { KafkaTopic } from "src/shared/constants/kafka";
import { SubscriptionEvent } from "src/shared/constants/subscription.event";
import { CreatePortfolioExecution } from "../../../entities/create-portfolio-execution";

@Controller()
export class PortfolioController {
    public static readonly NEW_CREATE_PORTFOLIO_EXECUTION_PAYLOAD =
        "onCreatePortfolioExecution";
    private readonly logger = new Logger(PortfolioController.name);

    constructor(
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
        private readonly prisma: PrismaService,
    ) {}

    @EventPattern(KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS)
    async handlePortfolioCreationStatus(
        @Payload() payload: CreatePortfolioExecution,
        @Ctx() context: KafkaContext,
    ) {
        const { id, currentStep, currentMilestone, progressPercent } = payload;

        this.logger.log(
            `Enhanced portfolio status: execution=${id}, step=${currentStep}, ` +
                `milestone=${currentMilestone}, progress=${progressPercent}%`,
        );

        try {
            // Update the database with comprehensive progress information
            const updatedExecution =
                await this.prisma.createPortfolioExecution.update({
                    where: { id: id },
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
                    },
                });

            // Publish to GraphQL subscription with enhanced payload
            await this.pubSub.publish(
                SubscriptionEvent.CRYPTO_PORTFOLIO_CREATION_STATUS,
                {
                    [PortfolioController.NEW_CREATE_PORTFOLIO_EXECUTION_PAYLOAD]:
                        updatedExecution,
                },
            );

            this.logger.log(
                `Published enhanced portfolio creation status for execution ${id} ` +
                    `(${currentStep} -> ${currentMilestone} (${progressPercent}%)`,
            );

            // Log error details if present
            if (payload.errorMessage) {
                this.logger.warn(
                    `Error in execution ${id}: ${payload.errorMessage} ` +
                        `(Recovery: ${payload.recoveryAction}, Retry: ${payload.retryCount}/${payload.maxRetries})`,
                );
            }
        } catch (error) {
            this.logger.error(
                `Failed to process enhanced portfolio creation event for execution ${id}:`,
                error.stack,
            );
        }
    }
}
