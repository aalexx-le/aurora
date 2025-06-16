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
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const nestjs_prisma_1 = require("nestjs-prisma");
const prisma_1 = require("./entities/prisma");
const portfolio_creation_service_1 = require("./services/portfolio-creation.service");
const kafka_1 = require("./shared/constants/kafka");
let AppController = AppController_1 = class AppController {
    constructor(kafkaClient, prisma, portfolioCreationService) {
        this.kafkaClient = kafkaClient;
        this.prisma = prisma;
        this.portfolioCreationService = portfolioCreationService;
        this.logger = new common_1.Logger(AppController_1.name);
    }
    async handlePortfolioCreation(payload, context) {
        const originalMessage = context.getMessage();
        const partition = context.getPartition();
        const offset = originalMessage.offset;
        this.logger.log(`📥 Received portfolio creation request for execution ${payload.executionId}`);
        this.logger.debug(`Message details: partition=${partition}, offset=${offset}`);
        try {
            const result = await this.portfolioCreationService.createPortfolio(payload);
            this.logger.log(`✅ Successfully processed portfolio creation for execution ${payload.executionId}, portfolio ID: ${result.portfolioId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to process portfolio creation for execution ${payload.executionId}:`, error);
        }
    }
    async handlePortfolioRetry(payload, context) {
        const originalMessage = context.getMessage();
        const partition = context.getPartition();
        const offset = originalMessage.offset;
        this.logger.log(`📥 Received portfolio retry request for execution ${payload.executionId} (current retry: ${payload.currentRetryCount})`);
        this.logger.debug(`Message details: partition=${partition}, offset=${offset}`);
        try {
            const newRetryCount = payload.currentRetryCount + 1;
            const updatedExecution = await this.prisma.createPortfolioExecution.update({
                where: { id: payload.executionId },
                data: {
                    retryCount: newRetryCount,
                    currentStep: prisma_1.PortfolioCreationStep.VALIDATION,
                    currentMilestone: prisma_1.PortfolioCreationMilestone.INITIALIZED,
                    progressPercent: 0,
                    errorMessage: null,
                    recoveryAction: null,
                    updatedAt: new Date(),
                },
            });
            this.kafkaClient.emit(kafka_1.KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS, updatedExecution);
            this.logger.log(`🔄 Updated execution ${payload.executionId} for retry ${newRetryCount}`);
            const result = await this.portfolioCreationService.retryPortfolioCreation({
                userId: payload.userId,
                executionId: payload.executionId,
            });
            this.logger.log(`✅ Successfully processed portfolio retry for execution ${payload.executionId}, portfolio ID: ${result.portfolioId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to process portfolio retry for execution ${payload.executionId}:`, error);
        }
    }
    async handleCredentialUpdate(payload, context) {
        const originalMessage = context.getMessage();
        const partition = context.getPartition();
        const offset = originalMessage.offset;
        this.logger.log(`📥 Received credential update request for execution ${payload.executionId}`);
        this.logger.debug(`Message details: partition=${partition}, offset=${offset}`);
        try {
            const updatedExecution = await this.prisma.createPortfolioExecution.update({
                where: { id: payload.executionId },
                data: {
                    currentStep: prisma_1.PortfolioCreationStep.VALIDATION,
                    currentMilestone: prisma_1.PortfolioCreationMilestone.INITIALIZED,
                    progressPercent: 0,
                    errorMessage: null,
                    recoveryAction: null,
                    updatedAt: new Date(),
                },
            });
            this.kafkaClient.emit(kafka_1.KafkaTopic.CRYPTO_PORTFOLIO_CREATION_STATUS, updatedExecution);
            this.logger.log(`🔑 Reset execution ${payload.executionId} status for credential update`);
            const result = await this.portfolioCreationService.updatePortfolioCredentials({
                userId: payload.userId,
                executionId: payload.executionId,
                apiKey: payload.apiKey,
                secretKey: payload.secretKey,
                passphrase: payload.passphrase,
            });
            this.logger.log(`✅ Successfully processed credential update for execution ${payload.executionId}, portfolio ID: ${result.portfolioId}`);
        }
        catch (error) {
            this.logger.error(`❌ Failed to process credential update for execution ${payload.executionId}:`, error);
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, microservices_1.EventPattern)(kafka_1.KafkaTopic.CREATE_CRYPTO_PORTFOLIO),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.KafkaContext]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handlePortfolioCreation", null);
__decorate([
    (0, microservices_1.EventPattern)(kafka_1.KafkaTopic.RETRY_CRYPTO_PORTFOLIO),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.KafkaContext]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handlePortfolioRetry", null);
__decorate([
    (0, microservices_1.EventPattern)(kafka_1.KafkaTopic.UPDATE_CRYPTO_PORTFOLIO_CREDENTIALS),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.KafkaContext]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "handleCredentialUpdate", null);
exports.AppController = AppController = AppController_1 = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)("KAFKA_SERVICE")),
    __metadata("design:paramtypes", [microservices_1.ClientKafka,
        nestjs_prisma_1.PrismaService,
        portfolio_creation_service_1.PortfolioCreationService])
], AppController);
//# sourceMappingURL=app.controller.js.map