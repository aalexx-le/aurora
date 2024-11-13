import { z } from "zod";

export const createExpenseCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    color: z.string().min(1, "Color is required"),
});

export type CreateExpenseCategoryInput = z.infer<
    typeof createExpenseCategorySchema
>;
