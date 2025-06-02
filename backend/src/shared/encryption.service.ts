import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fernet from 'fernet';

interface MigrationProgress {
  totalKeys: number;
  migratedKeys: number;
  failedKeys: number;
  inProgressKeys: number;
  percentComplete: number;
  estimatedTimeRemaining: string;
  errorRate: number;
  lastMigrationTime: Date;
}

@Injectable()
export class EncryptionService {
    private readonly logger = new Logger(EncryptionService.name);
    private readonly masterSecret: string;
    private readonly legacySecret: any; // For Fernet fallback during migration
    
    // Web Crypto API constants
    private readonly algorithm = 'AES-GCM';
    private readonly keyLength = 256;
    private readonly ivLength = 12; // 96 bits for GCM
    private readonly saltLength = 32; // 256 bits for PBKDF2
    private readonly iterations = 100000; // OWASP recommended minimum
    private readonly webCryptoPrefix = 'WC1'; // Identifier for Web Crypto format

    constructor(private readonly configService: ConfigService) {
        const masterKey = this.configService.get<string>('CRYPTO_PORTFOLIO_MASTER_KEY');
        if (!masterKey) {
            throw new Error('CRYPTO_PORTFOLIO_MASTER_KEY is required');
        }
        
        this.masterSecret = masterKey;
        
        try {
            // Initialize legacy Fernet support for migration
            this.legacySecret = new fernet.Secret(masterKey);
            this.logger.log('✅ Encryption service initialized with Web Crypto API and Fernet fallback');
        } catch (error) {
            this.logger.error('❌ Failed to initialize encryption service', error);
            throw error;
        }
    }

    /**
     * Primary encryption method using Web Crypto API (AES-256-GCM)
     */
    async encryptApiKey(apiKey: string): Promise<string> {
        try {
            this.logger.debug('🔒 Encrypting API key with Web Crypto API');
            
            if (!apiKey) {
                throw new Error('API key cannot be empty');
            }

            // Generate random salt for key derivation
            const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
            
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
                    iv: iv
                },
                cryptoKey,
                data
            );
            
            // Combine salt + IV + encrypted data + auth tag
            const combined = new Uint8Array(
                this.saltLength + this.ivLength + encryptedData.byteLength
            );
            combined.set(salt, 0);
            combined.set(iv, this.saltLength);
            combined.set(new Uint8Array(encryptedData), this.saltLength + this.ivLength);
            
            // Encode as base64 with Web Crypto prefix
            const base64Result = this.webCryptoPrefix + this.arrayBufferToBase64(combined);
            
            this.logger.debug('✅ API key encrypted successfully with Web Crypto API');
            return base64Result;
        } catch (error) {
            this.logger.error('❌ Failed to encrypt API key with Web Crypto API', error);
            throw new Error(`Web Crypto encryption failed: ${error.message}`);
        }
    }

    /**
     * Primary decryption method with automatic format detection and fallback
     */
    async decryptApiKey(encryptedApiKey: string): Promise<string> {
        try {
            this.logger.debug('🔓 Decrypting API key with format detection');
            
            if (!encryptedApiKey) {
                throw new Error('Encrypted API key cannot be empty');
            }

            const format = this.detectEncryptionFormat(encryptedApiKey);
            
            if (format === 'webcrypto') {
                return await this.decryptWebCrypto(encryptedApiKey);
            } else if (format === 'fernet') {
                this.logger.debug('🔄 Using Fernet fallback for legacy encrypted data');
                return await this.decryptFernetApiKey(encryptedApiKey);
            } else {
                throw new Error('Unknown encryption format detected');
            }
        } catch (error) {
            this.logger.error('❌ Failed to decrypt API key', error);
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    /**
     * Web Crypto API decryption implementation
     */
    private async decryptWebCrypto(encryptedApiKey: string): Promise<string> {
        try {
            // Remove Web Crypto prefix and decode base64
            const base64Data = encryptedApiKey.substring(this.webCryptoPrefix.length);
            const combined = this.base64ToArrayBuffer(base64Data);
            
            // Extract components
            const salt = combined.slice(0, this.saltLength);
            const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
            const encryptedData = combined.slice(this.saltLength + this.ivLength);
            
            // Derive decryption key
            const cryptoKey = await this.deriveKey(this.masterSecret, salt);
            
            // Decrypt the data
            const decryptedData = await crypto.subtle.decrypt(
                {
                    name: this.algorithm,
                    iv: iv
                },
                cryptoKey,
                encryptedData
            );
            
            // Convert back to string
            const decoder = new TextDecoder();
            const result = decoder.decode(decryptedData);
            
            this.logger.debug('✅ API key decrypted successfully with Web Crypto API');
            return result;
        } catch (error) {
            this.logger.error('❌ Web Crypto decryption failed', error);
            throw new Error(`Web Crypto decryption failed: ${error.message}`);
        }
    }

    /**
     * Legacy Fernet decryption for migration support
     */
    private async decryptFernetApiKey(encryptedApiKey: string): Promise<string> {
        try {
            this.logger.debug('🔄 Decrypting with legacy Fernet method');
            const token = new fernet.Token({
                secret: this.legacySecret,
                token: encryptedApiKey,
                ttl: 0 // No expiration check
            });
            const decrypted = token.decode();
            this.logger.debug('✅ Legacy Fernet decryption successful');
            return decrypted;
        } catch (error) {
            this.logger.error('❌ Legacy Fernet decryption failed', error);
            throw new Error(`Legacy decryption failed: ${error.message}`);
        }
    }

    /**
     * Detect encryption format based on content analysis
     */
    private detectEncryptionFormat(encryptedData: string): 'fernet' | 'webcrypto' {
        try {
            // Web Crypto format starts with our custom prefix
            if (encryptedData.startsWith(this.webCryptoPrefix)) {
                return 'webcrypto';
            }
            
            // Fernet format detection:
            // - Base64url encoded (no + or / characters)
            // - Typically 144+ characters
            // - No custom prefix
            if (encryptedData.length >= 100 && 
                !encryptedData.includes('+') && 
                !encryptedData.includes('/') &&
                !encryptedData.startsWith(this.webCryptoPrefix)) {
                return 'fernet';
            }
            
            throw new Error('Unable to detect encryption format');
        } catch (error) {
            this.logger.error('❌ Format detection failed', error);
            throw new Error('Invalid or unrecognized encryption format');
        }
    }

    /**
     * Derive encryption key using PBKDF2 with SHA-256
     */
    private async deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
        try {
            // Import the master secret as key material
            const keyMaterial = await crypto.subtle.importKey(
                'raw',
                new TextEncoder().encode(secret),
                { name: 'PBKDF2' },
                false,
                ['deriveKey']
            );

            // Derive the actual encryption key
            const cryptoKey = await crypto.subtle.deriveKey(
                {
                    name: 'PBKDF2',
                    salt: salt,
                    iterations: this.iterations,
                    hash: 'SHA-256'
                },
                keyMaterial,
                { name: this.algorithm, length: this.keyLength },
                false,
                ['encrypt', 'decrypt']
            );

            return cryptoKey;
        } catch (error) {
            this.logger.error('❌ Key derivation failed', error);
            throw new Error('Key derivation failed');
        }
    }

    /**
     * Convert ArrayBuffer to base64 string
     */
    private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
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

    /**
     * Migration utility: Convert Fernet-encrypted key to Web Crypto format
     */
    async migrateApiKey(fernetEncrypted: string): Promise<string> {
        try {
            this.logger.debug('🔄 Migrating API key from Fernet to Web Crypto');
            
            // Decrypt with Fernet
            const plaintext = await this.decryptFernetApiKey(fernetEncrypted);
            
            // Re-encrypt with Web Crypto API
            const webCryptoEncrypted = await this.encryptApiKey(plaintext);
            
            this.logger.debug('✅ API key migration successful');
            return webCryptoEncrypted;
        } catch (error) {
            this.logger.error('❌ API key migration failed', error);
            throw new Error(`Migration failed: ${error.message}`);
        }
    }

    /**
     * Validate migration by comparing decrypted values
     */
    async validateMigration(originalFernet: string, newWebCrypto: string): Promise<boolean> {
        try {
            // Decrypt both versions
            const fernetDecrypted = await this.decryptFernetApiKey(originalFernet);
            const webCryptoDecrypted = await this.decryptWebCrypto(newWebCrypto);
            
            // Compare plaintext
            const isValid = fernetDecrypted === webCryptoDecrypted;
            
            if (isValid) {
                this.logger.debug('✅ Migration validation successful');
            } else {
                this.logger.error('❌ Migration validation failed: plaintext mismatch');
            }
            
            return isValid;
        } catch (error) {
            this.logger.error('❌ Migration validation error', error);
            return false;
        }
    }

    /**
     * Test encryption/decryption roundtrip for both formats
     */
    async validateEncryptionCompatibility(): Promise<boolean> {
        try {
            this.logger.log('🔍 Validating encryption compatibility');
            const testKey = 'test-api-key-12345';
            
            // Test Web Crypto API roundtrip
            const webCryptoEncrypted = await this.encryptApiKey(testKey);
            const webCryptoDecrypted = await this.decryptApiKey(webCryptoEncrypted);
            const webCryptoValid = webCryptoDecrypted === testKey;
            
            // Test legacy Fernet roundtrip
            const fernetToken = new fernet.Token({
                secret: this.legacySecret,
                token: '',
                ttl: 0
            });
            const fernetEncrypted = fernetToken.encode(testKey);
            const fernetDecrypted = await this.decryptApiKey(fernetEncrypted);
            const fernetValid = fernetDecrypted === testKey;
            
            const overallValid = webCryptoValid && fernetValid;
            
            if (overallValid) {
                this.logger.log('✅ Encryption compatibility validation passed for both formats');
            } else {
                this.logger.error('❌ Encryption compatibility validation failed');
                this.logger.error(`Web Crypto valid: ${webCryptoValid}, Fernet valid: ${fernetValid}`);
            }
            
            return overallValid;
        } catch (error) {
            this.logger.error('❌ Encryption compatibility validation failed', error);
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
            data = '';
        } catch {
            // Ignore errors in clearing
        }
    }

    /**
     * Get encryption service health status
     */
    getHealthStatus() {
        return {
            service: 'encryption',
            algorithm: this.algorithm,
            keyLength: this.keyLength,
            supportedFormats: ['webcrypto', 'fernet'],
            webCryptoReady: !!crypto?.subtle,
            fernetFallbackReady: !!this.legacySecret,
            timestamp: new Date(),
        };
    }
}
