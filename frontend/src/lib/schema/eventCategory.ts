import { z } from "zod";

export const createEventCategorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    color: z.string().min(1, "Color is required"),
  });
  
export type CreateEventCategoryInput = z.infer<typeof createEventCategorySchema>;