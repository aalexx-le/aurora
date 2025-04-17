import { z } from "zod";
import { AutoBankManagerThirdParty } from "@/gql/graphql";

export const createBankManagerSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        isAuto: z.boolean(),
        apiKey: z.string().optional(),
        thirdParty: z.nativeEnum(AutoBankManagerThirdParty),
    })
    .refine(
        (data) => {
            return !(data.isAuto && !data.apiKey);
        },
        {
            message: "API key is required for auto bank manager",
            path: ["apiKey"],
        },
    )
    .refine(
        (data) => {
            return !(data.isAuto && !data.thirdParty);
        },
        {
            message: "Third party is required for auto bank manager",
            path: ["thirdParty"],
        },
    );

export type CreateBankManagerInput = z.infer<typeof createBankManagerSchema>;
