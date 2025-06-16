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
const pnl_calculation_service_1 = require("./pnl-calculation.service");
const portfolio_analytics_service_1 = require("./portfolio-analytics.service");
const portfolio_exchange_service_1 = require("./portfolio-exchange.service");
const portfolio_progress_service_1 = require("./portfolio-progress.service");
let PortfolioCreationService = PortfolioCreationService_1 = class PortfolioCreationService {
    constructor(portfolioExchangeService, portfolioProgressService, pnlCalculationService, portfolioAnalyticsService) {
        this.portfolioExchangeService = portfolioExchangeService;
        this.portfolioProgressService = portfolioProgressService;
        this.pnlCalculationService = pnlCalculationService;
        this.portfolioAnalyticsService = portfolioAnalyticsService;
        this.logger = new common_1.Logger(PortfolioCreationService_1.name);
        this.logger.log("🏗️ Portfolio Creation Service initialized with integrated computation services and sequential workflow");
    }
    async createPortfolio(payload) {
        const { userId, executionId, name, exchanges, apiKey, secretKey, passphrase, } = payload;
        const normalizedExchange = exchanges.toLowerCase();
        const exchangeEnum = exchanges;
        this.logger.log(`🚀 Creating portfolio with integrated analytics for user ${userId}, execution ${executionId}, exchange ${normalizedExchange}`);
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
            const portfolioId = await this.createPortfolioRecord({
                userId,
                exchanges: exchangeEnum,
                name: name || `${exchanges} Portfolio`,
                apiKey,
                secretKey,
            });
            await this.storeAssetBalances(portfolioId, processedBalances);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.SYMBOL_DISCOVERY, exchangeEnum);
            const symbolDiscoveryResult = await this.processSymbolDiscovery(normalizedExchange, credentials, balances);
            await this.portfolioProgressService.storeSymbolDiscoveryData(portfolioId, symbolDiscoveryResult);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.SYMBOL_DISCOVERY);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.TRADE_HISTORY_FETCH, exchangeEnum);
            const tradeHistoryResult = await this.processTradeHistoryFetch(normalizedExchange, credentials, symbolDiscoveryResult);
            await this.portfolioProgressService.storeTradeHistoryData(portfolioId, tradeHistoryResult.trades);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.TRADE_HISTORY_FETCH);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.PRICE_HISTORY_FETCH, exchangeEnum);
            const priceHistoryResult = await this.processPriceHistoryFetch(normalizedExchange, credentials, symbolDiscoveryResult.discoveredSymbols);
            await this.portfolioProgressService.storePriceHistoryData(portfolioId, priceHistoryResult.currentPrices);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.PRICE_HISTORY_FETCH);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.PNL_CALCULATION, exchangeEnum);
            const pnlResult = await this.processPnLCalculation(tradeHistoryResult.trades, priceHistoryResult.currentPrices);
            await this.portfolioProgressService.storePnLCalculationData(portfolioId, pnlResult);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.PNL_CALCULATION);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.ANALYTICS_CALCULATION, exchangeEnum);
            const analyticsResult = await this.processAnalyticsCalculation(pnlResult);
            await this.portfolioProgressService.storeAnalyticsData(portfolioId, analyticsResult, pnlResult);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.ANALYTICS_CALCULATION);
            await this.portfolioProgressService.startStep(executionId, prisma_1.PortfolioCreationStep.COMPLETION, exchangeEnum);
            await this.portfolioProgressService.completeStep(executionId, prisma_1.PortfolioCreationStep.COMPLETION);
            await this.portfolioProgressService.markSuccess(executionId, portfolioId, userId, normalizedExchange);
            this.logger.log(`✅ Portfolio creation with analytics successful: ${portfolioId}`);
            return {
                portfolioId,
                balances,
                assets: await this.transformBalancesToAssets(balances, normalizedExchange),
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
                const assetInfoId = await this.portfolioProgressService.findOrCreateAssetInfo(balance.symbol);
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
                this.logger.debug(`📋 Retrieved stored context for execution ${executionId}:`, {
                    ...storedContext,
                    apiKey: "[HIDDEN]",
                    secretKey: "[HIDDEN]",
                });
            }
            catch (error) {
                this.logger.warn(`⚠️ Failed to parse execution context for ${executionId}, continuing with overrides only`);
            }
        }
        const mergedPayload = {
            userId: execution.userId,
            executionId: executionId,
            name: overrides.name ||
                storedContext.name ||
                `${overrides.exchanges || storedContext.exchanges} Portfolio`,
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
        this.logger.debug(`✅ Complete payload built for execution ${executionId}:`, { ...mergedPayload, apiKey: "[HIDDEN]", secretKey: "[HIDDEN]" });
        return mergedPayload;
    }
    async transformBalancesToAssets(balances, exchangeId) {
        this.logger.debug(`🔄 Transforming ${balances.length} balances to assets...`);
        const assets = [];
        for (const balance of balances) {
            try {
                const assetInfoId = await this.portfolioProgressService.findOrCreateAssetInfo(balance.symbol);
                const assetInfo = {
                    id: assetInfoId,
                    symbol: balance.symbol,
                    name: balance.symbol,
                    category: "Cryptocurrency",
                    desc: `${balance.symbol} cryptocurrency`,
                };
                assets.push({
                    assetInfo,
                    balance: balance.free,
                    locked: balance.used,
                    usdValue: balance.usdValue,
                    percentage: undefined,
                });
            }
            catch (error) {
                this.logger.warn(`⚠️ Failed to transform balance for ${balance.symbol}, skipping:`, error);
            }
        }
        this.logger.debug(`✅ Transformed ${assets.length} balances to assets`);
        return assets;
    }
    async processSymbolDiscovery(exchangeId, credentials, balances) {
        this.logger.log(`🔍 Starting symbol discovery for exchange ${exchangeId}`);
        try {
            const currentBalanceSymbols = balances.map(b => b.symbol);
            const discoveredSymbols = await this.portfolioExchangeService.discoverPortfolioSymbols(exchangeId, credentials, currentBalanceSymbols);
            const result = {
                discoveredSymbols,
                currentBalanceSymbols,
                historicalSymbols: discoveredSymbols.filter((s) => !currentBalanceSymbols.includes(s)),
                totalSymbols: discoveredSymbols.length,
            };
            this.logger.log(`✅ Symbol discovery completed: ${result.totalSymbols} symbols found`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Symbol discovery failed:`, error);
            throw error;
        }
    }
    async processTradeHistoryFetch(exchangeId, credentials, symbolDiscoveryResult) {
        try {
            const tradingPairs = await this.portfolioExchangeService.convertSymbolsToTradingPairs(symbolDiscoveryResult.discoveredSymbols, exchangeId);
            const separator = this.portfolioExchangeService.getExchangePairSeparator(exchangeId);
            const rawTrades = await this.portfolioExchangeService.fetchTradeHistory(exchangeId, credentials, tradingPairs, 1000);
            const enhancedTrades = [];
            for (const trade of rawTrades) {
                const symbol = trade.symbol.split(separator)[0];
                const assetInfoId = await this.portfolioProgressService.findOrCreateAssetInfo(symbol);
                enhancedTrades.push({
                    cryptoPortfolioId: "",
                    assetInfoId: assetInfoId,
                    price: trade.price || 0,
                    qty: trade.amount || 0,
                    quoteQty: trade.cost || 0,
                    commission: trade.fee?.cost || 0,
                    commissionAsset: trade.fee?.currency || "",
                    time: new Date(trade.timestamp || Date.now()),
                    isBuyer: trade.side === "buy",
                    tradeId: trade.id,
                    orderId: trade.order,
                    symbol: trade.symbol,
                    side: trade.side?.toUpperCase(),
                    fees: trade.fee?.cost || 0,
                    feeAsset: trade.fee?.currency || "",
                });
            }
            const result = {
                trades: enhancedTrades,
                totalTrades: enhancedTrades.length,
                processedSymbols: tradingPairs,
                failedSymbols: [],
            };
            this.logger.log(`✅ Trade history fetch completed: ${result.totalTrades} trades processed`);
            return result;
        }
        catch (error) {
            this.logger.error(`❌ Trade history fetch failed:`, error);
            throw error;
        }
    }
    async processPriceHistoryFetch(exchangeId, credentials, symbols) {
        this.logger.log(`💰 Starting price history fetch for exchange ${exchangeId}`);
        try {
            const tradingPairs = await this.portfolioExchangeService.convertSymbolsToTradingPairs(symbols, exchangeId);
            if (tradingPairs.length === 0) {
                this.logger.warn(`⚠️ No valid trading pairs found for ${symbols.length} symbols on ${exchangeId}`);
                return { currentPrices: new Map() };
            }
            this.logger.log(`🔄 Using ${tradingPairs.length} validated trading pairs for price fetching`);
            const currentPrices = await this.portfolioExchangeService.fetchCurrentPrices(exchangeId, credentials, tradingPairs);
            this.logger.log(`✅ Price history fetch completed: ${currentPrices.size} current prices fetched`);
            return { currentPrices };
        }
        catch (error) {
            this.logger.error(`❌ Price history fetch failed:`, error);
            throw error;
        }
    }
    async processPnLCalculation(trades, currentPrices) {
        this.logger.log(`🧮 Starting P&L calculation for ${trades.length} trades`);
        try {
            const pnlResult = await this.pnlCalculationService.calculatePortfolioPnL(trades, currentPrices);
            this.logger.log(`✅ P&L calculation completed: Total P&L ${pnlResult.portfolioTotalPnL.toFixed(2)}`);
            return pnlResult;
        }
        catch (error) {
            this.logger.error(`❌ P&L calculation failed:`, error);
            throw error;
        }
    }
    async processAnalyticsCalculation(pnlResult) {
        this.logger.log(`📊 Starting analytics calculation`);
        try {
            const analyticsResult = await this.portfolioAnalyticsService.calculatePortfolioAnalytics(pnlResult.assetPnL);
            this.logger.log(`✅ Analytics calculation completed: Total value ${analyticsResult.totalValue.toFixed(2)}`);
            return analyticsResult;
        }
        catch (error) {
            this.logger.error(`❌ Analytics calculation failed:`, error);
            throw error;
        }
    }
};
exports.PortfolioCreationService = PortfolioCreationService;
exports.PortfolioCreationService = PortfolioCreationService = PortfolioCreationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [portfolio_exchange_service_1.PortfolioExchangeService,
        portfolio_progress_service_1.PortfolioProgressService,
        pnl_calculation_service_1.PnLCalculationService,
        portfolio_analytics_service_1.PortfolioAnalyticsService])
], PortfolioCreationService);
//# sourceMappingURL=portfolio-creation.service.js.map