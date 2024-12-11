import { z } from "zod";

export const createExpenseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    bankTransactionId: z.string().min(1, "Transaction is required"),
    amount: z.coerce.number().gt(0, "Amount must be greater than 0"),
    createdAt: z.date(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
