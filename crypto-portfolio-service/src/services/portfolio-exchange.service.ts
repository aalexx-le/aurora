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
            "🔌 Portfolio Exchange Service initialized with CCXT exchange support and Web Crypto API encryption",
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

            this.logger.log(
                `✅ Created ${exchangeId} exchange instance`,
            );
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
        } catch (error) {
            this.logger.error(
                `❌ Failed to get exchange info for ${exchangeId}:`,
                error,
            );
            return null;
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

    /**
     * Test encryption/decryption functionality
     */
    async testEncryption(
        testString: string = "test-encryption-key",
    ): Promise<boolean> {
        try {
            this.logger.debug(
                "🧪 Testing encryption/decryption functionality...",
            );

            const encrypted = await this.encryptApiKey(testString);
            const decrypted = await this.decryptApiKey(encrypted);

            const isWorking = decrypted === testString;

            if (isWorking) {
                this.logger.debug("✅ Encryption test passed");
            } else {
                this.logger.error(
                    "❌ Encryption test failed: decrypted value does not match original",
                );
            }

            return isWorking;
        } catch (error) {
            this.logger.error("❌ Encryption test failed:", error);
            return false;
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
}
