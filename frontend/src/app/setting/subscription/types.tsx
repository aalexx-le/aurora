import {
  GetMembershipPlansQuery,
  GetMyActiveMembershipSubscriptionsQuery,
  GetPaymentMethodsQuery,
  Interval
} from "@/gql/graphql";

// Extract entity types from GraphQL queries (Rule 8)
export type MembershipPlan = GetMembershipPlansQuery['getMembershipPlans'][number];
export type MembershipPrice = MembershipPlan['prices'][number];
export type MembershipFeature = MembershipPlan['membershipFeatures'][number];
export type MembershipSubscription = GetMyActiveMembershipSubscriptionsQuery['myActiveMembershipSubscriptions'][number];
export type PaymentMethod = GetPaymentMethodsQuery['getPaymentMethods'][number];

// Domain-specific interface types (Rule 1)
export interface SubscriptionStatus {
  isCurrentPlan: boolean;
  isExpired: boolean;
  hasPendingCancellation: boolean;
  subscription?: MembershipSubscription;
}

export interface LoadingStates {
  checkout: boolean;
  reactivation: boolean;
}

// Component prop interfaces
export interface PlanCardProps {
  plan: MembershipPlan;
  billingInterval: Interval;
  subscriptionStatus: SubscriptionStatus;
  isSelected: boolean;
  onCardClick: () => void;
  onReactivate: (subscriptionId: string) => void;
  onSelectPlan: () => void;
  loading: LoadingStates;
}

export interface PlanActionsProps {
  plan: MembershipPlan;
  subscriptionStatus: SubscriptionStatus;
  onReactivate: (subscriptionId: string) => void;
  onSelectPlan: () => void;
  isSelected: boolean;
  loading: LoadingStates;
}

export interface PlanPricingProps {
  price: MembershipPrice;
  billingInterval: Interval;
}

export interface PlanFeaturesProps {
  features: MembershipFeature[];
}