import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ccxt from "ccxt";

interface ExchangeCredentials {
    apiKey: string;
    secretKey: string;
    passphrase?: string;
}

interface ExchangeBalance {
    symbol: string;
    free: number;
    used: number;
    total: number;
}

interface ExchangeInfo {
    id: string;
    name: string;
    supported: boolean;
    countries: string[];
    version?: string;
    hasBalance: boolean | "emulated";
    hasSpot: boolean | "emulated";
    hasFutures: boolean | "emulated";
}

// Symbol-to-Trading-Pair Conversion Interfaces
interface SymbolClassification {
    tradingPairs: string[];      // Valid pairs from trade history
    individualAssets: string[];  // Assets needing pair generation
    invalidSymbols: string[];    // Symbols to skip/log
}

interface ValidatedPairSet {
    validPairs: string[];
    invalidPairs: string[];
    fallbackPairs: Map<string, string>; // asset -> best pair
}

interface ExchangeMarketCache {
    markets: Map<string, any>;
    lastUpdated: Date;
    exchangeId: string;
}

@Injectable()
export class PortfolioExchangeService {
    private readonly logger = new Logger(PortfolioExchangeService.name);

    // Exchange configuration
    private readonly timeout: number;
    private readonly maxRetries: number;

    // Encryption configuration
    private readonly masterSecret: string;
    private readonly algorithm = "AES-GCM";
    private readonly keyLength = 256;
    private readonly ivLength = 12; // 96 bits for GCM
    private readonly saltLength = 32; // 256 bits for PBKDF2
    private readonly iterations = 100000; // OWASP recommended minimum
    private readonly webCryptoPrefix = "WC1"; // Identifier for Web Crypto format

    // Symbol-to-Trading-Pair Conversion Configuration
    // TODO: Implement market cache using Redis
    private readonly marketCacheTimeout = 5 * 60 * 1000; // 5 minutes
    private readonly marketCache = new Map<string, ExchangeMarketCache>();
    private readonly quoteCurrencyPriority = ['USDT', 'USDC', 'BTC', 'ETH', 'BNB', 'BUSD'];

    constructor(private readonly configService: ConfigService) {
        // Initialize exchange configuration
        this.timeout = this.configService.get<number>(
            "EXCHANGE_TIMEOUT",
            30000,
        );
        this.maxRetries = this.configService.get<number>("MAX_RETRIES", 3);

        // Initialize encryption configuration
        const masterKey = this.configService.get<string>(
            "CRYPTO_PORTFOLIO_MASTER_KEY",
            "default-master-key-change-in-production",
        );

        if (
            !masterKey ||
            masterKey === "default-master-key-change-in-production"
        ) {
            this.logger.warn(
                "⚠️ Using default encryption key - change this in production!",
            );
        }

        this.masterSecret = masterKey;
        this.logger.log(
            "🔌 Portfolio Exchange Service initialized with CCXT exchange support, Web Crypto API encryption, and intelligent symbol-to-trading-pair conversion",
        );
    }

    // =============================================================================
    // EXCHANGE ADAPTER METHODS
    // =============================================================================

    /**
     * Get all available CCXT exchanges (190+ exchanges automatically supported)
     */
    getAllSupportedExchanges(): ExchangeInfo[] {
        try {
            const exchangeIds = Object.keys(ccxt.exchanges);
            const exchanges = exchangeIds.map((exchangeId) => {
                try {
                    const ExchangeClass = ccxt[exchangeId];
                    const exchangeInstance: ccxt.Exchange = new ExchangeClass();

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
                } catch (error) {
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

            this.logger.log(
                `🌍 Discovered ${exchanges.length} CCXT exchanges (${exchanges.filter((e) => e.supported).length} supported)`,
            );
            return exchanges;
        } catch (error) {
            this.logger.error("❌ Failed to discover CCXT exchanges:", error);
            return [];
        }
    }

    /**
     * Check if an exchange is supported by CCXT
     */
    isExchangeSupported(exchangeId: string): boolean {
        const exchangeIds = ccxt.exchanges as unknown as string[];
        return exchangeIds.includes(exchangeId.toLowerCase());
    }

    /**
     * Create a dynamic exchange instance for any CCXT-supported exchange
     */
    createExchangeInstance(
        exchangeId: string,
        credentials: ExchangeCredentials,
    ): ccxt.Exchange {
        try {
            const normalizedExchangeId = exchangeId.toLowerCase();

            if (!this.isExchangeSupported(normalizedExchangeId)) {
                throw new Error(
                    `Exchange '${exchangeId}' is not supported by CCXT`,
                );
            }

            const ExchangeClass = ccxt[normalizedExchangeId];

            if (!ExchangeClass) {
                throw new Error(`Exchange class for '${exchangeId}' not found`);
            }

            const exchangeConfig: any = {
                apiKey: credentials.apiKey,
                secret: credentials.secretKey,
                timeout: this.timeout,
                enableRateLimit: true,
            };

            // Add passphrase for exchanges that require it (like OKX, KuCoin)
            if (credentials.passphrase) {
                exchangeConfig.password = credentials.passphrase;
            }

            const exchange: ccxt.Exchange = new ExchangeClass(exchangeConfig);

            this.logger.log(`✅ Created ${exchangeId} exchange instance`);
            return exchange;
        } catch (error) {
            this.logger.error(
                `❌ Failed to create ${exchangeId} exchange instance:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Fetch account balances from any CCXT-supported exchange
     */
    async fetchBalances(
        exchangeId: string,
        credentials: ExchangeCredentials,
    ): Promise<ExchangeBalance[]> {
        let exchange = null;

        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);

            if (!exchange.has.fetchBalance) {
                throw new Error(
                    `Exchange '${exchangeId}' does not support balance fetching`,
                );
            }

            this.logger.log(`💰 Fetching balances from ${exchangeId}...`);

            const balances = await this.retryWithBackoff(
                () => exchange.fetchBalance(),
                this.maxRetries,
                `fetchBalance for ${exchangeId}`,
            );

            // Transform CCXT balance format to our standardized format
            const balanceData = balances as any; // Type assertion for CCXT balance object
            const transformedBalances: ExchangeBalance[] = Object.entries(
                balanceData.total || {},
            )
                .filter(([symbol, amount]) => amount && (amount as number) > 0)
                .map(([symbol, total]) => ({
                    symbol: symbol,
                    free: balanceData.free?.[symbol] || 0,
                    used: balanceData.used?.[symbol] || 0,
                    total: total as number,
                }));

            this.logger.log(
                `✅ Fetched ${transformedBalances.length} balances from ${exchangeId}`,
            );
            return transformedBalances;
        } catch (error) {
            this.logger.error(
                `❌ Failed to fetch balances from ${exchangeId}:`,
                error,
            );
            throw error;
        } finally {
            // Clean up exchange instance
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(
                        `⚠️ Failed to close ${exchangeId} connection:`,
                        closeError,
                    );
                }
            }
        }
    }

    /**
     * Test exchange connectivity with provided credentials
     */
    async testExchangeConnection(
        exchangeId: string,
        credentials: ExchangeCredentials,
    ): Promise<boolean> {
        let exchange = null;

        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);

            this.logger.log(`🔌 Testing connection to ${exchangeId}...`);

            // Try to fetch exchange info or balance to test credentials
            if (exchange.has.fetchBalance) {
                await exchange.fetchBalance();
            } else if (
                exchange.has.fetchTicker &&
                exchange.symbols.length > 0
            ) {
                await exchange.fetchTicker(exchange.symbols[0]);
            } else {
                // Fallback: just check if we can create the instance
                this.logger.log(
                    `ℹ️ ${exchangeId} has limited API testing capabilities`,
                );
            }

            this.logger.log(`✅ Connection test passed for ${exchangeId}`);
            return true;
        } catch (error) {
            this.logger.error(
                `❌ Connection test failed for ${exchangeId}:`,
                error,
            );
            return false;
        } finally {
            // Clean up exchange instance
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(
                        `⚠️ Failed to close ${exchangeId} connection:`,
                        closeError,
                    );
                }
            }
        }
    }

    /**
     * Get exchange information
     */
    getExchangeInfo(exchangeId: string): ExchangeInfo | null {
        try {
            const normalizedExchangeId = exchangeId.toLowerCase();

            if (!this.isExchangeSupported(normalizedExchangeId)) {
                return null;
            }

            const ExchangeClass = ccxt[normalizedExchangeId];
            if (!ExchangeClass) {
                return null;
            }

            const exchangeInstance: ccxt.Exchange = new ExchangeClass();

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
        } catch (error) {
            this.logger.error(
                `❌ Failed to get exchange info for ${exchangeId}:`,
                error,
            );
            return null;
        }
    }

    // =============================================================================
    // ENHANCED DATA FETCHING METHODS FOR PRECOMPUTATION
    // =============================================================================

    /**
     * Discover all symbols that have been traded in the portfolio
     * This includes current balance symbols + historical trading symbols
     */
    async discoverPortfolioSymbols(
        exchangeId: string,
        credentials: ExchangeCredentials,
        currentBalanceSymbols: string[],
    ): Promise<string[]> {
        let exchange = null;

        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(`🔍 Discovering symbols for ${exchangeId}...`);

            const discoveredSymbols = new Set<string>(currentBalanceSymbols);

            // Try to get trading history to discover additional symbols
            if (exchange.has.fetchMyTrades) {
                try {
                    // Fetch recent trades without symbol filter to discover all traded symbols
                    const recentTrades = await this.retryWithBackoff(
                        () =>
                            exchange.fetchMyTrades(undefined, undefined, 1000),
                        this.maxRetries,
                        `fetchMyTrades for symbol discovery on ${exchangeId}`,
                    );

                    // Extract unique symbols from trades
                    for (const trade of recentTrades as any[]) {
                        if (trade.symbol) {
                            discoveredSymbols.add(trade.symbol);
                        }
                    }
                } catch (error) {
                    this.logger.warn(
                        `⚠️ Could not fetch trades for symbol discovery: ${error.message}`,
                    );
                }
            }

            const symbolArray = Array.from(discoveredSymbols);
            this.logger.log(
                `✅ Discovered ${symbolArray.length} symbols for ${exchangeId}`,
            );
            return symbolArray;
        } catch (error) {
            this.logger.error(
                `❌ Failed to discover symbols for ${exchangeId}:`,
                error,
            );
            // Return at least the current balance symbols
            return currentBalanceSymbols;
        } finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(
                        `⚠️ Failed to close ${exchangeId} connection:`,
                        closeError,
                    );
                }
            }
        }
    }

    /**
     * Fetch comprehensive trading history for all discovered symbols
     */
    async fetchTradeHistory(
        exchangeId: string,
        credentials: ExchangeCredentials,
        tradingPairs: string[],
        limit: number = 1000,
    ): Promise<ccxt.Trade[]> {
        let exchange: ccxt.Exchange = null;

        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(
                `📊 Fetching trade history for ${tradingPairs.length} symbols from ${exchangeId}...`,
            );

            if (!exchange.has.fetchMyTrades) {
                throw new Error(
                    `Exchange '${exchangeId}' does not support trade history fetching`,
                );
            }

            const allTrades: ccxt.Trade[] = [];
            const batchSize = 5; // Process symbols in batches to avoid rate limits

            for (let i = 0; i < tradingPairs.length; i += batchSize) {
                const batch = tradingPairs.slice(i, i + batchSize);

                for (const symbol of batch) {
                    try {
                        this.logger.debug(
                            `📈 Fetching trades for ${symbol}...`,
                        );

                        const trades = await this.retryWithBackoff(
                            () =>
                                exchange.fetchMyTrades(
                                    symbol,
                                    undefined,
                                    limit,
                                ),
                            this.maxRetries,
                            `fetchMyTrades for ${symbol} on ${exchangeId}`,
                        );

                        allTrades.push(...(trades));

                        // Add delay between requests to respect rate limits
                        await new Promise((resolve) =>
                            setTimeout(resolve, 100),
                        );
                    } catch (error) {
                        this.logger.warn(
                            `⚠️ Failed to fetch trades for ${symbol}: ${error.message}`,
                        );
                        continue;
                    }
                }

                // Longer delay between batches
                if (i + batchSize < tradingPairs.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                }
            }

            this.logger.log(
                `✅ Fetched ${allTrades.length} trades from ${exchangeId}`,
            );
            return allTrades;
        } catch (error) {
            this.logger.error(
                `❌ Failed to fetch trade history from ${exchangeId}:`,
                error,
            );
            throw error;
        } finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(
                        `⚠️ Failed to close ${exchangeId} connection:`,
                        closeError,
                    );
                }
            }
        }
    }

    /**
     * Fetch historical price data for portfolio assets
     */
    async fetchPriceHistory(
        exchangeId: string,
        credentials: ExchangeCredentials,
        symbols: string[],
        timeframe: string = "1d",
        limit: number = 100,
    ): Promise<Map<string, any[]>> {
        let exchange: ccxt.Exchange = null;

        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(
                `📈 Fetching price history for ${symbols.length} symbols from ${exchangeId}...`,
            );

            if (!exchange.has.fetchOHLCV) {
                this.logger.warn(
                    `⚠️ Exchange '${exchangeId}' does not support OHLCV data fetching`,
                );
                return new Map();
            }

            const priceHistory = new Map<string, any[]>();
            const batchSize = 3; // Smaller batch size for OHLCV data

            for (let i = 0; i < symbols.length; i += batchSize) {
                const batch = symbols.slice(i, i + batchSize);

                for (const symbol of batch) {
                    try {
                        this.logger.debug(`📊 Fetching OHLCV for ${symbol}...`);

                        const ohlcv = await this.retryWithBackoff(
                            () =>
                                exchange.fetchOHLCV(
                                    symbol,
                                    timeframe,
                                    undefined,
                                    limit,
                                ),
                            this.maxRetries,
                            `fetchOHLCV for ${symbol} on ${exchangeId}`,
                        );

                        const ohlcvData = ohlcv as any[];
                        if (ohlcvData && ohlcvData.length > 0) {
                            priceHistory.set(symbol, ohlcvData);
                        }

                        // Add delay between requests
                        await new Promise((resolve) =>
                            setTimeout(resolve, 200),
                        );
                    } catch (error) {
                        this.logger.warn(
                            `⚠️ Failed to fetch OHLCV for ${symbol}: ${error.message}`,
                        );
                        continue;
                    }
                }

                // Longer delay between batches
                if (i + batchSize < symbols.length) {
                    await new Promise((resolve) => setTimeout(resolve, 1500));
                }
            }

            this.logger.log(
                `✅ Fetched price history for ${priceHistory.size} symbols from ${exchangeId}`,
            );
            return priceHistory;
        } catch (error) {
            this.logger.error(
                `❌ Failed to fetch price history from ${exchangeId}:`,
                error,
            );
            throw error;
        } finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(
                        `⚠️ Failed to close ${exchangeId} connection:`,
                        closeError,
                    );
                }
            }
        }
    }

    /**
     * Fetch current market prices for portfolio assets
     */
    async fetchCurrentPrices(
        exchangeId: string,
        credentials: ExchangeCredentials,
        symbols: string[],
    ): Promise<Map<string, number>> {
        let exchange: ccxt.Exchange = null;

        try {
            exchange = this.createExchangeInstance(exchangeId, credentials);
            this.logger.log(
                `💰 Fetching current prices for ${symbols.length} symbols from ${exchangeId}...`,
            );

            const currentPrices = new Map<string, number>();

            if (exchange.has.fetchTickers) {
                // Fetch all tickers at once if supported
                try {
                    const tickers = await this.retryWithBackoff(
                        () => exchange.fetchTickers(symbols),
                        this.maxRetries,
                        `fetchTickers for ${exchangeId}`,
                    );

                    for (const [symbol, ticker] of Object.entries(tickers)) {
                        if (
                            ticker &&
                            typeof ticker === "object" &&
                            "last" in ticker
                        ) {
                            currentPrices.set(
                                symbol,
                                (ticker as any).last || 0,
                            );
                        }
                    }
                } catch (error) {
                    this.logger.warn(
                        `⚠️ Batch ticker fetch failed, falling back to individual requests: ${error.message}`,
                    );
                }
            }

            // Fallback: fetch individual tickers for missing symbols
            if (exchange.has.fetchTicker) {
                for (const symbol of symbols) {
                    if (!currentPrices.has(symbol)) {
                        try {
                            const ticker = await this.retryWithBackoff(
                                () => exchange.fetchTicker(symbol),
                                this.maxRetries,
                                `fetchTicker for ${symbol} on ${exchangeId}`,
                            );

                            const tickerData = ticker as any;
                            if (tickerData && tickerData.last) {
                                currentPrices.set(symbol, tickerData.last);
                            }

                            // Add delay between individual requests
                            await new Promise((resolve) =>
                                setTimeout(resolve, 100),
                            );
                        } catch (error) {
                            this.logger.warn(
                                `⚠️ Failed to fetch ticker for ${symbol}: ${error.message}`,
                            );
                            continue;
                        }
                    }
                }
            }

            this.logger.log(
                `✅ Fetched current prices for ${currentPrices.size} symbols from ${exchangeId}`,
            );
            return currentPrices;
        } catch (error) {
            this.logger.error(
                `❌ Failed to fetch current prices from ${exchangeId}:`,
                error,
            );
            throw error;
        } finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(
                        `⚠️ Failed to close ${exchangeId} connection:`,
                        closeError,
                    );
                }
            }
        }
    }

    // =============================================================================
    // ENCRYPTION METHODS
    // =============================================================================

    /**
     * Primary encryption method using Web Crypto API (AES-256-GCM)
     */
    async encryptApiKey(apiKey: string): Promise<string> {
        try {
            this.logger.debug("🔒 Encrypting API key with Web Crypto API");

            if (!apiKey) {
                throw new Error("API key cannot be empty");
            }

            // Generate random salt for key derivation
            const salt = crypto.getRandomValues(
                new Uint8Array(this.saltLength),
            );

            // Generate random IV for GCM
            const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));

            // Derive encryption key using PBKDF2
            const cryptoKey = await this.deriveKey(this.masterSecret, salt);

            // Encrypt the API key
            const encoder = new TextEncoder();
            const data = encoder.encode(apiKey);

            const encryptedData = await crypto.subtle.encrypt(
                {
                    name: this.algorithm,
                    iv: iv,
                },
                cryptoKey,
                data,
            );

            // Combine salt + IV + encrypted data + auth tag
            const combined = new Uint8Array(
                this.saltLength + this.ivLength + encryptedData.byteLength,
            );
            combined.set(salt, 0);
            combined.set(iv, this.saltLength);
            combined.set(
                new Uint8Array(encryptedData),
                this.saltLength + this.ivLength,
            );

            // Encode as base64 with Web Crypto prefix
            const base64Result =
                this.webCryptoPrefix + this.arrayBufferToBase64(combined);

            this.logger.debug(
                "✅ API key encrypted successfully with Web Crypto API",
            );
            return base64Result;
        } catch (error) {
            this.logger.error(
                "❌ Failed to encrypt API key with Web Crypto API",
                error,
            );
            throw new Error(`Web Crypto encryption failed: ${error.message}`);
        }
    }

    /**
     * Primary decryption method using Web Crypto API only
     */
    async decryptApiKey(encryptedApiKey: string): Promise<string> {
        try {
            this.logger.debug("🔓 Decrypting API key with Web Crypto API");

            if (!encryptedApiKey) {
                throw new Error("Encrypted API key cannot be empty");
            }

            // Only support Web Crypto format now
            if (!encryptedApiKey.startsWith(this.webCryptoPrefix)) {
                throw new Error(
                    "Unsupported encryption format - only Web Crypto API format is supported",
                );
            }

            return await this.decryptWebCrypto(encryptedApiKey);
        } catch (error) {
            this.logger.error("❌ Failed to decrypt API key", error);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Encrypt secret key (uses same method as API key)
     */
    async encryptSecretKey(secretKey: string): Promise<string> {
        return this.encryptApiKey(secretKey);
    }

    /**
     * Decrypt secret key (uses same method as API key)
     */
    async decryptSecretKey(encryptedSecretKey: string): Promise<string> {
        return this.decryptApiKey(encryptedSecretKey);
    }

    /**
     * Encrypt passphrase (uses same method as API key)
     */
    async encryptPassphrase(passphrase: string): Promise<string> {
        return this.encryptApiKey(passphrase);
    }

    /**
     * Decrypt passphrase (uses same method as API key)
     */
    async decryptPassphrase(encryptedPassphrase: string): Promise<string> {
        return this.decryptApiKey(encryptedPassphrase);
    }

    /**
     * Decrypt all exchange credentials at once
     */
    async decryptExchangeCredentials(credentials: {
        apiKey: string;
        secretKey: string;
        passphrase?: string;
    }): Promise<{
        apiKey: string;
        secretKey: string;
        passphrase?: string;
    }> {
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
        } catch (error) {
            this.logger.error(
                "❌ Failed to decrypt exchange credentials:",
                error,
            );
            throw new Error("Invalid or corrupted exchange credentials");
        }
    }

    // =============================================================================
    // PRIVATE HELPER METHODS
    // =============================================================================

    /**
     * Retry operation with exponential backoff
     */
    private async retryWithBackoff<T>(
        operation: () => Promise<T>,
        maxRetries: number,
        operationName: string,
        baseDelay: number = 1000,
    ): Promise<T> {
        let lastError: Error;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                this.logger.debug(
                    `🔄 Attempting ${operationName} (attempt ${attempt}/${maxRetries})`,
                );
                return await operation();
            } catch (error) {
                lastError = error;

                if (attempt === maxRetries) {
                    this.logger.error(
                        `❌ ${operationName} failed after ${maxRetries} attempts:`,
                        error,
                    );
                    break;
                }

                const delay = baseDelay * Math.pow(2, attempt - 1);
                this.logger.warn(
                    `⚠️ ${operationName} attempt ${attempt} failed, retrying in ${delay}ms:`,
                    error.message,
                );

                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

    /**
     * Web Crypto API decryption implementation
     */
    private async decryptWebCrypto(encryptedApiKey: string): Promise<string> {
        try {
            // Remove Web Crypto prefix and decode base64
            const base64Data = encryptedApiKey.substring(
                this.webCryptoPrefix.length,
            );
            const combined = this.base64ToArrayBuffer(base64Data);

            // Extract components
            const salt = combined.slice(0, this.saltLength);
            const iv = combined.slice(
                this.saltLength,
                this.saltLength + this.ivLength,
            );
            const encryptedData = combined.slice(
                this.saltLength + this.ivLength,
            );

            // Derive decryption key
            const cryptoKey = await this.deriveKey(this.masterSecret, salt);

            // Decrypt the data
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: this.algorithm,
                    iv: iv,
                },
                cryptoKey,
                encryptedData,
            );

            // Convert back to string
            const decoder = new TextDecoder();
            const result = decoder.decode(decryptedData);

            this.logger.debug(
                "✅ API key decrypted successfully with Web Crypto API",
            );
            return result;
        } catch (error) {
            this.logger.error("❌ Web Crypto decryption failed", error);
            throw new Error(`Web Crypto decryption failed: ${error.message}`);
        }
    }

    /**
     * Derive encryption key using PBKDF2 with SHA-256
     */
    private async deriveKey(
        secret: string,
        salt: Uint8Array,
    ): Promise<CryptoKey> {
        try {
            // Import the master secret as key material
            const keyMaterial = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(secret),
                { name: "PBKDF2" },
                false,
                ["deriveKey"],
            );

            // Derive the actual encryption key
            const cryptoKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: this.iterations,
                    hash: "SHA-256",
                },
                keyMaterial,
                { name: this.algorithm, length: this.keyLength },
                false,
                ["encrypt", "decrypt"],
            );

            return cryptoKey;
        } catch (error) {
            this.logger.error("❌ Key derivation failed", error);
            throw new Error("Key derivation failed");
        }
    }

    /**
     * Convert ArrayBuffer to base64 string
     */
    private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert base64 string to Uint8Array
     */
    private base64ToArrayBuffer(base64: string): Uint8Array {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    // =============================================================================
    // SYMBOL-TO-TRADING-PAIR CONVERSION METHODS
    // =============================================================================

    /**
     * Classify discovered symbols into trading pairs, individual assets, and invalid symbols
     */
    private classifyDiscoveredSymbols(symbols: string[]): SymbolClassification {
        const tradingPairs: string[] = [];
        const individualAssets: string[] = [];
        const invalidSymbols: string[] = [];

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
            } else if (this.isValidAsset(cleanSymbol)) {
                individualAssets.push(cleanSymbol);
            } else {
                invalidSymbols.push(cleanSymbol);
            }
        }

        this.logger.debug(
            `✅ Symbol classification complete: ${tradingPairs.length} pairs, ${individualAssets.length} assets, ${invalidSymbols.length} invalid`
        );

        return { tradingPairs, individualAssets, invalidSymbols };
    }

    /**
     * Detect if a symbol is a trading pair (contains separator)
     */
    private isTradingPair(symbol: string): boolean {
        // Common trading pair separators used by exchanges
        const separators = ['/', '-', '_', ':'];
        return separators.some(sep => symbol.includes(sep));
    }

    /**
     * Validate if a symbol is a valid individual asset
     */
    private isValidAsset(symbol: string): boolean {
        // Basic validation for cryptocurrency symbols
        // - Length between 2-10 characters
        // - Only alphanumeric characters
        // - Not a known stablecoin pair indicator
        if (symbol.length < 2 || symbol.length > 10) {
            return false;
        }

        if (!/^[A-Z0-9]+$/i.test(symbol)) {
            return false;
        }

        // Skip obvious non-asset symbols
        const invalidPatterns = ['USD', 'EUR', 'GBP', 'JPY', 'CNY'];
        if (invalidPatterns.some(pattern => symbol.endsWith(pattern) && symbol.length > pattern.length)) {
            return false;
        }

        return true;
    }

    /**
     * Get exchange-specific trading pair separator
     */
    getExchangePairSeparator(exchangeId: string): string {
        // Exchange-specific separators
        const separatorMap: Record<string, string> = {
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

    /**
     * Generate optimal trading pairs for individual assets
     */
    private generateOptimalTradingPairs(assets: string[], exchangeId: string): string[] {
        const separator = this.getExchangePairSeparator(exchangeId);
        const generatedPairs: string[] = [];

        this.logger.debug(`🔧 Generating trading pairs for ${assets.length} assets using separator '${separator}'`);

        for (const asset of assets) {
            // Skip if asset is already a quote currency to avoid circular pairs
            if (this.quoteCurrencyPriority.includes(asset.toUpperCase())) {
                continue;
            }

            // Generate pairs with priority quote currencies
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

    /**
     * Get cached exchange markets or fetch fresh data
     */
    private async getCachedExchangeMarkets(exchangeId: string): Promise<Map<string, any>> {
        const cacheKey = exchangeId.toLowerCase();
        const cached = this.marketCache.get(cacheKey);

        // Check if cache is valid
        if (cached && (Date.now() - cached.lastUpdated.getTime()) < this.marketCacheTimeout) {
            this.logger.debug(`📋 Using cached markets for ${exchangeId} (${cached.markets.size} markets)`);
            return cached.markets;
        }

        // Fetch fresh market data
        this.logger.debug(`🔄 Fetching fresh market data for ${exchangeId}...`);
        const markets = await this.fetchExchangeMarkets(exchangeId);

        // Update cache
        this.marketCache.set(cacheKey, {
            markets,
            lastUpdated: new Date(),
            exchangeId: cacheKey,
        });

        this.logger.debug(`✅ Cached ${markets.size} markets for ${exchangeId}`);
        return markets;
    }

    /**
     * Fetch exchange markets from CCXT
     */
    private async fetchExchangeMarkets(exchangeId: string): Promise<Map<string, any>> {
        let exchange: ccxt.Exchange = null;

        try {
            // Create exchange instance without credentials for market data
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

            const markets = await this.retryWithBackoff(
                () => exchange.loadMarkets(),
                this.maxRetries,
                `fetchMarkets for ${exchangeId}`,
            );

            const marketMap = new Map<string, any>();
            for (const [symbol, market] of Object.entries(markets)) {
                marketMap.set(symbol, market);
            }

            return marketMap;
        } catch (error) {
            this.logger.error(`❌ Failed to fetch markets for ${exchangeId}:`, error);
            return new Map();
        } finally {
            if (exchange && typeof exchange.close === "function") {
                try {
                    await exchange.close();
                } catch (closeError) {
                    this.logger.warn(`⚠️ Failed to close ${exchangeId} connection:`, closeError);
                }
            }
        }
    }

    /**
     * Validate trading pairs against exchange markets
     */
    private async validateAgainstExchangeMarkets(
        pairs: string[],
        exchangeId: string,
    ): Promise<ValidatedPairSet> {
        this.logger.debug(`🔍 Validating ${pairs.length} trading pairs against ${exchangeId} markets...`);

        const markets = await this.getCachedExchangeMarkets(exchangeId);
        const validPairs: string[] = [];
        const invalidPairs: string[] = [];

        for (const pair of pairs) {
            const market = markets.get(pair);
            if (market && market.active !== false) {
                validPairs.push(pair);
            } else {
                invalidPairs.push(pair);
            }
        }

        this.logger.debug(
            `✅ Validation complete: ${validPairs.length} valid, ${invalidPairs.length} invalid pairs`
        );

        return {
            validPairs,
            invalidPairs,
            fallbackPairs: new Map(),
        };
    }

    /**
     * Resolve fallback pairs for invalid pairs
     */
    private resolveFallbackPairs(
        invalidPairs: string[],
        markets: Map<string, any>,
        exchangeId: string,
    ): Map<string, string> {
        const fallbacks = new Map<string, string>();
        const separator = this.getExchangePairSeparator(exchangeId);

        this.logger.debug(`🔄 Resolving fallbacks for ${invalidPairs.length} invalid pairs...`);

        for (const invalidPair of invalidPairs) {
            const baseAsset = this.extractBaseAsset(invalidPair, separator);
            if (!baseAsset) continue;

            const fallbackPair = this.findBestAlternativePair(baseAsset, markets, separator);
            if (fallbackPair) {
                fallbacks.set(baseAsset, fallbackPair);
                this.logger.debug(`🔄 Fallback for ${baseAsset}: ${fallbackPair}`);
            }
        }

        this.logger.debug(`✅ Resolved ${fallbacks.size} fallback pairs`);
        return fallbacks;
    }

    /**
     * Extract base asset from trading pair
     */
    private extractBaseAsset(pair: string, separator: string): string | null {
        const parts = pair.split(separator);
        return parts.length >= 2 ? parts[0] : null;
    }

    /**
     * Find best alternative trading pair for an asset
     */
    private findBestAlternativePair(
        asset: string,
        markets: Map<string, any>,
        separator: string,
    ): string | null {
        // Try quote currencies in priority order
        for (const quote of this.quoteCurrencyPriority) {
            if (asset.toUpperCase() === quote) continue;

            const candidatePair = `${asset.toUpperCase()}${separator}${quote}`;
            const market = markets.get(candidatePair);
            
            if (market && market.active !== false) {
                return candidatePair;
            }
        }

        return null;
    }

    /**
     * Convert discovered symbols to validated trading pairs using hybrid intelligent resolution
     */
    async convertSymbolsToTradingPairs(
        symbols: string[],
        exchangeId: string,
    ): Promise<string[]> {
        this.logger.log(`🔄 Converting ${symbols.length} symbols to trading pairs for ${exchangeId}...`);

        try {
            // Step 1: Classify discovered symbols
            const classification = this.classifyDiscoveredSymbols(symbols);

            // Step 2: Generate pairs for individual assets
            const generatedPairs = this.generateOptimalTradingPairs(
                classification.individualAssets,
                exchangeId,
            );

            // Step 3: Combine trading pairs from history with generated pairs
            const allCandidatePairs = [
                ...classification.tradingPairs,
                ...generatedPairs,
            ];

            // Remove duplicates
            const uniquePairs = Array.from(new Set(allCandidatePairs));

            // Step 4: Validate against exchange markets
            const validationResult = await this.validateAgainstExchangeMarkets(
                uniquePairs,
                exchangeId,
            );

            // Step 5: Resolve fallbacks for invalid pairs
            const markets = await this.getCachedExchangeMarkets(exchangeId);
            const fallbackPairs = this.resolveFallbackPairs(
                validationResult.invalidPairs,
                markets,
                exchangeId,
            );

            // Step 6: Combine valid pairs with fallbacks
            const finalPairs = [
                ...validationResult.validPairs,
                ...Array.from(fallbackPairs.values()),
            ];

            // Remove duplicates again
            const uniqueFinalPairs = Array.from(new Set(finalPairs));

            // Log conversion summary
            this.logger.log(`✅ Symbol conversion complete for ${exchangeId}:`);
            this.logger.log(`   📊 Input: ${symbols.length} symbols`);
            this.logger.log(`   🔍 Classification: ${classification.tradingPairs.length} pairs, ${classification.individualAssets.length} assets, ${classification.invalidSymbols.length} invalid`);
            this.logger.log(`   🔧 Generated: ${generatedPairs.length} pairs`);
            this.logger.log(`   ✅ Valid: ${validationResult.validPairs.length} pairs`);
            this.logger.log(`   🔄 Fallbacks: ${fallbackPairs.size} pairs`);
            this.logger.log(`   🎯 Final: ${uniqueFinalPairs.length} trading pairs`);

            // Log invalid symbols for debugging
            if (classification.invalidSymbols.length > 0) {
                this.logger.debug(`⚠️ Invalid symbols skipped: ${classification.invalidSymbols.join(', ')}`);
            }

            return uniqueFinalPairs;
        } catch (error) {
            this.logger.error(`❌ Failed to convert symbols to trading pairs for ${exchangeId}:`, error);
            
            // Fallback: return only symbols that look like trading pairs
            const fallbackPairs = symbols.filter(symbol => this.isTradingPair(symbol));
            this.logger.warn(`🔄 Using fallback: ${fallbackPairs.length} trading pairs from original symbols`);
            
            return fallbackPairs;
        }
    }
}
