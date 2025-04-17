import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import { User } from "src/entities/user";
import { TokenPayload } from "./dto/token-payload.dto";
import { LoginReqDto } from "./dto/login.dto";
import { UserWithoutSensitiveFields } from "../../entities/user/user-without-sensitive-fields";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

@Injectable()
export class TokenService {
    private readonly logger = new Logger(TokenService.name);
    private readonly redis: Redis;
    private readonly accessTokenExpiration: number;
    private readonly refreshTokenExpiration: number;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
    ) {
        this.accessTokenExpiration =
            parseInt(
                this.configService
                    .get<string>("JWT_AT_EXP_TIME", "15m")
                    .replace("m", "") || "15",
            ) * 60;

        this.refreshTokenExpiration =
            parseInt(
                this.configService
                    .get<string>("JWT_RT_EXP_TIME", "7d")
                    .replace("d", "") || "7",
            ) *
            24 *
            60 *
            60;

        this.redis = this.redisService.getOrThrow();
    }

    /**
     * Generate a pair of tokens for a user
     *
     * @param user - The user to generate tokens for
     * @returns An object containing access and refresh tokens
     */
    async generateTokenPair(
        user: UserWithoutSensitiveFields,
    ): Promise<TokenPair> {
        const payload: Omit<TokenPayload, "iat" | "exp"> = {
            userId: user.id,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get("JWT_AT_EXP_TIME"),
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get("JWT_RT_EXP_TIME"),
        });

        // Store refresh token in Redis
        const refreshTokenKey = `refresh:${user.id}:${refreshToken.substring(0, 20)}`;
        await this.redis.set(
            refreshTokenKey,
            JSON.stringify({ refreshToken, userId: user.id }),
            "EX",
            this.refreshTokenExpiration,
        );

        return {
            accessToken,
            refreshToken,
            expiresIn: this.accessTokenExpiration,
        };
    }

    /**
     * Validate a refresh token
     *
     * @param refreshToken - The refresh token to validate
     * @returns The user ID associated with the token
     * @throws UnauthorizedException if the token is invalid
     */
    async validateRefreshToken(refreshToken: string): Promise<number> {
        try {
            // Verify the token
            const payload = this.jwtService.verify<TokenPayload>(refreshToken);
            const userId = payload.userId;

            // Check if the token exists in Redis
            const tokenPattern = `refresh:${userId}:*`;
            const keys = await this.redis.keys(tokenPattern);

            for (const key of keys) {
                const storedData = await this.redis.get(key);
                if (storedData) {
                    const { refreshToken: storedToken } = JSON.parse(
                        storedData,
                    ) as { refreshToken: string; userId: number };
                    if (storedToken === refreshToken) {
                        return userId;
                    }
                }
            }

            throw new UnauthorizedException("Invalid refresh token");
        } catch (error) {
            this.logger.error(
                `Failed to validate refresh token: ${error.message}`,
            );
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    /**
     * Revoke all refresh tokens for a user
     *
     * @param userId - The user ID to revoke tokens for
     */
    async revokeAllUserTokens(userId: number): Promise<void> {
        const tokenPattern = `refresh:${userId}:*`;
        const keys = await this.redis.keys(tokenPattern);

        if (keys.length > 0) {
            await this.redis.del(...keys);
        }
    }

    /**
     * Revoke a specific refresh token
     *
     * @param userId - The user ID
     * @param refreshToken - The refresh token to revoke
     */
    async revokeRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<void> {
        const tokenPattern = `refresh:${userId}:*`;
        const keys = await this.redis.keys(tokenPattern);

        for (const key of keys) {
            const storedData = await this.redis.get(key);
            if (storedData) {
                const { refreshToken: storedToken } = JSON.parse(
                    storedData,
                ) as { refreshToken: string; userId: number };
                if (storedToken === refreshToken) {
                    await this.redis.del(key);
                    break;
                }
            }
        }
    }
}
