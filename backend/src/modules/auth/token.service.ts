import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import Redis from "ioredis";
import { UserWithoutSensitiveFields } from "../../entities/user/user-without-sensitive-fields";
import { TokenPayload } from "./dto/token-payload.dto";

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
                    .get<string>("JWT_AT_EXP_TIME", "1d")
                    .replace("d", "") || "15",
            ) *
            24 *
            60 *
            60;

        this.refreshTokenExpiration =
            parseInt(
                this.configService
                    .get<string>("JWT_RT_EXP_TIME", "30d")
                    .replace("d", "") || "7",
            ) *
            24 *
            60 *
            60;

        this.redis = this.redisService.getOrThrow();

        this.logger.debug(
            `accessTokenExpiration: ${this.accessTokenExpiration}`,
        );
        this.logger.debug(
            `refreshTokenExpiration: ${this.refreshTokenExpiration}`,
        );
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
        const refreshTokenKey = `auth:refresh:${user.id}:${refreshToken}`;
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

            // Get the token prefix which was used when storing the token
            const refreshTokenKey = `refresh:${userId}:${refreshToken}`;

            // Check if the token exists in Redis
            const storedData = await this.redis.get(refreshTokenKey);

            this.logger.debug(`storedData: ${storedData}`);
            if (storedData) {
                const { refreshToken: storedToken } = JSON.parse(
                    storedData,
                ) as { refreshToken: string; userId: number };
                if (storedToken === refreshToken) {
                    return userId;
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
        const tokenPattern = `auth:refresh:${userId}:*`;
        const keys = await this.redis.keys(tokenPattern);
        this.logger.debug(`keys: ${keys}`);
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
        const refreshTokenKey = `refresh:${userId}:${refreshToken}`;

        // Check if the specific token exists and delete it
        const storedData = await this.redis.get(refreshTokenKey);
        if (storedData) {
            const { refreshToken: storedToken } = JSON.parse(storedData) as {
                refreshToken: string;
                userId: number;
            };
            if (storedToken === refreshToken) {
                await this.redis.del(refreshTokenKey);
            }
        }
    }
}
