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
    constructor(configService: ConfigService);
    getAllSupportedExchanges(): ExchangeInfo[];
    isExchangeSupported(exchangeId: string): boolean;
    createExchangeInstance(exchangeId: string, credentials: ExchangeCredentials): ccxt.Exchange;
    fetchBalances(exchangeId: string, credentials: ExchangeCredentials): Promise<ExchangeBalance[]>;
    testExchangeConnection(exchangeId: string, credentials: ExchangeCredentials): Promise<boolean>;
    getExchangeInfo(exchangeId: string): ExchangeInfo | null;
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
    testEncryption(testString?: string): Promise<boolean>;
    private retryWithBackoff;
    private decryptWebCrypto;
    private deriveKey;
    private arrayBufferToBase64;
    private base64ToArrayBuffer;
}
export {};
