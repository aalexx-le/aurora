import { z } from "zod";

export const createBankTransactionSchema = z.object({
    isTransfer: z.boolean(),
    amount: z.number().refine((value) => value !== 0, {
        message: "Amount must be different from 0",
    }),
    description: z.string().min(0),
    bankId: z.string().min(1, "Bank account is required"),
});

export type CreateBankTransactionInput = z.infer<
    typeof createBankTransactionSchema
>;
