"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PortfolioProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioProgressService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const nestjs_prisma_1 = require("nestjs-prisma");
const prisma_1 = require("../entities/prisma");
const kafka_1 = require("../shared/constants/kafka");
const exchange_requirements_util_1 = require("../shared/utils/exchange-requirements.util");
let PortfolioProgressService = PortfolioProgressService_1 = class PortfolioProgressService {
    constructor(prisma, kafkaClient) {
        this.prisma = prisma;
        this.kafkaClient = kafkaClient;
        this.logger = new common_1.Logger(PortfolioProgressService_1.name);
        this.milestoneMap = {
            [prisma_1.PortfolioCreationStep.VALIDATION]: {
                step: prisma_1.PortfolioCreationStep.VALIDATION,
                milestone: prisma_1.PortfolioCreationMilestone.INITIALIZED,
                progressPercent: 20,
                successMilestone: prisma_1.PortfolioCreationMilestone.CREDENTIALS_VERIFIED,
                failureMilestone: prisma_1.PortfolioCreationMilestone.VALIDATION_FAILED,
            },
            [prisma_1.PortfolioCreationStep.AUTHENTICATION]: {
                step: prisma_1.PortfolioCreationStep.AUTHENTICATION,
                milestone: prisma_1.PortfolioCreationMilestone.CREDENTIALS_VERIFIED,
                progressPercent: 40,
                successMilestone: prisma_1.PortfolioCreationMilestone.BALANCES_FETCHED,
                failureMilestone: prisma_1.PortfolioCreationMilestone.CREDENTIALS_FAILED,
            },
            [prisma_1.PortfolioCreationStep.BALANCE_RETRIEVAL]: {
                step: prisma_1.PortfolioCreationStep.BALANCE_RETRIEVAL,
                milestone: prisma_1.PortfolioCreationMilestone.BALANCES_FETCHED,
                progressPercent: 70,
                successMilestone: prisma_1.PortfolioCreationMilestone.PORTFOLIO_STORED,
                failureMilestone: prisma_1.PortfolioCreationMilestone.FETCH_FAILED,
            },
            [prisma_1.PortfolioCreationStep.DATABASE_STORAGE]: {
                step: prisma_1.PortfolioCreationStep.DATABASE_STORAGE,
                milestone: prisma_1.PortfolioCreationMilestone.PORTFOLIO_STORED,
                progressPercent: 90,
                successMilestone: prisma_1.PortfolioCreationMilestone.COMPLETED,
                failureMilestone: prisma_1.PortfolioCreationMilestone.STORAGE_FAILED,
            },
            [prisma_1.PortfolioCreationStep.COMPLETION]: {
                step: prisma_1.PortfolioCreationStep.COMPLETION,
                milestone: prisma_1.PortfolioCreationMilestone.COMPLETED,
                progressPercent: 100,
                successMilestone: prisma_1.PortfolioCreationMilestone.COMPLETED,
                failureMilestone: prisma_1.PortfolioCreationMilestone.FAILED,
            },
        };
        this.logger.log("📊 Portfolio Progress Service initialized with database and progress tracking");
    }
    async startStep(executionId, step, exchangeType) {
        const config = this.milestoneMap[step];
        this.logger.log(`🚀 Starting step ${step} for execution ${executionId}`);
        const execution = await this.updateProgress({
            executionId,
            currentStep: step,
            currentMilestone: config.milestone,
            progressPercent: config.progressPercent,
            exchangeType,
        });
        await this.publishProgressEvent(execution);
    }
    async completeStep(executionId, step) {
        const config = this.milestoneMap[step];
        this.logger.log(`✅ Completing step ${step} for execution ${executionId}`);
        const execution = await this.updateProgress({
            executionId,
            currentMilestone: config.successMilestone || config.milestone,
            progressPercent: Math.min(config.progressPercent + 5, 100),
        });
        await this.publishProgressEvent(execution);
    }
    async failStep(executionId, step, error) {
        const errorAnalysis = this.analyzeError(error, step);
        this.logger.error(`❌ Step ${step} failed for execution ${executionId}: ${error.message}`);
        const execution = await this.getExecution(executionId);
        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }
        const shouldRetry = errorAnalysis.isRetryable &&
            execution.retryCount < execution.maxRetries;
        if (shouldRetry) {
            await this.incrementRetryCount(executionId);
            const updatedExecution = await this.updateProgress({
                executionId,
                errorMessage: error.message,
                recoveryAction: errorAnalysis.recoveryAction,
                currentMilestone: errorAnalysis.milestone,
            });
            await this.publishProgressEvent(updatedExecution);
            this.logger.log(`🔄 Retry ${execution.retryCount + 1}/${execution.maxRetries} scheduled for execution ${executionId}`);
        }
        else {
            const failedExecution = await this.markAsFailed(executionId, error.message, errorAnalysis.recoveryAction, step, errorAnalysis.milestone);
            await this.publishProgressEvent(failedExecution);
            this.logger.error(`💀 Execution ${executionId} permanently failed after ${execution.retryCount} retries`);
        }
    }
    async markSuccess(executionId) {
        this.logger.log(`🎉 Marking execution ${executionId} as successful`);
        const execution = await this.updateProgress({
            executionId,
            currentMilestone: prisma_1.PortfolioCreationMilestone.COMPLETED,
            progressPercent: 100,
            completedAt: new Date(),
        });
        await this.publishProgressEvent(execution);
    }
    async getProgress(executionId) {
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
    async updateProgress(updates) {
        const { executionId, ...updateData } = updates;
        this.logger.debug(`📊 Updating progress for execution ${executionId}:`, updateData);
        try {
            const updatedExecution = await this.prisma.createPortfolioExecution.update({
                where: { id: executionId },
                data: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            });
            this.logger.debug(`✅ Progress updated for execution ${executionId}`);
            return updatedExecution;
        }
        catch (error) {
            this.logger.error(`❌ Failed to update progress for execution ${executionId}:`, error);
            throw error;
        }
    }
    async markAsFailed(executionId, errorMessage, recoveryAction, currentStep, milestone) {
        this.logger.error(`❌ Marking execution ${executionId} as failed: ${errorMessage}`);
        return this.updateProgress({
            executionId,
            currentStep,
            currentMilestone: milestone || prisma_1.PortfolioCreationMilestone.FAILED,
            errorMessage,
            recoveryAction,
            progressPercent: 0,
        });
    }
    async incrementRetryCount(executionId) {
        const execution = await this.prisma.createPortfolioExecution.findUnique({
            where: { id: executionId },
        });
        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }
        return this.updateProgress({
            executionId,
            retryCount: execution.retryCount + 1,
        });
    }
    async getExecution(executionId) {
        return this.prisma.createPortfolioExecution.findUnique({
            where: { id: executionId },
        });
    }
    async createPortfolio(portfolioData) {
        this.logger.debug("💾 Creating new crypto portfolio in database...");
        try {
            let parentPortfolio = await this.prisma.cryptoPortfolio.findFirst({
                where: {
                    userId: portfolioData.userId,
                    exchanges: prisma_1.Exchanges.ALL
                },
            });
            if (!parentPortfolio) {
                const createdParentPortfolio = await this.prisma.cryptoPortfolio.create({
                    data: {
                        parentPortfolioId: parentPortfolio.id,
                        userId: portfolioData.userId,
                        name: prisma_1.Exchanges.ALL,
                        exchanges: prisma_1.Exchanges.ALL,
                        tradingType: prisma_1.TradingType.SPOT,
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
                    tradingType: prisma_1.TradingType.SPOT,
                    apiKey: portfolioData.apiKey,
                    secretKey: portfolioData.secretKey,
                },
            });
            this.logger.debug(`✅ Portfolio created with ID: ${portfolio.id}`);
            if (portfolioData.passphrase && (0, exchange_requirements_util_1.isPassphraseRequired)(portfolioData.exchanges)) {
                await this.prisma.passphraseCryptoPortfolio.create({
                    data: {
                        cryptoPortfolioId: portfolio.id,
                        passphrase: portfolioData.passphrase,
                    },
                });
                this.logger.debug(`✅ PassphraseCryptoPortfolio created for portfolio ${portfolio.id} (${portfolioData.exchanges})`);
            }
            return portfolio.id;
        }
        catch (error) {
            this.logger.error("❌ Failed to create portfolio:", error);
            throw error;
        }
    }
    async upsertAssetBalances(portfolioId, balances) {
        this.logger.debug(`💰 Upserting ${balances.length} asset balances for portfolio ${portfolioId}...`);
        try {
            await this.prisma.$transaction(async (tx) => {
                for (const balance of balances) {
                    const existingBalance = await tx.assetBalance.findFirst({
                        where: {
                            cryptoPortfolioId: portfolioId,
                            assetInfoId: balance.assetInfoId,
                        },
                    });
                    if (existingBalance) {
                        await tx.assetBalance.update({
                            where: { id: existingBalance.id },
                            data: {
                                balance: balance.balance,
                                locked: balance.locked,
                            },
                        });
                    }
                    else {
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
            this.logger.debug(`✅ Asset balances upserted successfully for portfolio ${portfolioId}`);
        }
        catch (error) {
            this.logger.error("❌ Failed to upsert asset balances:", error);
            throw error;
        }
    }
    async findOrCreateAssetInfo(symbol, assetData) {
        try {
            const existingAsset = await this.prisma.assetInfo.findFirst({
                where: { symbol },
            });
            if (existingAsset) {
                return existingAsset.id;
            }
            const newAsset = await this.prisma.assetInfo.create({
                data: {
                    symbol,
                    name: assetData?.name || symbol,
                    category: assetData?.category || "Cryptocurrency",
                    desc: assetData?.desc || `${symbol} cryptocurrency`,
                    logo: assetData?.logo || "",
                },
            });
            this.logger.debug(`✅ Created new asset info for ${symbol}: ${newAsset.id}`);
            return newAsset.id;
        }
        catch (error) {
            this.logger.error(`❌ Failed to find or create asset info for ${symbol}:`, error);
            throw error;
        }
    }
    analyzeError(error, step) {
        const errorMessage = error.message.toLowerCase();
        const config = this.milestoneMap[step];
        if (step === prisma_1.PortfolioCreationStep.VALIDATION) {
            if (errorMessage.includes("exchange") &&
                errorMessage.includes("not supported")) {
                return {
                    recoveryAction: prisma_1.ErrorRecoveryAction.CONTACT_SUPPORT,
                    milestone: prisma_1.PortfolioCreationMilestone.VALIDATION_FAILED,
                    isRetryable: false,
                };
            }
        }
        if (step === prisma_1.PortfolioCreationStep.AUTHENTICATION) {
            if (errorMessage.includes("api") ||
                errorMessage.includes("secret")) {
                return {
                    recoveryAction: prisma_1.ErrorRecoveryAction.UPDATE_CREDENTIALS,
                    milestone: prisma_1.PortfolioCreationMilestone.CREDENTIALS_FAILED,
                    isRetryable: false,
                };
            }
            if (errorMessage.includes("timeout") ||
                errorMessage.includes("network")) {
                return {
                    recoveryAction: prisma_1.ErrorRecoveryAction.RETRY_AUTOMATIC,
                    milestone: prisma_1.PortfolioCreationMilestone.CREDENTIALS_FAILED,
                    isRetryable: true,
                    suggestedDelay: 5000,
                };
            }
            if (errorMessage.includes("rate limit") ||
                errorMessage.includes("too many requests")) {
                return {
                    recoveryAction: prisma_1.ErrorRecoveryAction.WAIT_RATE_LIMIT,
                    milestone: prisma_1.PortfolioCreationMilestone.CREDENTIALS_FAILED,
                    isRetryable: true,
                    suggestedDelay: 60000,
                };
            }
        }
        return {
            recoveryAction: prisma_1.ErrorRecoveryAction.CONTACT_SUPPORT,
            milestone: config.failureMilestone || prisma_1.PortfolioCreationMilestone.FAILED,
            isRetryable: false,
        };
    }
    async publishProgressEvent(execution) {
        try {
            await this.kafkaClient.emit(kafka_1.KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS, execution);
            this.logger.debug(`📡 Published progress event for execution ${execution.id}`);
        }
        catch (error) {
            this.logger.error("❌ Failed to publish progress event:", error);
        }
    }
};
exports.PortfolioProgressService = PortfolioProgressService;
exports.PortfolioProgressService = PortfolioProgressService = PortfolioProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)("KAFKA_SERVICE")),
    __metadata("design:paramtypes", [nestjs_prisma_1.PrismaService,
        microservices_1.ClientKafka])
], PortfolioProgressService);
//# sourceMappingURL=portfolio-progress.service.js.map