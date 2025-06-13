import {
    GetDiscountsQuery,
    GetMembershipPlansQuery,
    GetMyActiveMembershipSubscriptionsQuery,
    GetPaymentMethodsQuery,
    ValidateDiscountCodeQuery
} from "@/gql/graphql";

export type MembershipPlan = GetMembershipPlansQuery['getMembershipPlans'][number];
export type MembershipPrice = MembershipPlan['prices'][number];
export type MyMembershipSubscription = GetMyActiveMembershipSubscriptionsQuery['myActiveMembershipSubscriptions'][number];

// Discount-related types
export type MembershipDiscount = GetDiscountsQuery['getDiscounts'][number];
export type MembershipDiscountPrice = MembershipDiscount['prices'][number];
export type MembershipDiscountUsage = MembershipDiscount['usageHistory'][number];
export type DiscountValidationResult = NonNullable<ValidateDiscountCodeQuery['validateDiscountCode']>;

export interface BasePaymentData {
    amount: number;
    currency: string;
    plan: MembershipPlan;
    discount?: MembershipDiscount;
    discountCode?: string;
}

export interface MetaMaskPaymentData extends BasePaymentData {
    sessionId: string;
}

export type PaymentMethod = GetPaymentMethodsQuery['getPaymentMethods'][number];
export type PaymentProvider = PaymentMethod['provider'];

export interface SubscriptionStatus {
  isCurrentPlan: boolean;
  isExpired: boolean;
  hasPendingCancellation: boolean;
  subscription?: MyMembershipSubscription;
}

export interface PlanCardProps {
    plan: MembershipPlan;
    billingInterval: string;
    subscriptionStatus: SubscriptionStatus;
    isSelected: boolean;
    onReactivate: (subscriptionId: string) => void;
    onSelectPlan: (planId: string) => void;
    loading: {
        checkout: boolean;
        reactivation: boolean;
    };
    appliedDiscount?: DiscountValidationResult | null;
}

export interface PlanActionsProps {
    plan: MembershipPlan;
    subscriptionStatus: SubscriptionStatus;
    onReactivate: (subscriptionId: string) => void;
    onSelectPlan: (planId: string) => void;
    isSelected: boolean;
    loading: {
        checkout: boolean;
        reactivation: boolean;
    };
}

export interface PlanFeaturesProps {
    features: MembershipPlan['membershipFeatures'];
}

export interface PlanPricingProps {
    price: MembershipPlan['prices'][number];
    billingInterval: string;
    appliedDiscount?: DiscountValidationResult | null;
}

export interface DiscountCodeInputProps {
    onCodeApply: (code: string) => Promise<void>;
    onRemoveDiscount: () => void;
    isLoading?: boolean;
    appliedDiscount?: DiscountValidationResult | null;
    error?: string;
}
