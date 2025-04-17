import { AuthParams } from "@/lib/constants/params";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

interface TokenData {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    expiresAt?: number;
}

export class Cookie {
    private static readonly ACCESS_TOKEN_KEY = AuthParams.ACCESS_TOKEN;
    private static readonly REFRESH_TOKEN_KEY = AuthParams.REFRESH_TOKEN;
    private static readonly EXPIRES_AT_KEY = AuthParams.EXPIRES_AT;

    /**
     * Save authentication tokens to cookies
     *
     * @param tokens - The token data to save
     */
    static saveTokens(tokens: TokenData): void {
        setCookie(this.ACCESS_TOKEN_KEY, tokens.accessToken);

        if (tokens.refreshToken) {
            setCookie(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
        }

        if (tokens.expiresIn) {
            const expiresAt = Date.now() + tokens.expiresIn * 1000;
            setCookie(this.EXPIRES_AT_KEY, expiresAt.toString());
        }
    }

    /**
     * Get the access token from cookies
     *
     * @returns The access token or null if not found
     */
    static getAccessToken(): string | null {
        return getCookie(this.ACCESS_TOKEN_KEY)?.toString() || null;
    }

    /**
     * Get the refresh token from cookies
     *
     * @returns The refresh token or null if not found
     */
    static getRefreshToken(): string | null {
        return getCookie(this.REFRESH_TOKEN_KEY)?.toString() || null;
    }

    /**
     * Check if the access token is expired
     *
     * @returns True if expired, false otherwise
     */
    static isTokenExpired(): boolean {
        const expiresAt = getCookie(this.EXPIRES_AT_KEY);
        if (!expiresAt) return true;

        return Date.now() > parseInt(expiresAt.toString());
    }

    /**
     * Clear all authentication tokens
     */
    static clearTokens(): void {
        deleteCookie(this.ACCESS_TOKEN_KEY);
        deleteCookie(this.REFRESH_TOKEN_KEY);
        deleteCookie(this.EXPIRES_AT_KEY);
    }
}
