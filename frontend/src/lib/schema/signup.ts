import { z } from "zod";

export const signupSchema = z
    .object({
        name: z.string().default(""),
        email: z
            .string()
            .min(1, "please enter a valid email")
            .email("Email is not valid")
            .default(""),
        password: z
            .string()
            .min(8, "Password must have more than 8 character")
            .default(""),
        confirmPassword: z.string().default(""),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password doesn't match",
        path: ["confirmPassword"],
    });

export type SignupSchemaType = z.infer<typeof signupSchema>;
