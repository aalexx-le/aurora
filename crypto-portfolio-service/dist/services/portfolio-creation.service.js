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
var PortfolioCreationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioCreationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_1 = require("../entities/prisma");
const portfolio_exchange_service_1 = require("./portfolio-exchange.service");
const portfolio_progress_service_1 = require("./portfolio-progress.service");
let PortfolioCreationService = PortfolioCreationService_1 = class PortfolioCreationService {
    constructor(portfolioExchangeService, portfolioProgressService) {
        this.portfolioExchangeService = portfolioExchangeService;
        this.portfolioProgressService = portfolioProgressService;
        this.logger = new common_1.Logger(PortfolioCreationService_1.name);
        this.logger.log("🏗️ Portfolio Creation Service initialized with integrated services and enum-based progress tracking");
    }
    async createPortfolio(payload) {
        const { userId, executionId, name, exchanges, apiKey, secretKey, passphrase, } = payload;
        const normalizedExchange = exchanges.toLowerCase();
        const exchangeEnum = exchanges;
        this.logger.log(`🚀 Creating portfolio for user ${userId}, execution ${executionId}, exchange ${normalizedExchange} (original: ${exchanges})`);
        try {
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.VALIDATION, exchangeEnum);
            await this.validateExchange(normalizedExchange);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.VALIDATION);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.AUTHENTICATION, exchangeEnum);
            const credentials = await this.decryptCredentials({
                apiKey,
                secretKey,
                passphrase,
            });
            await this.testExchangeConnection(normalizedExchange, credentials);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.AUTHENTICATION);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.BALANCE_RETRIEVAL, exchangeEnum);
            const balances = await this.fetchAccountBalances(normalizedExchange, credentials);
            const processedBalances = await this.processBalances(balances);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.BALANCE_RETRIEVAL);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.DATABASE_STORAGE, exchangeEnum);
            const portfolioId = await this.createPortfolioRecord({
                userId,
                exchanges: exchangeEnum,
                name: name || `${exchanges} Portfolio`,
                apiKey,
                secretKey,
            });
            await this.storeAssetBalances(portfolioId, processedBalances);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.DATABASE_STORAGE);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.COMPLETION, exchangeEnum);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.COMPLETION);
            await this.portfolioProgressService.markSuccess(executionId);
            this.logger.log(`✅ Portfolio creation successful: ${portfolioId}`);
            return {
                portfolioId,
                balances,
                assets: balances,
                exchangeInfo: this.portfolioExchangeService.getExchangeInfo(normalizedExchange),
            };
        }
        catch (error) {
            this.logger.error(`❌ Portfolio creation failed for execution ${executionId}:`, error);
            const execution = await this.portfolioProgressService.getExecution(executionId);
            const currentStep = execution?.currentStep;
            await this.portfolioProgressService.failStep(executionId, currentStep, error);
            throw error;
        }
    }
    async validateExchange(exchangeId) {
        this.logger.debug(`🔍 Validating exchange: ${exchangeId}`);
        if (!this.portfolioExchangeService.isExchangeSupported(exchangeId)) {
            throw new Error(`Exchange '${exchangeId}' is not supported. Supported exchanges: ${this.getSupportedExchangesList()}`);
        }
        const exchangeInfo = this.portfolioExchangeService.getExchangeInfo(exchangeId);
        if (!exchangeInfo?.hasBalance) {
            throw new Error(`Exchange '${exchangeId}' does not support balance fetching`);
        }
        this.logger.debug(`✅ Exchange ${exchangeId} is supported and has balance capability`);
    }
    async decryptCredentials(encryptedCredentials) {
        this.logger.debug("🔓 Decrypting exchange credentials...");
        try {
            const credentials = {
                apiKey: await this.portfolioExchangeService.decryptApiKey(encryptedCredentials.apiKey),
                secretKey: await this.portfolioExchangeService.decryptSecretKey(encryptedCredentials.secretKey),
                passphrase: encryptedCredentials.passphrase
                    ? await this.portfolioExchangeService.decryptPassphrase(encryptedCredentials.passphrase)
                    : undefined,
                sandbox: encryptedCredentials.sandbox || false,
            };
            this.logger.debug("✅ Credentials decrypted successfully");
            return credentials;
        }
        catch (error) {
            this.logger.error("❌ Failed to decrypt credentials:", error);
            throw new Error("Invalid or corrupted exchange credentials");
        }
    }
    async testExchangeConnection(exchangeId, credentials) {
        this.logger.debug(`🔌 Testing connection to ${exchangeId}...`);
        const isConnected = await this.portfolioExchangeService.testExchangeConnection(exchangeId, credentials);
        if (!isConnected) {
            throw new Error(`Failed to connect to ${exchangeId}. Please verify your API credentials and permissions.`);
        }
        this.logger.debug(`✅ Successfully connected to ${exchangeId}`);
    }
    async fetchAccountBalances(exchangeId, credentials) {
        this.logger.debug(`💰 Fetching account balances from ${exchangeId}...`);
        try {
            const balances = await this.portfolioExchangeService.fetchBalances(exchangeId, credentials);
            const portfolioBalances = balances.map((balance) => ({
                symbol: balance.symbol,
                free: balance.free,
                used: balance.used,
                total: balance.total,
                usdValue: undefined,
            }));
            this.logger.debug(`✅ Fetched ${portfolioBalances.length} balances from ${exchangeId}`);
            return portfolioBalances;
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch balances from ${exchangeId}:`, error);
            throw new Error(`Unable to fetch account balances: ${error.message}`);
        }
    }
    async processBalances(balances) {
        this.logger.debug(`📊 Processing ${balances.length} balances...`);
        const processedBalances = [];
        for (const balance of balances) {
            try {
                const assetInfoId = await this.portfolioProgressService.findOrCreateAssetInfo(balance.symbol, {
                    name: balance.symbol,
                    category: "Cryptocurrency",
                    desc: `${balance.symbol} cryptocurrency`,
                });
                processedBalances.push({
                    assetInfoId,
                    balance: balance.free,
                    locked: balance.used,
                });
            }
            catch (error) {
                this.logger.warn(`⚠️ Failed to process balance for ${balance.symbol}, skipping:`, error);
            }
        }
        this.logger.debug(`✅ Processed ${processedBalances.length} balances successfully`);
        return processedBalances;
    }
    async createPortfolioRecord(portfolioData) {
        this.logger.debug(`💾 Creating portfolio record...`);
        try {
            const portfolioId = await this.portfolioProgressService.createPortfolio(portfolioData);
            this.logger.debug(`✅ Portfolio record created with ID: ${portfolioId}`);
            return portfolioId;
        }
        catch (error) {
            this.logger.error("❌ Failed to create portfolio record:", error);
            throw new Error(`Database error during portfolio creation: ${error.message}`);
        }
    }
    async storeAssetBalances(portfolioId, balances) {
        this.logger.debug(`💰 Storing ${balances.length} asset balances...`);
        try {
            await this.portfolioProgressService.upsertAssetBalances(portfolioId, balances);
            this.logger.debug(`✅ Asset balances stored successfully`);
        }
        catch (error) {
            this.logger.error("❌ Failed to store asset balances:", error);
            throw new Error(`Database error during balance storage: ${error.message}`);
        }
    }
    getSupportedExchangesList() {
        try {
            const exchanges = this.portfolioExchangeService.getAllSupportedExchanges();
            const supportedExchanges = exchanges
                .filter((exchange) => exchange.supported && exchange.hasBalance)
                .map((exchange) => exchange.id)
                .slice(0, 10);
            return (supportedExchanges.join(", ") +
                (exchanges.length > 10 ? ", ..." : ""));
        }
        catch (error) {
            return "binance, mexc, okx, and many others";
        }
    }
    async retryPortfolioCreation(payload) {
        this.logger.log(`🔄 Retrying portfolio creation for execution ${payload.executionId}`);
        try {
            const completePayload = await this.buildCompletePayloadFromExecution(payload.executionId, payload);
            return await this.createPortfolio(completePayload);
        }
        catch (error) {
            this.logger.error(`❌ Portfolio retry failed for execution ${payload.executionId}:`, error);
            throw error;
        }
    }
    async updatePortfolioCredentials(payload) {
        this.logger.log(`🔑 Updating credentials and retrying for execution ${payload.executionId}`);
        try {
            const completePayload = await this.buildCompletePayloadFromExecution(payload.executionId, payload);
            return await this.createPortfolio(completePayload);
        }
        catch (error) {
            this.logger.error(`❌ Credential update and retry failed for execution ${payload.executionId}:`, error);
            throw error;
        }
    }
    async buildCompletePayloadFromExecution(executionId, overrides) {
        this.logger.debug(`🔧 Building complete payload for execution ${executionId}`);
        const execution = await this.portfolioProgressService.getExecution(executionId);
        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }
        let storedContext = {};
        if (execution.executionContext) {
            try {
                storedContext = JSON.parse(execution.executionContext);
                this.logger.debug(`📋 Retrieved stored context for execution ${executionId}:`, { ...storedContext, apiKey: '[HIDDEN]', secretKey: '[HIDDEN]' });
            }
            catch (error) {
                this.logger.warn(`⚠️ Failed to parse execution context for ${executionId}, continuing with overrides only`);
            }
        }
        const mergedPayload = {
            userId: execution.userId,
            executionId: executionId,
            name: overrides.name || storedContext.name || `${overrides.exchanges || storedContext.exchanges} Portfolio`,
            exchanges: overrides.exchanges || storedContext.exchanges,
            apiKey: overrides.apiKey || storedContext.apiKey,
            secretKey: overrides.secretKey || storedContext.secretKey,
            passphrase: overrides.passphrase || storedContext.passphrase,
        };
        if (!mergedPayload.exchanges) {
            throw new Error(`Missing exchange information for execution ${executionId}. Cannot proceed with retry.`);
        }
        if (!mergedPayload.apiKey) {
            throw new Error(`Missing API key for execution ${executionId}. Cannot proceed with retry.`);
        }
        if (!mergedPayload.secretKey) {
            throw new Error(`Missing secret key for execution ${executionId}. Cannot proceed with retry.`);
        }
        this.logger.debug(`✅ Complete payload built for execution ${executionId}:`, { ...mergedPayload, apiKey: '[HIDDEN]', secretKey: '[HIDDEN]' });
        return mergedPayload;
    }
};
exports.PortfolioCreationService = PortfolioCreationService;
exports.PortfolioCreationService = PortfolioCreationService = PortfolioCreationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [portfolio_exchange_service_1.PortfolioExchangeService,
        portfolio_progress_service_1.PortfolioProgressService])
], PortfolioCreationService);
//# sourceMappingURL=portfolio-creation.service.js.map