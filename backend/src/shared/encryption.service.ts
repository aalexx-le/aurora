import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

@Injectable()
export class EncryptionService {
    constructor(private readonly configService: ConfigService) {}

    async generateEncryptedKey(apiKey: string): Promise<string> {
        try {
            const masterKey = this.configService.get<string>(
                "CRYPTO_PORTFOLIO_MASTER_KEY",
            );

            // Use Fernet-style encryption
            const key = Buffer.from(masterKey, "base64");
            const fernet = new Fernet(key);

            // Encrypt with current timestamp
            return fernet.encode(apiKey);
        } catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }
}

class Fernet {
    private readonly signingKey: Buffer;
    private readonly encryptionKey: Buffer;

    constructor(key: Buffer) {
        if (key.length !== 32) {
            throw new Error("Fernet key must be 32 bytes");
        }
        this.signingKey = key.subarray(0, 16);
        this.encryptionKey = key.subarray(16, 32);
    }

    encode(message: string): string {
        const version = Buffer.from([0x80]); // Fernet version 128
        const timestamp = Buffer.alloc(8);
        timestamp.writeBigInt64BE(BigInt(Math.floor(Date.now() / 1000)));

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            "aes-128-cbc",
            this.encryptionKey,
            iv,
        );

        const paddedMessage = this.pad(Buffer.from(message, "utf8"));
        const encrypted = Buffer.concat([
            cipher.update(paddedMessage),
            cipher.final(),
        ]);

        const hmac = crypto.createHmac("sha256", this.signingKey);
        hmac.update(Buffer.concat([version, timestamp, iv, encrypted]));
        const digest = hmac.digest();

        const token = Buffer.concat([
            version,
            timestamp,
            iv,
            encrypted,
            digest,
        ]);

        return this.base64urlEncode(token);
    }

    private pad(data: Buffer): Buffer {
        const blockSize = 16;
        const padding = blockSize - (data.length % blockSize);
        const padded = Buffer.alloc(data.length + padding);
        data.copy(padded);
        padded.fill(padding, data.length);
        return padded;
    }

    private base64urlEncode(buffer: Buffer): string {
        return buffer
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
}
