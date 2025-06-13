import { ConfigService } from "@nestjs/config";
export declare class EncryptionService {
    private readonly configService;
    private readonly logger;
    private readonly masterSecret;
    private readonly algorithm;
    private readonly keyLength;
    private readonly ivLength;
    private readonly saltLength;
    private readonly iterations;
    private readonly webCryptoPrefix;
    constructor(configService: ConfigService);
    encryptApiKey(apiKey: string): Promise<string>;
    decryptApiKey(encryptedApiKey: string): Promise<string>;
    private decryptWebCrypto;
    private deriveKey;
    private arrayBufferToBase64;
    private base64ToArrayBuffer;
    validateEncryptionCompatibility(): Promise<boolean>;
    clearSensitiveData(data: string): void;
    getHealthStatus(): {
        service: string;
        algorithm: string;
        keyLength: number;
        supportedFormats: string[];
        webCryptoReady: boolean;
        timestamp: Date;
    };
}
