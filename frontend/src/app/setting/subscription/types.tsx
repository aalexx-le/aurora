import { GetMembershipPlansQuery, GetMyMembershipSubscriptionsQuery } from "@/gql/graphql";

export type MembershipPlan = GetMembershipPlansQuery['getMembershipPlans'][number]
export type MembershipSubscription = GetMyMembershipSubscriptionsQuery['myMembershipSubscriptions'][number]
export type PaymentTransaction = MembershipSubscription['paymentTransactions'][number]