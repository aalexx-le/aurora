import { Interval, PaymentProvider } from "@/gql/graphql";
import { z } from "zod";

export const subscriptionFormSchema = z.object({
    planId: z.string().min(1, "Plan is required"),
    // priceId: z.string().min(1, "Price option is required"),
    discountId: z.string().optional(),
    billingInterval: z.nativeEnum(Interval),
    paymentProvider: z.nativeEnum(PaymentProvider),
});

export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;
