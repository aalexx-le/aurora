import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EncryptionService {
    constructor(private readonly configService: ConfigService) {}

    async generateEncryptedKey(apiKey: string): Promise<string> {
        try {
            const masterKey = this.configService.get<string>(
                "CRYPTO_PORTFOLIO_MASTER_KEY",
            );
            // Decode the base64-encoded master key
            const keyBytes = Uint8Array.from(Buffer.from(masterKey, "base64"));

            // Generate a random IV (Initialization Vector)
            const iv = crypto.randomBytes(16);

            // Create a Cipher object (using AES-CBC)
            const cipher = crypto.createCipheriv("aes-256-cbc", keyBytes, iv);

            // Encrypt the API key
            let encrypted = cipher.update(apiKey, "utf8", "base64");
            encrypted += cipher.final("base64");

            // Concatenate the IV and encrypted data (in base64)
            const encryptedBase64 = Buffer.concat([
                iv,
                Buffer.from(encrypted, "base64"),
            ]).toString("base64");

            return encryptedBase64;
        } catch (error) {
            // Handle encryption errors appropriately (e.g., logging, throwing an exception)
            console.error("Encryption error:", error);
            throw error;
        }
    }
}
