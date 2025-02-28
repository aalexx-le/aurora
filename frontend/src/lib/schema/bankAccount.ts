import { z } from "zod";

export const createBankAccountSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    accountName: z.string().min(2, "Account name must be at least 2 characters"),
    accountNumber: z.string().min(5, "Account number must be at least 5 characters"),
    fullName: z.string().min(2, "Bank name must be at least 2 characters"),
    balance: z.number().min(0, "Balance cannot be negative"),
    bankManagerId: z.string(),
});

export type CreateBankAccountInput = z.infer<typeof createBankAccountSchema>;