import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { PrismaService } from "nestjs-prisma";
import {
    CreatePortfolioExecution,
    ErrorRecoveryAction,
    Exchanges,
    PortfolioCreationMilestone,
    PortfolioCreationStep,
    TradingType,
} from "src/entities/prisma";
import { KafkaTopic } from "src/shared/constants/kafka";
import { isPassphraseRequired } from "../shared/utils/exchange-requirements.util";

interface ProgressUpdate {
    executionId: number;
    currentStep?: PortfolioCreationStep;
    currentMilestone?: PortfolioCreationMilestone;
    progressPercent?: number;
    errorMessage?: string;
    recoveryAction?: ErrorRecoveryAction;
    retryCount?: number;
    exchangeType?: Exchanges;
    executionContext?: any;
    completedAt?: Date;
}

interface MilestoneConfig {
    step: PortfolioCreationStep;
    milestone: PortfolioCreationMilestone;
    progressPercent: number;
    successMilestone?: PortfolioCreationMilestone;
    failureMilestone?: PortfolioCreationMilestone;
}

interface ErrorAnalysis {
    recoveryAction: ErrorRecoveryAction;
    milestone: PortfolioCreationMilestone;
    isRetryable: boolean;
    suggestedDelay?: number;
}

export interface PortfolioData {
    userId: number;
    name: string;
    exchanges: Exchanges;
    apiKey: string;
    secretKey: string;
    passphrase?: string;
    investmentCategoryName?: string;
}

interface AssetBalanceData {
    assetInfoId: string;
    balance: number;
    locked: number;
}

@Injectable()
export class PortfolioProgressService {
    private readonly logger = new Logger(PortfolioProgressService.name);

    // Optimized milestone progression mapping for streamlined 5-step flow
    private readonly milestoneMap: Record<
        PortfolioCreationStep,
        MilestoneConfig
    > = {
        [PortfolioCreationStep.VALIDATION]: {
            step: PortfolioCreationStep.VALIDATION,
            milestone: PortfolioCreationMilestone.INITIALIZED,
            progressPercent: 20,
            successMilestone: PortfolioCreationMilestone.CREDENTIALS_VERIFIED,
            failureMilestone: PortfolioCreationMilestone.VALIDATION_FAILED,
        },
        [PortfolioCreationStep.AUTHENTICATION]: {
            step: PortfolioCreationStep.AUTHENTICATION,
            milestone: PortfolioCreationMilestone.CREDENTIALS_VERIFIED,
            progressPercent: 40,
            successMilestone: PortfolioCreationMilestone.BALANCES_FETCHED,
            failureMilestone: PortfolioCreationMilestone.CREDENTIALS_FAILED,
        },
        [PortfolioCreationStep.BALANCE_RETRIEVAL]: {
            step: PortfolioCreationStep.BALANCE_RETRIEVAL,
            milestone: PortfolioCreationMilestone.BALANCES_FETCHED,
            progressPercent: 70,
            successMilestone: PortfolioCreationMilestone.PORTFOLIO_STORED,
            failureMilestone: PortfolioCreationMilestone.FETCH_FAILED,
        },
        [PortfolioCreationStep.DATABASE_STORAGE]: {
            step: PortfolioCreationStep.DATABASE_STORAGE,
            milestone: PortfolioCreationMilestone.PORTFOLIO_STORED,
            progressPercent: 90,
            successMilestone: PortfolioCreationMilestone.COMPLETED,
            failureMilestone: PortfolioCreationMilestone.STORAGE_FAILED,
        },
        [PortfolioCreationStep.COMPLETION]: {
            step: PortfolioCreationStep.COMPLETION,
            milestone: PortfolioCreationMilestone.COMPLETED,
            progressPercent: 100,
            successMilestone: PortfolioCreationMilestone.COMPLETED,
            failureMilestone: PortfolioCreationMilestone.FAILED,
        },
    };

    constructor(
        private readonly prisma: PrismaService,
        @Inject("KAFKA_SERVICE") private readonly kafkaClient: ClientKafka,
    ) {
        this.logger.log(
            "📊 Portfolio Progress Service initialized with database and progress tracking",
        );
    }

    // =============================================================================
    // PROGRESS TRACKING METHODS
    // =============================================================================

    /**
     * Start tracking progress for a step
     */
    async startStep(
        executionId: number,
        step: PortfolioCreationStep,
        exchangeType?: Exchanges,
    ): Promise<void> {
        const config = this.milestoneMap[step];

        this.logger.log(
            `🚀 Starting step ${step} for execution ${executionId}`,
        );

        // Update database with step start
        const execution = await this.updateProgress({
            executionId,
            currentStep: step,
            currentMilestone: config.milestone,
            progressPercent: config.progressPercent,
            exchangeType,
        });

        // Publish real-time event with userId
        await this.publishProgressEvent(execution);
    }

    /**
     * Mark step as successful and progress to next milestone
     */
    async completeStep(
        executionId: number,
        step: PortfolioCreationStep,
    ): Promise<void> {
        const config = this.milestoneMap[step];

        this.logger.log(
            `✅ Completing step ${step} for execution ${executionId}`,
        );

        // Update database with step completion
        const execution = await this.updateProgress({
            executionId,
            currentMilestone: config.successMilestone || config.milestone,
            progressPercent: Math.min(config.progressPercent + 5, 100), // Slight progress boost on completion
        });

        // Publish real-time event
        await this.publishProgressEvent(execution);
    }

    /**
     * Handle step failure with smart recovery analysis
     */
    async failStep(
        executionId: number,
        step: PortfolioCreationStep,
        error: Error,
    ): Promise<void> {
        const errorAnalysis = this.analyzeError(error, step);

        this.logger.error(
            `❌ Step ${step} failed for execution ${executionId}: ${error.message}`,
        );

        // Check if retry is possible
        const execution = await this.getExecution(executionId);
        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }

        const shouldRetry =
            errorAnalysis.isRetryable &&
            execution.retryCount < execution.maxRetries;

        if (shouldRetry) {
            // Increment retry count and set recovery action
            await this.incrementRetryCount(executionId);
            const updatedExecution = await this.updateProgress({
                executionId,
                errorMessage: error.message,
                recoveryAction: errorAnalysis.recoveryAction,
                currentMilestone: errorAnalysis.milestone,
            });

            await this.publishProgressEvent(updatedExecution);
            this.logger.log(
                `🔄 Retry ${execution.retryCount + 1}/${execution.maxRetries} scheduled for execution ${executionId}`,
            );
        } else {
            // Mark as permanently failed
            const failedExecution = await this.markAsFailed(
                executionId,
                error.message,
                errorAnalysis.recoveryAction,
                step,
                errorAnalysis.milestone,
            );

            await this.publishProgressEvent(failedExecution);
            this.logger.error(
                `💀 Execution ${executionId} permanently failed after ${execution.retryCount} retries`,
            );
        }
    }

    /**
     * Mark entire execution as successful
     */
    async markSuccess(executionId: number): Promise<void> {
        this.logger.log(`🎉 Marking execution ${executionId} as successful`);

        const execution = await this.updateProgress({
            executionId,
            currentMilestone: PortfolioCreationMilestone.COMPLETED,
            progressPercent: 100,
            completedAt: new Date(),
        });

        await this.publishProgressEvent(execution);
    }

    /**
     * Get execution progress details
     */
    async getProgress(executionId: number) {
        const execution = await this.getExecution(executionId);
        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }

        return {
            executionId,
            currentStep: execution.currentStep,
            milestone: execution.currentMilestone,
            progressPercent: execution.progressPercent,
            errorMessage: execution.errorMessage,
            recoveryAction: execution.recoveryAction,
            retryCount: execution.retryCount,
            maxRetries: execution.maxRetries,
        };
    }

    /**
     * Update portfolio creation execution progress
     */
    async updateProgress(
        updates: ProgressUpdate,
    ): Promise<CreatePortfolioExecution> {
        const { executionId, ...updateData } = updates;

        this.logger.debug(
            `📊 Updating progress for execution ${executionId}:`,
            updateData,
        );

        try {
            const updatedExecution =
                await this.prisma.createPortfolioExecution.update({
                    where: { id: executionId },
                    data: {
                        ...updateData,
                        updatedAt: new Date(),
                    },
                });

            this.logger.debug(
                `✅ Progress updated for execution ${executionId}`,
            );
            return updatedExecution;
        } catch (error) {
            this.logger.error(
                `❌ Failed to update progress for execution ${executionId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Mark execution as failed with error details
     */
    async markAsFailed(
        executionId: number,
        errorMessage: string,
        recoveryAction: ErrorRecoveryAction,
        currentStep?: PortfolioCreationStep,
        milestone?: PortfolioCreationMilestone,
    ): Promise<CreatePortfolioExecution> {
        this.logger.error(
            `❌ Marking execution ${executionId} as failed: ${errorMessage}`,
        );

        return this.updateProgress({
            executionId,
            currentStep,
            currentMilestone: milestone || PortfolioCreationMilestone.FAILED,
            errorMessage,
            recoveryAction,
            progressPercent: 0,
        });
    }

    /**
     * Increment retry count
     */
    async incrementRetryCount(
        executionId: number,
    ): Promise<CreatePortfolioExecution> {
        const execution = await this.prisma.createPortfolioExecution.findUnique(
            {
                where: { id: executionId },
            },
        );

        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }

        return this.updateProgress({
            executionId,
            retryCount: execution.retryCount + 1,
        });
    }

    /**
     * Get execution details
     */
    async getExecution(executionId: number) {
        return this.prisma.createPortfolioExecution.findUnique({
            where: { id: executionId },
        });
    }

    /**
     * Create a new crypto portfolio
     */
    async createPortfolio(portfolioData: PortfolioData): Promise<string> {
        this.logger.debug("💾 Creating new crypto portfolio in database...");

        try {
            let parentPortfolio = await this.prisma.cryptoPortfolio.findFirst({
                where: {
                    userId: portfolioData.userId,
                    exchanges: Exchanges.ALL
                },
            });

            if (!parentPortfolio) {
                const createdParentPortfolio = await this.prisma.cryptoPortfolio.create({
                    data: {
                        parentPortfolioId: parentPortfolio.id,
                        userId: portfolioData.userId,
                        name: Exchanges.ALL,
                        exchanges: Exchanges.ALL,
                        tradingType: TradingType.SPOT,
                        apiKey: "",
                        secretKey: "",
                    },
                });

                parentPortfolio = createdParentPortfolio;

                this.logger.debug(`✅ Parent portfolio created with ID: ${createdParentPortfolio.id}`);
            }

            this.logger.debug(`🔍 Found parent portfolio ${parentPortfolio.id}`);

            const portfolio = await this.prisma.cryptoPortfolio.create({
                data: {
                    parentPortfolioId: parentPortfolio.id,
                    userId: portfolioData.userId,
                    name: portfolioData.name,
                    exchanges: portfolioData.exchanges,
                    tradingType: TradingType.SPOT,
                    apiKey: portfolioData.apiKey,
                    secretKey: portfolioData.secretKey,
                },
            });

            this.logger.debug(`✅ Portfolio created with ID: ${portfolio.id}`);

            // Create PassphraseCryptoPortfolio if exchange requires passphrase
            if (portfolioData.passphrase && isPassphraseRequired(portfolioData.exchanges)) {
                await this.prisma.passphraseCryptoPortfolio.create({
                    data: {
                        cryptoPortfolioId: portfolio.id,
                        passphrase: portfolioData.passphrase,
                    },
                });

                this.logger.debug(`✅ PassphraseCryptoPortfolio created for portfolio ${portfolio.id} (${portfolioData.exchanges})`);
            }

            return portfolio.id;
        } catch (error) {
            this.logger.error("❌ Failed to create portfolio:", error);
            throw error;
        }
    }

    /**
     * Create or update asset balances for a portfolio
     */
    async upsertAssetBalances(
        portfolioId: string,
        balances: AssetBalanceData[],
    ): Promise<void> {
        this.logger.debug(
            `💰 Upserting ${balances.length} asset balances for portfolio ${portfolioId}...`,
        );

        try {
            // Use transaction to ensure all balances are updated atomically
            await this.prisma.$transaction(async (tx) => {
                for (const balance of balances) {
                    // Check if asset balance already exists for this portfolio and asset
                    const existingBalance = await tx.assetBalance.findFirst({
                        where: {
                            cryptoPortfolioId: portfolioId,
                            assetInfoId: balance.assetInfoId,
                        },
                    });

                    if (existingBalance) {
                        // Update existing balance
                        await tx.assetBalance.update({
                            where: { id: existingBalance.id },
                            data: {
                                balance: balance.balance,
                                locked: balance.locked,
                            },
                        });
                    } else {
                        // Create new balance record
                        await tx.assetBalance.create({
                            data: {
                                assetInfoId: balance.assetInfoId,
                                balance: balance.balance,
                                locked: balance.locked,
                                cryptoPortfolioId: portfolioId,
                            },
                        });
                    }
                }
            });

            this.logger.debug(
                `✅ Asset balances upserted successfully for portfolio ${portfolioId}`,
            );
        } catch (error) {
            this.logger.error("❌ Failed to upsert asset balances:", error);
            throw error;
        }
    }

    /**
     * Find or create asset info record
     */
    async findOrCreateAssetInfo(
        symbol: string,
        assetData?: {
            name?: string;
            category?: string;
            desc?: string;
            logo?: string;
        },
    ): Promise<string> {
        try {
            const existingAsset = await this.prisma.assetInfo.findFirst({
                where: { symbol },
            });

            if (existingAsset) {
                return existingAsset.id;
            }

            // Create new asset info
            const newAsset = await this.prisma.assetInfo.create({
                data: {
                    symbol,
                    name: assetData?.name || symbol,
                    category: assetData?.category || "Cryptocurrency",
                    desc: assetData?.desc || `${symbol} cryptocurrency`,
                    logo: assetData?.logo || "",
                },
            });

            this.logger.debug(
                `✅ Created new asset info for ${symbol}: ${newAsset.id}`,
            );
            return newAsset.id;
        } catch (error) {
            this.logger.error(
                `❌ Failed to find or create asset info for ${symbol}:`,
                error,
            );
            throw error;
        }
    }

    // =============================================================================
    // PRIVATE HELPER METHODS
    // =============================================================================

    /**
     * Analyze error to determine recovery action and milestone
     */
    private analyzeError(
        error: Error,
        step: PortfolioCreationStep,
    ): ErrorAnalysis {
        const errorMessage = error.message.toLowerCase();
        const config = this.milestoneMap[step];

        // Context-aware error analysis based on step and error type
        if (step === PortfolioCreationStep.VALIDATION) {
            if (
                errorMessage.includes("exchange") &&
                errorMessage.includes("not supported")
            ) {
                return {
                    recoveryAction: ErrorRecoveryAction.CONTACT_SUPPORT,
                    milestone: PortfolioCreationMilestone.VALIDATION_FAILED,
                    isRetryable: false,
                };
            }
        }

        if (step === PortfolioCreationStep.AUTHENTICATION) {
            if (
                errorMessage.includes("api") ||
                errorMessage.includes("secret")
            ) {
                return {
                    recoveryAction: ErrorRecoveryAction.UPDATE_CREDENTIALS,
                    milestone: PortfolioCreationMilestone.CREDENTIALS_FAILED,
                    isRetryable: false,
                };
            }
            // Handle connection-related errors in AUTHENTICATION step (merged from CONNECTION)
            if (
                errorMessage.includes("timeout") ||
                errorMessage.includes("network")
            ) {
                return {
                    recoveryAction: ErrorRecoveryAction.RETRY_AUTOMATIC,
                    milestone: PortfolioCreationMilestone.CREDENTIALS_FAILED,
                    isRetryable: true,
                    suggestedDelay: 5000,
                };
            }
            if (
                errorMessage.includes("rate limit") ||
                errorMessage.includes("too many requests")
            ) {
                return {
                    recoveryAction: ErrorRecoveryAction.WAIT_RATE_LIMIT,
                    milestone: PortfolioCreationMilestone.CREDENTIALS_FAILED,
                    isRetryable: true,
                    suggestedDelay: 60000,
                };
            }
        }

        // Default analysis for unspecified errors
        return {
            recoveryAction: ErrorRecoveryAction.CONTACT_SUPPORT,
            milestone:
                config.failureMilestone || PortfolioCreationMilestone.FAILED,
            isRetryable: false,
        };
    }

    /**
     * Publish progress event to Kafka for real-time updates
     */
    private async publishProgressEvent(execution: CreatePortfolioExecution): Promise<void> {
        try {
            await this.kafkaClient.emit(
                KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS,
                execution,
            );
            this.logger.debug(
                `📡 Published progress event for execution ${execution.id}`,
            );
        } catch (error) {
            this.logger.error("❌ Failed to publish progress event:", error);
            // Don't throw here to avoid breaking the main flow
        }
    }
}
