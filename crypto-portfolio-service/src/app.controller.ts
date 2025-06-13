import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { PrismaService } from 'nestjs-prisma';
import { KafkaTopic } from './shared/constants/kafka';
import { PortfolioCreationMilestone, PortfolioCreationStep } from 'src/entities/prisma';
import { PortfolioCreationService } from './services/portfolio-creation.service';

// Interface for the portfolio creation payload
interface CreatePortfolioPayload {
  userId: number;
  executionId: number;
  exchanges: string; // Will be normalized to lowercase for CCXT compatibility
  apiKey: string;
  secretKey: string;
  passphrase?: string;
  sandbox?: boolean;
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    @Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
    private readonly prisma: PrismaService,
    private readonly portfolioCreationService: PortfolioCreationService,
  ) {}

  @EventPattern(KafkaTopic.CREATE_CRYPTO_PORTFOLIO)
    async handlePortfolioCreation(
        @Payload() payload: CreatePortfolioPayload,
        @Ctx() context: KafkaContext,
    ) {
        const originalMessage = context.getMessage();
        const partition = context.getPartition();
        const offset = originalMessage.offset;

        this.logger.log(
            `📥 Received portfolio creation request for execution ${payload.executionId}`,
        );
        this.logger.debug(
            `Message details: partition=${partition}, offset=${offset}`,
        );

        try {
            // Process portfolio creation using integrated service
            const result =
                await this.portfolioCreationService.createPortfolio(payload);

            this.logger.log(
                `✅ Successfully processed portfolio creation for execution ${payload.executionId}, portfolio ID: ${result.portfolioId}`,
            );
        } catch (error) {
            this.logger.error(
                `❌ Failed to process portfolio creation for execution ${payload.executionId}:`,
                error,
            );
        }
    }

    @EventPattern(KafkaTopic.RETRY_CRYPTO_PORTFOLIO)
    async handlePortfolioRetry(
        @Payload() payload: { userId: number; executionId: number; currentRetryCount: number; timestamp: string },
        @Ctx() context: KafkaContext,
    ) {
        const originalMessage = context.getMessage();
        const partition = context.getPartition();
        const offset = originalMessage.offset;

        this.logger.log(
            `📥 Received portfolio retry request for execution ${payload.executionId} (current retry: ${payload.currentRetryCount})`,
        );
        this.logger.debug(
            `Message details: partition=${partition}, offset=${offset}`,
        );

        try {
            // Update retry count and reset status for retry (following event-driven pattern)
            const newRetryCount = payload.currentRetryCount + 1;
            const updatedExecution = await this.prisma.createPortfolioExecution.update({
                where: { id: payload.executionId },
                data: {
                    retryCount: newRetryCount,
                    currentStep: PortfolioCreationStep.VALIDATION,
                    currentMilestone: PortfolioCreationMilestone.INITIALIZED,
                    progressPercent: 0,
                    errorMessage: null,
                    recoveryAction: null,
                    updatedAt: new Date(),
                },
            });

            this.kafkaClient.emit(KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS, updatedExecution);

            this.logger.log(`🔄 Updated execution ${payload.executionId} for retry ${newRetryCount}`);

            // Use the context-aware retry method from portfolio creation service
            const result = await this.portfolioCreationService.retryPortfolioCreation({
                userId: payload.userId,
                executionId: payload.executionId,
            });
    
            this.logger.log(
                `✅ Successfully processed portfolio retry for execution ${payload.executionId}, portfolio ID: ${result.portfolioId}`,
            );
        } catch (error) {
            this.logger.error(
                `❌ Failed to process portfolio retry for execution ${payload.executionId}:`,
                error,
            );
        }
    }

    @EventPattern(KafkaTopic.UPDATE_CRYPTO_PORTFOLIO_CREDENTIALS)
    async handleCredentialUpdate(
        @Payload() payload: { 
            userId: number; 
            executionId: number; 
            apiKey: string; 
            secretKey: string; 
            passphrase?: string; 
            timestamp: string 
        },
        @Ctx() context: KafkaContext,
    ) {
        const originalMessage = context.getMessage();
        const partition = context.getPartition();
        const offset = originalMessage.offset;

        this.logger.log(
            `📥 Received credential update request for execution ${payload.executionId}`,
        );
        this.logger.debug(
            `Message details: partition=${partition}, offset=${offset}`,
        );

        try {
            const updatedExecution = await this.prisma.createPortfolioExecution.update({
                where: { id: payload.executionId },
                data: {
                    currentStep: PortfolioCreationStep.VALIDATION,
                    currentMilestone: PortfolioCreationMilestone.INITIALIZED,
                    progressPercent: 0,
                    errorMessage: null,
                    recoveryAction: null,
                    updatedAt: new Date(),
                },
            });

            this.kafkaClient.emit(KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS, updatedExecution);

            this.logger.log(`🔑 Reset execution ${payload.executionId} status for credential update`);

            // Use the context-aware credential update method from portfolio creation service
            const result = await this.portfolioCreationService.updatePortfolioCredentials({
                userId: payload.userId,
                executionId: payload.executionId,
                apiKey: payload.apiKey,
                secretKey: payload.secretKey,
                passphrase: payload.passphrase,
            });            

            this.logger.log(
                `✅ Successfully processed credential update for execution ${payload.executionId}, portfolio ID: ${result.portfolioId}`,
            );
        } catch (error) {
            this.logger.error(
                `❌ Failed to process credential update for execution ${payload.executionId}:`,
                error,
            );
        }
    }
}
