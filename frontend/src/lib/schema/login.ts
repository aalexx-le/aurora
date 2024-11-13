import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "please enter a valid email")
        .email("Email is not valid"),
    password: z.string().min(8, "Password must have more than 8 character"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
