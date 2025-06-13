import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EncryptionService {
    private readonly logger = new Logger(EncryptionService.name);
    private readonly masterSecret: string;
    // Legacy Fernet support removed - using Web Crypto API only

    // Web Crypto API constants
    private readonly algorithm = "AES-GCM";
    private readonly keyLength = 256;
    private readonly ivLength = 12; // 96 bits for GCM
    private readonly saltLength = 32; // 256 bits for PBKDF2
    private readonly iterations = 100000; // OWASP recommended minimum
    private readonly webCryptoPrefix = "WC1"; // Identifier for Web Crypto format

    constructor(private readonly configService: ConfigService) {
        const masterKey = this.configService.get<string>(
            "CRYPTO_PORTFOLIO_MASTER_KEY",
        );
        if (!masterKey) {
            throw new Error("CRYPTO_PORTFOLIO_MASTER_KEY is required");
        }

        this.masterSecret = masterKey;

        this.logger.log(
            "✅ Encryption service initialized with Web Crypto API",
        );
    }

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

    // Legacy Fernet methods removed - Web Crypto API only

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

    // Migration utilities removed - using Web Crypto API only

    /**
     * Test encryption/decryption roundtrip for Web Crypto API
     */
    async validateEncryptionCompatibility(): Promise<boolean> {
        try {
            this.logger.log("🔍 Validating encryption compatibility");
            const testKey = "test-api-key-12345";

            // Test Web Crypto API roundtrip
            const webCryptoEncrypted = await this.encryptApiKey(testKey);
            const webCryptoDecrypted =
                await this.decryptApiKey(webCryptoEncrypted);
            const webCryptoValid = webCryptoDecrypted === testKey;

            if (webCryptoValid) {
                this.logger.log(
                    "✅ Encryption compatibility validation passed",
                );
            } else {
                this.logger.error(
                    "❌ Encryption compatibility validation failed",
                );
            }

            return webCryptoValid;
        } catch (error) {
            this.logger.error(
                "❌ Encryption compatibility validation failed",
                error,
            );
            return false;
        }
    }

    /**
     * Clear sensitive data from memory (limited effectiveness in JavaScript)
     */
    clearSensitiveData(data: string): void {
        try {
            // JavaScript string immutability limits effectiveness
            // This is mainly for documentation and potential future Buffer usage
            data = "";
        } catch {
            // Ignore errors in clearing
        }
    }

    /**
     * Get encryption service health status
     */
    getHealthStatus() {
        return {
            service: "encryption",
            algorithm: this.algorithm,
            keyLength: this.keyLength,
            supportedFormats: ["webcrypto"],
            webCryptoReady: !!crypto?.subtle,
            timestamp: new Date(),
        };
    }
}
