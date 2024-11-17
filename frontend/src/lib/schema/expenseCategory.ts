import { z } from "zod";

export const createExpenseCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    color: z.string().min(1, "Color is required"),
});

export type CreateExpenseCategoryInput = z.infer<
    typeof createExpenseCategorySchema
>;

export const createMonthlyTargetSchema = z.object({
    target: z.number().int().min(1, "Amount must be greater than 0"),
    month: z.number().int().min(1, "Month must be greater than 0"),
    year: z.number().int().min(1, "Year must be greater than 0"),
});

export type CreateMonthlyTargetInput = z.infer<
    typeof createMonthlyTargetSchema
>;
