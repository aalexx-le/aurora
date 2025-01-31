import { z } from "zod";
import { CexExchanges } from "@/gql/graphql";

export const createCryptoPortfolioSchema = z
    .object({
        name: z.string().optional(),
        apiKey: z.string().min(1, "Please enter your API key"),
        secretKey: z.string().min(1, "Please enter your Secret key"),
        exchanges: z.nativeEnum(CexExchanges),
        passphrase: z.string().optional(), // Initially optional
    })
    .refine(
        (data) => {
            if (data.exchanges === CexExchanges.Okx && !data.passphrase) {
                return false;
            }
            return true;
        },
        {
            message: "Passphrase is required for OKX exchange",
            path: ["passphrase"], // Target the passphrase field for the error
        },
    );

export type CreateCryptoPortfolioInput = z.infer<
    typeof createCryptoPortfolioSchema
>;
