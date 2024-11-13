import { z } from "zod";

export const createExpenseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    bankTransactionId: z.string().min(1, "Transaction is required"),
    amount: z.coerce.number().min(0, "Amount must be a positive number"),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
