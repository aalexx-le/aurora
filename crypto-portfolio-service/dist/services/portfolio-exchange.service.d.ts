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
export declare class PortfolioExchangeService {
    private readonly configService;
    private readonly logger;
    private readonly timeout;
    private readonly maxRetries;
    private readonly masterSecret;
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    private readonly saltLength;
    private readonly iterations;
    private readonly webCryptoPrefix;
    private readonly marketCacheTimeout;
    private readonly marketCache;
    private readonly quoteCurrencyPriority;
    constructor(configService: ConfigService);
    getAllSupportedExchanges(): ExchangeInfo[];
    isExchangeSupported(exchangeId: string): boolean;
    createExchangeInstance(exchangeId: string, credentials: ExchangeCredentials): ccxt.Exchange;
    fetchBalances(exchangeId: string, credentials: ExchangeCredentials): Promise<ExchangeBalance[]>;
    testExchangeConnection(exchangeId: string, credentials: ExchangeCredentials): Promise<boolean>;
    getExchangeInfo(exchangeId: string): ExchangeInfo | null;
    discoverPortfolioSymbols(exchangeId: string, credentials: ExchangeCredentials, currentBalanceSymbols: string[]): Promise<string[]>;
    fetchTradeHistory(exchangeId: string, credentials: ExchangeCredentials, tradingPairs: string[], limit?: number): Promise<ccxt.Trade[]>;
    fetchPriceHistory(exchangeId: string, credentials: ExchangeCredentials, symbols: string[], timeframe?: string, limit?: number): Promise<Map<string, any[]>>;
    fetchCurrentPrices(exchangeId: string, credentials: ExchangeCredentials, symbols: string[]): Promise<Map<string, number>>;
    encryptApiKey(apiKey: string): Promise<string>;
    decryptApiKey(encryptedApiKey: string): Promise<string>;
    encryptSecretKey(secretKey: string): Promise<string>;
    decryptSecretKey(encryptedSecretKey: string): Promise<string>;
    encryptPassphrase(passphrase: string): Promise<string>;
    decryptPassphrase(encryptedPassphrase: string): Promise<string>;
    decryptExchangeCredentials(credentials: {
        apiKey: string;
        secretKey: string;
        passphrase?: string;
    }): Promise<{
        apiKey: string;
        secretKey: string;
        passphrase?: string;
    }>;
    private retryWithBackoff;
    private decryptWebCrypto;
    private deriveKey;
    private arrayBufferToBase64;
    private base64ToArrayBuffer;
    private classifyDiscoveredSymbols;
    private isTradingPair;
    private isValidAsset;
    getExchangePairSeparator(exchangeId: string): string;
    private generateOptimalTradingPairs;
    private getCachedExchangeMarkets;
    private fetchExchangeMarkets;
    private validateAgainstExchangeMarkets;
    private resolveFallbackPairs;
    private extractBaseAsset;
    private findBestAlternativePair;
    convertSymbolsToTradingPairs(symbols: string[], exchangeId: string): Promise<string[]>;
}
export {};
