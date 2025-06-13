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
var EncryptionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let EncryptionService = EncryptionService_1 = class EncryptionService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EncryptionService_1.name);
        this.algorithm = "AES-GCM";
        this.keyLength = 256;
        this.ivLength = 12;
        this.saltLength = 32;
        this.iterations = 100000;
        this.webCryptoPrefix = "WC1";
        const masterKey = this.configService.get("CRYPTO_PORTFOLIO_MASTER_KEY");
        if (!masterKey) {
            throw new Error("CRYPTO_PORTFOLIO_MASTER_KEY is required");
        }
        this.masterSecret = masterKey;
        this.logger.log("✅ Encryption service initialized with Web Crypto API");
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
    async validateEncryptionCompatibility() {
        try {
            this.logger.log("🔍 Validating encryption compatibility");
            const testKey = "test-api-key-12345";
            const webCryptoEncrypted = await this.encryptApiKey(testKey);
            const webCryptoDecrypted = await this.decryptApiKey(webCryptoEncrypted);
            const webCryptoValid = webCryptoDecrypted === testKey;
            if (webCryptoValid) {
                this.logger.log("✅ Encryption compatibility validation passed");
            }
            else {
                this.logger.error("❌ Encryption compatibility validation failed");
            }
            return webCryptoValid;
        }
        catch (error) {
            this.logger.error("❌ Encryption compatibility validation failed", error);
            return false;
        }
    }
    clearSensitiveData(data) {
        try {
            data = "";
        }
        catch {
        }
    }
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
};
exports.EncryptionService = EncryptionService;
exports.EncryptionService = EncryptionService = EncryptionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EncryptionService);
//# sourceMappingURL=encryption.service.js.map