import { z } from "zod";

export const createCryptoPortfolioSchema = z.object({
    apiKey: z.string().min(1, "Please enter your API key"),
    secretKey: z.string().min(1, "Please enter your Secret key"),
});

export type CreateCryptoPortfolioInput = z.infer<
    typeof createCryptoPortfolioSchema
>;
