import { z } from "zod";

export enum CEXExchanges {
    BINANCE = "BINANCE",
    MEXC = "MEXC",
}

export const createCryptoPortfolioSchema = z.object({
    apiKey: z.string().min(1, "Please enter your API key"),
    secretKey: z.string().min(1, "Please enter your Secret key"),
    exchanges: z.string().min(1, "Please select an exchange"),
});

export type CreateCryptoPortfolioInput = z.infer<
    typeof createCryptoPortfolioSchema
>;
