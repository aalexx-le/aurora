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
        this.timeout = this.configService.get("EXCHANGE_TIMEOUT", 30000);
        this.maxRetries = this.configService.get("MAX_RETRIES", 3);
        const masterKey = this.configService.get("CRYPTO_PORTFOLIO_MASTER_KEY", "default-master-key-change-in-production");
        if (!masterKey ||
            masterKey === "default-master-key-change-in-production") {
            this.logger.warn("⚠️ Using default encryption key - change this in production!");
        }
        this.masterSecret = masterKey;
        this.logger.log("🔌 Portfolio Exchange Service initialized with CCXT exchange support and Web Crypto API encryption");
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
    async testEncryption(testString = "test-encryption-key") {
        try {
            this.logger.debug("🧪 Testing encryption/decryption functionality...");
            const encrypted = await this.encryptApiKey(testString);
            const decrypted = await this.decryptApiKey(encrypted);
            const isWorking = decrypted === testString;
            if (isWorking) {
                this.logger.debug("✅ Encryption test passed");
            }
            else {
                this.logger.error("❌ Encryption test failed: decrypted value does not match original");
            }
            return isWorking;
        }
        catch (error) {
            this.logger.error("❌ Encryption test failed:", error);
            return false;
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
};
exports.PortfolioExchangeService = PortfolioExchangeService;
exports.PortfolioExchangeService = PortfolioExchangeService = PortfolioExchangeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PortfolioExchangeService);
//# sourceMappingURL=portfolio-exchange.service.js.map