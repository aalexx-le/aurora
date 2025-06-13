import { Exchanges } from "@/gql/graphql";
import { isPassphraseRequired } from "@/lib/constants/crypto-exchanges";
import { z } from "zod";

export const createCryptoPortfolioSchema = z
    .object({
        name: z.string().optional(),
        apiKey: z.string().min(1, "Please enter your API key"),
        secretKey: z.string().min(1, "Please enter your Secret key"),
        exchanges: z.nativeEnum(Exchanges),
        passphrase: z.string().optional(), // Initially optional
    })
    .refine(
        (data) => {
            if (isPassphraseRequired(data.exchanges) && !data.passphrase) {
                return false;
            }
            return true;
        },
        {
            message: "Passphrase is required for this exchange",
            path: ["passphrase"], // Target the passphrase field for the error
        },
    );

export type CreateCryptoPortfolioInput = z.infer<
    typeof createCryptoPortfolioSchema
>;
