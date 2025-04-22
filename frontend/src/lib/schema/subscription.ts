import { z } from "zod";
import { Interval, PaymentProvider } from "@/gql/graphql";

export const subscriptionFormSchema = z.object({
    planId: z.string().min(1, "Plan is required"),
    priceId: z.string().min(1, "Price option is required"),
    billingInterval: z.nativeEnum(Interval),
    paymentProvider: z.nativeEnum(PaymentProvider),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
