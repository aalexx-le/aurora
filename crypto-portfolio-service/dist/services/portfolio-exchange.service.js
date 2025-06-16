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
var PortfolioExchangeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioExchangeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ccxt = require("ccxt");
let PortfolioExchangeService = PortfolioExchangeService_1 = class PortfolioExchangeService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(PortfolioExchangeService_1.name);
        this.algorithm = "AES-GCM";
        this.keyLength = 256;
        this.ivLength = 12;
        this.saltLength = 32;
        this.iterations = 100000;
        this.webCryptoPrefix = "WC1";
        this.marketCacheTimeout = 5 * 60 * 1000;
        this.marketCache = new Map();
        this.quoteCurrencyPriority = ['USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'BUSD'];
        this.timeout = this.configService.get("EXCHANGE_TIMEOUT", 30000);
        this.maxRetries = this.configService.get("MAX_RETRIES", 3);
        const masterKey = this.configService.get("CRYPTO_PORTFOLIO_MASTER_KEY", "default-master-key-change-in-production");
        if (!masterKey ||
            masterKey === "default-master-key-change-in-production") {
            this.logger.warn("⚠️ Using default encryption key - change this in production!");
        }
        this.masterSecret = masterKey;
        this.logger.log("🔌 Portfolio Exchange Service initialized with CCXT exchange support, Web Crypto API encryption, and intelligent symbol-to-trading-pair conversion");
    }
    getAllSupportedExchanges() {
        try {
            const exchangeIds = Object.keys(ccxt.exchanges);
            const exchanges = exchangeIds.map((exchangeId) => {
                try {
                    const ExchangeClass = ccxt[exchangeId];
                    const exchangeInstance = new ExchangeClass();
                    return {
                        id: exchangeId,
                        name: exchangeInstance.name || exchangeId,
                        supported: true,
                        countries: exchangeInstance.countries || [],
                        version: exchangeInstance.version,
                        hasBalance: exchangeInstance.has.fetchBalance || false,
                        hasSpot: exchangeInstance.has.spot || false,
                        hasFutures: exchangeInstance.has.future || false,
                    };
                }
                catch (error) {
                    return {
                        id: exchangeId,
                        name: exchangeId,
                        supported: false,
                        countries: [],
                        hasBalance: false,
                        hasSpot: false,
                        hasFutures: false,
                    };
                }
            });
            this.logger.log(`🌍 Discovered ${exchanges.length} CCXT exchanges (${exchanges.filter((e) => e.supported).length} supported)`);
            return exchanges;
        }
        catch (error) {
            this.logger.error("❌ Failed to discover CCXT exchanges:", error);
            return [];
        }
    }
    isExchangeSupported(exchangeId) {
        const exchangeIds = ccxt.exchanges;
        return exchangeIds.includes(exchangeId.toLowerCase());
    }
    createExchangeInstance(exchangeId, credentials) {
        try {
            const normalizedExchangeId = exchangeId.toLowerCase();
            if (!this.isExchangeSupported(normalizedExchangeId)) {
                throw new Error(`Exchange '${exchangeId}' is not supported by CCXT`);
            }
            const ExchangeClass = ccxt[normalizedExchangeId];
            if (!ExchangeClass) {
                throw new Error(`Exchange class for '${exchangeId}' not found`);
            }
            const exchangeConfig = {
                apiKey: credentials.apiKey,
                secret: credentials.secretKey,
                timeout: this.timeout,
                enableRateLimit: true,
            };
            if (credentials.passphrase) {
                exchangeConfig.password = credentials.passphrase;
            }
            const exchange = new ExchangeClass(exchangeConfig);
            this.logger.log(`✅ Created ${exchangeId} exchange instance`);
            return exchange;
        }
        catch (error) {
            this.logger.error(`❌ Failed to create ${exchangeId} exchange instance:`, error);
            throw error;
        }
    }
    async fetchBalances(exchangeId, credentials) {
        let exchange = null;
        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            if (!exchange.has.fetchBalance) {
                throw new Error(`Exchange '${exchangeId}' does not support balance fetching`);
            }
            this.logger.log(`💰 Fetching balances from ${exchangeId}...`);
            const balances = await this.retryWithBackoff(() => exchange.fetchBalance(), this.maxRetries, `fetchBalance for ${exchangeId}`);
            const balanceData = balances;
            const transformedBalances = Object.entries(balanceData.total || {})
                .filter(([symbol, amount]) => amount && amount > 0)
                .map(([symbol, total]) => ({
                symbol: symbol,
                free: balanceData.free?.[symbol] || 0,
                used: balanceData.used?.[symbol] || 0,
                total: total,
            }));
            this.logger.log(`✅ Fetched ${transformedBalances.length} balances from ${exchangeId}`);
            return transformedBalances;
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch balances from ${exchangeId}:`, error);
            throw error;
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    async testExchangeConnection(exchangeId, credentials) {
        let exchange = null;
        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(`🔌 Testing connection to ${exchangeId}...`);
            if (exchange.has.fetchBalance) {
                await exchange.fetchBalance();
            }
            else if (exchange.has.fetchTicker &&
                exchange.symbols.length > 0) {
                await exchange.fetchTicker(exchange.symbols[0]);
            }
            else {
                this.logger.log(`ℹ️ ${exchangeId} has limited API testing capabilities`);
            }
            this.logger.log(`✅ Connection test passed for ${exchangeId}`);
            return true;
        }
        catch (error) {
            this.logger.error(`❌ Connection test failed for ${exchangeId}:`, error);
            return false;
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    getExchangeInfo(exchangeId) {
        try {
            const normalizedExchangeId = exchangeId.toLowerCase();
            if (!this.isExchangeSupported(normalizedExchangeId)) {
                return null;
            }
            const ExchangeClass = ccxt[normalizedExchangeId];
            if (!ExchangeClass) {
                return null;
            }
            const exchangeInstance = new ExchangeClass();
            return {
                id: normalizedExchangeId,
                name: exchangeInstance.name || normalizedExchangeId,
                supported: true,
                countries: exchangeInstance.countries || [],
                version: exchangeInstance.version,
                hasBalance: exchangeInstance.has.fetchBalance || false,
                hasSpot: exchangeInstance.has.spot || false,
                hasFutures: exchangeInstance.has.future || false,
            };
        }
        catch (error) {
            this.logger.error(`❌ Failed to get exchange info for ${exchangeId}:`, error);
            return null;
        }
    }
    async discoverPortfolioSymbols(exchangeId, credentials, currentBalanceSymbols) {
        let exchange = null;
        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(`🔍 Discovering symbols for ${exchangeId}...`);
            const discoveredSymbols = new Set(currentBalanceSymbols);
            if (exchange.has.fetchMyTrades) {
                try {
                    const recentTrades = await this.retryWithBackoff(() => exchange.fetchMyTrades(undefined, undefined, 1000), this.maxRetries, `fetchMyTrades for symbol discovery on ${exchangeId}`);
                    for (const trade of recentTrades) {
                        if (trade.symbol) {
                            discoveredSymbols.add(trade.symbol);
                        }
                    }
                }
                catch (error) {
                    this.logger.warn(`⚠️ Could not fetch trades for symbol discovery: ${error.message}`);
                }
            }
            const symbolArray = Array.from(discoveredSymbols);
            this.logger.log(`✅ Discovered ${symbolArray.length} symbols for ${exchangeId}`);
            return symbolArray;
        }
        catch (error) {
            this.logger.error(`❌ Failed to discover symbols for ${exchangeId}:`, error);
            return currentBalanceSymbols;
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    async fetchTradeHistory(exchangeId, credentials, tradingPairs, limit = 1000) {
        let exchange = null;
        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(`📊 Fetching trade history for ${tradingPairs.length} symbols from ${exchangeId}...`);
            if (!exchange.has.fetchMyTrades) {
                throw new Error(`Exchange '${exchangeId}' does not support trade history fetching`);
            }
            const allTrades = [];
            const batchSize = 5;
            for (let i = 0; i < tradingPairs.length; i += batchSize) {
                const batch = tradingPairs.slice(i, i + batchSize);
                for (const symbol of batch) {
                    try {
                        this.logger.debug(`📈 Fetching trades for ${symbol}...`);
                        const trades = await this.retryWithBackoff(() => exchange.fetchMyTrades(symbol, undefined, limit), this.maxRetries, `fetchMyTrades for ${symbol} on ${exchangeId}`);
                        allTrades.push(...(trades));
                        await new Promise((resolve) => setTimeout(resolve, 100));
                    }
                    catch (error) {
                        this.logger.warn(`⚠️ Failed to fetch trades for ${symbol}: ${error.message}`);
                        continue;
                    }
                }
                if (i + batchSize < tradingPairs.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }
            this.logger.log(`✅ Fetched ${allTrades.length} trades from ${exchangeId}`);
            return allTrades;
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch trade history from ${exchangeId}:`, error);
            throw error;
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    async fetchPriceHistory(exchangeId, credentials, symbols, timeframe = "1d", limit = 100) {
        let exchange = null;
        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(`📈 Fetching price history for ${symbols.length} symbols from ${exchangeId}...`);
            if (!exchange.has.fetchOHLCV) {
                this.logger.warn(`⚠️ Exchange '${exchangeId}' does not support OHLCV data fetching`);
                return new Map();
            }
            const priceHistory = new Map();
            const batchSize = 3;
            for (let i = 0; i < symbols.length; i += batchSize) {
                const batch = symbols.slice(i, i + batchSize);
                for (const symbol of batch) {
                    try {
                        this.logger.debug(`📊 Fetching OHLCV for ${symbol}...`);
                        const ohlcv = await this.retryWithBackoff(() => exchange.fetchOHLCV(symbol, timeframe, undefined, limit), this.maxRetries, `fetchOHLCV for ${symbol} on ${exchangeId}`);
                        const ohlcvData = ohlcv;
                        if (ohlcvData && ohlcvData.length > 0) {
                            priceHistory.set(symbol, ohlcvData);
                        }
                        await new Promise((resolve) => setTimeout(resolve, 200));
                    }
                    catch (error) {
                        this.logger.warn(`⚠️ Failed to fetch OHLCV for ${symbol}: ${error.message}`);
                        continue;
                    }
                }
                if (i + batchSize < symbols.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }
            }
            this.logger.log(`✅ Fetched price history for ${priceHistory.size} symbols from ${exchangeId}`);
            return priceHistory;
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch price history from ${exchangeId}:`, error);
            throw error;
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    async fetchCurrentPrices(exchangeId, credentials, symbols) {
        let exchange = null;
        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(`💰 Fetching current prices for ${symbols.length} symbols from ${exchangeId}...`);
            const currentPrices = new Map();
            if (exchange.has.fetchTickers) {
                try {
                    const tickers = await this.retryWithBackoff(() => exchange.fetchTickers(symbols), this.maxRetries, `fetchTickers for ${exchangeId}`);
                    for (const [symbol, ticker] of Object.entries(tickers)) {
                        if (ticker &&
                            typeof ticker === "object" &&
                            "last" in ticker) {
                            currentPrices.set(symbol, ticker.last || 0);
                        }
                    }
                }
                catch (error) {
                    this.logger.warn(`⚠️ Batch ticker fetch failed, falling back to individual requests: ${error.message}`);
                }
            }
            if (exchange.has.fetchTicker) {
                for (const symbol of symbols) {
                    if (!currentPrices.has(symbol)) {
                        try {
                            const ticker = await this.retryWithBackoff(() => exchange.fetchTicker(symbol), this.maxRetries, `fetchTicker for ${symbol} on ${exchangeId}`);
                            const tickerData = ticker;
                            if (tickerData && tickerData.last) {
                                currentPrices.set(symbol, tickerData.last);
                            }
                            await new Promise((resolve) => setTimeout(resolve, 100));
                        }
                        catch (error) {
                            this.logger.warn(`⚠️ Failed to fetch ticker for ${symbol}: ${error.message}`);
                            continue;
                        }
                    }
                }
            }
            this.logger.log(`✅ Fetched current prices for ${currentPrices.size} symbols from ${exchangeId}`);
            return currentPrices;
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch current prices from ${exchangeId}:`, error);
            throw error;
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    async encryptApiKey(apiKey) {
        try {
            this.logger.debug("🔒 Encrypting API key with Web Crypto API");
            if (!apiKey) {
                throw new Error("API key cannot be empty");
            }
            const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
            const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
            const cryptoKey = await this.deriveKey(this.masterSecret, salt);
            const encoder = new TextEncoder();
            const data = encoder.encode(apiKey);
            const encryptedData = await crypto.subtle.encrypt({
                name: this.algorithm,
                iv: iv,
            }, cryptoKey, data);
            const combined = new Uint8Array(this.saltLength + this.ivLength + encryptedData.byteLength);
            combined.set(salt, 0);
            combined.set(iv, this.saltLength);
            combined.set(new Uint8Array(encryptedData), this.saltLength + this.ivLength);
            const base64Result = this.webCryptoPrefix + this.arrayBufferToBase64(combined);
            this.logger.debug("✅ API key encrypted successfully with Web Crypto API");
            return base64Result;
        }
        catch (error) {
            this.logger.error("❌ Failed to encrypt API key with Web Crypto API", error);
            throw new Error(`Web Crypto encryption failed: ${error.message}`);
        }
    }
    async decryptApiKey(encryptedApiKey) {
        try {
            this.logger.debug("🔓 Decrypting API key with Web Crypto API");
            if (!encryptedApiKey) {
                throw new Error("Encrypted API key cannot be empty");
            }
            if (!encryptedApiKey.startsWith(this.webCryptoPrefix)) {
                throw new Error("Unsupported encryption format - only Web Crypto API format is supported");
            }
            return await this.decryptWebCrypto(encryptedApiKey);
        }
        catch (error) {
            this.logger.error("❌ Failed to decrypt API key", error);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
    async encryptSecretKey(secretKey) {
        return this.encryptApiKey(secretKey);
    }
    async decryptSecretKey(encryptedSecretKey) {
        return this.decryptApiKey(encryptedSecretKey);
    }
    async encryptPassphrase(passphrase) {
        return this.encryptApiKey(passphrase);
    }
    async decryptPassphrase(encryptedPassphrase) {
        return this.decryptApiKey(encryptedPassphrase);
    }
    async decryptExchangeCredentials(credentials) {
        try {
            this.logger.debug("🔓 Decrypting exchange credentials...");
            const decryptedCredentials = {
                apiKey: await this.decryptApiKey(credentials.apiKey),
                secretKey: await this.decryptSecretKey(credentials.secretKey),
                passphrase: credentials.passphrase
                    ? await this.decryptPassphrase(credentials.passphrase)
                    : undefined,
            };
            this.logger.debug("✅ Exchange credentials decrypted successfully");
            return decryptedCredentials;
        }
        catch (error) {
            this.logger.error("❌ Failed to decrypt exchange credentials:", error);
            throw new Error("Invalid or corrupted exchange credentials");
        }
    }
    async retryWithBackoff(operation, maxRetries, operationName, baseDelay = 1000) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.logger.debug(`🔄 Attempting ${operationName} (attempt ${attempt}/${maxRetries})`);
                return await operation();
            }
            catch (error) {
                lastError = error;
                if (attempt === maxRetries) {
                    this.logger.error(`❌ ${operationName} failed after ${maxRetries} attempts:`, error);
                    break;
                }
                const delay = baseDelay * Math.pow(2, attempt - 1);
                this.logger.warn(`⚠️ ${operationName} attempt ${attempt} failed, retrying in ${delay}ms:`, error.message);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw lastError;
    }
    async decryptWebCrypto(encryptedApiKey) {
        try {
            const base64Data = encryptedApiKey.substring(this.webCryptoPrefix.length);
            const combined = this.base64ToArrayBuffer(base64Data);
            const salt = combined.slice(0, this.saltLength);
            const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
            const encryptedData = combined.slice(this.saltLength + this.ivLength);
            const cryptoKey = await this.deriveKey(this.masterSecret, salt);
            const decryptedData = await crypto.subtle.decrypt({
                name: this.algorithm,
                iv: iv,
            }, cryptoKey, encryptedData);
            const decoder = new TextDecoder();
            const result = decoder.decode(decryptedData);
            this.logger.debug("✅ API key decrypted successfully with Web Crypto API");
            return result;
        }
        catch (error) {
            this.logger.error("❌ Web Crypto decryption failed", error);
            throw new Error(`Web Crypto decryption failed: ${error.message}`);
        }
    }
    async deriveKey(secret, salt) {
        try {
            const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "PBKDF2" }, false, ["deriveKey"]);
            const cryptoKey = await crypto.subtle.deriveKey({
                name: "PBKDF2",
                salt: salt,
                iterations: this.iterations,
                hash: "SHA-256",
            }, keyMaterial, { name: this.algorithm, length: this.keyLength }, false, ["encrypt", "decrypt"]);
            return cryptoKey;
        }
        catch (error) {
            this.logger.error("❌ Key derivation failed", error);
            throw new Error("Key derivation failed");
        }
    }
    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }
    base64ToArrayBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }
    classifyDiscoveredSymbols(symbols) {
        const tradingPairs = [];
        const individualAssets = [];
        const invalidSymbols = [];
        this.logger.debug(`🔍 Classifying ${symbols.length} discovered symbols...`);
        for (const symbol of symbols) {
            if (!symbol || typeof symbol !== 'string') {
                invalidSymbols.push(symbol);
                continue;
            }
            const cleanSymbol = symbol.trim();
            if (!cleanSymbol) {
                invalidSymbols.push(symbol);
                continue;
            }
            if (this.isTradingPair(cleanSymbol)) {
                tradingPairs.push(cleanSymbol);
            }
            else if (this.isValidAsset(cleanSymbol)) {
                individualAssets.push(cleanSymbol);
            }
            else {
                invalidSymbols.push(cleanSymbol);
            }
        }
        this.logger.debug(`✅ Symbol classification complete: ${tradingPairs.length} pairs, ${individualAssets.length} assets, ${invalidSymbols.length} invalid`);
        return { tradingPairs, individualAssets, invalidSymbols };
    }
    isTradingPair(symbol) {
        const separators = ['/', '-', '_', ':'];
        return separators.some(sep => symbol.includes(sep));
    }
    isValidAsset(symbol) {
        if (symbol.length < 2 || symbol.length > 10) {
            return false;
        }
        if (!/^[A-Z0-9]+$/i.test(symbol)) {
            return false;
        }
        const invalidPatterns = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
        if (invalidPatterns.some(pattern => symbol.endsWith(pattern) && symbol.length > pattern.length)) {
            return false;
        }
        return true;
    }
    getExchangePairSeparator(exchangeId) {
        const separatorMap = {
            'binance': '/',
            'mexc': '/',
            'okx': '-',
            'kucoin': '-',
            'gate': '_',
            'huobi': '/',
            'htx': '/',
            'bybit': '/',
            'bitget': '/',
            'coinbase': '-',
            'coinbaseexchange': '-',
            'kraken': '/',
            'bitfinex': '/',
        };
        return separatorMap[exchangeId.toLowerCase()] || '/';
    }
    generateOptimalTradingPairs(assets, exchangeId) {
        const separator = this.getExchangePairSeparator(exchangeId);
        const generatedPairs = [];
        this.logger.debug(`🔧 Generating trading pairs for ${assets.length} assets using separator '${separator}'`);
        for (const asset of assets) {
            if (this.quoteCurrencyPriority.includes(asset.toUpperCase())) {
                continue;
            }
            for (const quote of this.quoteCurrencyPriority) {
                if (asset.toUpperCase() !== quote) {
                    const pair = `${asset.toUpperCase()}${separator}${quote}`;
                    generatedPairs.push(pair);
                }
            }
        }
        this.logger.debug(`✅ Generated ${generatedPairs.length} trading pairs`);
        return generatedPairs;
    }
    async getCachedExchangeMarkets(exchangeId) {
        const cacheKey = exchangeId.toLowerCase();
        const cached = this.marketCache.get(cacheKey);
        if (cached && (Date.now() - cached.lastUpdated.getTime()) < this.marketCacheTimeout) {
            this.logger.debug(`📋 Using cached markets for ${exchangeId} (${cached.markets.size} markets)`);
            return cached.markets;
        }
        this.logger.debug(`🔄 Fetching fresh market data for ${exchangeId}...`);
        const markets = await this.fetchExchangeMarkets(exchangeId);
        this.marketCache.set(cacheKey, {
            markets,
            lastUpdated: new Date(),
            exchangeId: cacheKey,
        });
        this.logger.debug(`✅ Cached ${markets.size} markets for ${exchangeId}`);
        return markets;
    }
    async fetchExchangeMarkets(exchangeId) {
        let exchange = null;
        try {
            const ExchangeClass = ccxt[exchangeId.toLowerCase()];
            if (!ExchangeClass) {
                throw new Error(`Exchange class for '${exchangeId}' not found`);
            }
            exchange = new ExchangeClass({
                timeout: this.timeout,
                enableRateLimit: true,
            });
            if (!exchange.has.fetchMarkets) {
                this.logger.warn(`⚠️ Exchange '${exchangeId}' does not support market fetching`);
                return new Map();
            }
            const markets = await this.retryWithBackoff(() => exchange.loadMarkets(), this.maxRetries, `fetchMarkets for ${exchangeId}`);
            const marketMap = new Map();
            for (const [symbol, market] of Object.entries(markets)) {
                marketMap.set(symbol, market);
            }
            return marketMap;
        }
        catch (error) {
            this.logger.error(`❌ Failed to fetch markets for ${exchangeId}:`, error);
            return new Map();
        }
        finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                }
                catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }
    async validateAgainstExchangeMarkets(pairs, exchangeId) {
        this.logger.debug(`🔍 Validating ${pairs.length} trading pairs against ${exchangeId} markets...`);
        const markets = await this.getCachedExchangeMarkets(exchangeId);
        const validPairs = [];
        const invalidPairs = [];
        for (const pair of pairs) {
            const market = markets.get(pair);
            if (market && market.active !== false) {
                validPairs.push(pair);
            }
            else {
                invalidPairs.push(pair);
            }
        }
        this.logger.debug(`✅ Validation complete: ${validPairs.length} valid, ${invalidPairs.length} invalid pairs`);
        return {
            validPairs,
            invalidPairs,
            fallbackPairs: new Map(),
        };
    }
    resolveFallbackPairs(invalidPairs, markets, exchangeId) {
        const fallbacks = new Map();
        const separator = this.getExchangePairSeparator(exchangeId);
        this.logger.debug(`🔄 Resolving fallbacks for ${invalidPairs.length} invalid pairs...`);
        for (const invalidPair of invalidPairs) {
            const baseAsset = this.extractBaseAsset(invalidPair, separator);
            if (!baseAsset)
                continue;
            const fallbackPair = this.findBestAlternativePair(baseAsset, markets, separator);
            if (fallbackPair) {
                fallbacks.set(baseAsset, fallbackPair);
                this.logger.debug(`🔄 Fallback for ${baseAsset}: ${fallbackPair}`);
            }
        }
        this.logger.debug(`✅ Resolved ${fallbacks.size} fallback pairs`);
        return fallbacks;
    }
    extractBaseAsset(pair, separator) {
        const parts = pair.split(separator);
        return parts.length >= 2 ? parts[0] : null;
    }
    findBestAlternativePair(asset, markets, separator) {
        for (const quote of this.quoteCurrencyPriority) {
            if (asset.toUpperCase() === quote)
                continue;
            const candidatePair = `${asset.toUpperCase()}${separator}${quote}`;
            const market = markets.get(candidatePair);
            if (market && market.active !== false) {
                return candidatePair;
            }
        }
        return null;
    }
    async convertSymbolsToTradingPairs(symbols, exchangeId) {
        this.logger.log(`🔄 Converting ${symbols.length} symbols to trading pairs for ${exchangeId}...`);
        try {
            const classification = this.classifyDiscoveredSymbols(symbols);
            const generatedPairs = this.generateOptimalTradingPairs(classification.individualAssets, exchangeId);
            const allCandidatePairs = [
                ...classification.tradingPairs,
                ...generatedPairs,
            ];
            const uniquePairs = Array.from(new Set(allCandidatePairs));
            const validationResult = await this.validateAgainstExchangeMarkets(uniquePairs, exchangeId);
            const markets = await this.getCachedExchangeMarkets(exchangeId);
            const fallbackPairs = this.resolveFallbackPairs(validationResult.invalidPairs, markets, exchangeId);
            const finalPairs = [
                ...validationResult.validPairs,
                ...Array.from(fallbackPairs.values()),
            ];
            const uniqueFinalPairs = Array.from(new Set(finalPairs));
            this.logger.log(`✅ Symbol conversion complete for ${exchangeId}:`);
            this.logger.log(`   📊 Input: ${symbols.length} symbols`);
            this.logger.log(`   🔍 Classification: ${classification.tradingPairs.length} pairs, ${classification.individualAssets.length} assets, ${classification.invalidSymbols.length} invalid`);
            this.logger.log(`   🔧 Generated: ${generatedPairs.length} pairs`);
            this.logger.log(`   ✅ Valid: ${validationResult.validPairs.length} pairs`);
            this.logger.log(`   🔄 Fallbacks: ${fallbackPairs.size} pairs`);
            this.logger.log(`   🎯 Final: ${uniqueFinalPairs.length} trading pairs`);
            if (classification.invalidSymbols.length > 0) {
                this.logger.debug(`⚠️ Invalid symbols skipped: ${classification.invalidSymbols.join(', ')}`);
            }
            return uniqueFinalPairs;
        }
        catch (error) {
            this.logger.error(`❌ Failed to convert symbols to trading pairs for ${exchangeId}:`, error);
            const fallbackPairs = symbols.filter(symbol => this.isTradingPair(symbol));
            this.logger.warn(`🔄 Using fallback: ${fallbackPairs.length} trading pairs from original symbols`);
            return fallbackPairs;
        }
    }
};
exports.PortfolioExchangeService = PortfolioExchangeService;
exports.PortfolioExchangeService = PortfolioExchangeService = PortfolioExchangeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PortfolioExchangeService);
//# sourceMappingURL=portfolio-exchange.service.js.map