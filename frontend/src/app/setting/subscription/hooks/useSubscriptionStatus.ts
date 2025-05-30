import { MembershipSubscriptionStatus } from "@/gql/graphql";
import { useMemo } from "react";
import { type MembershipSubscription, type SubscriptionStatus } from "../types";
import { useActiveSubscriptionsQuery } from "./useActiveSubscriptionsQuery";

export interface UseSubscriptionStatusReturn {
  activeSubscriptions: MembershipSubscription[];
  loading: boolean;
  getSubscriptionStatus: (planId: string) => SubscriptionStatus;
}

export function useSubscriptionStatus(): UseSubscriptionStatusReturn {
  const { 
    activeSubscriptions, 
    loading 
  } = useActiveSubscriptionsQuery();

  const getSubscriptionStatus = useMemo(() => 
    (planId: string): SubscriptionStatus => {
      const userSubscription = activeSubscriptions?.find(
        sub => sub.planId === planId
      );
      
      const isCurrentPlan = !!userSubscription;
      const isExpired = userSubscription?.endDate && 
        new Date(userSubscription.endDate) < new Date();
      const hasPendingCancellation = isCurrentPlan && 
        userSubscription?.status === MembershipSubscriptionStatus.Canceled && 
        !isExpired;

      return {
        isCurrentPlan,
        isExpired,
        hasPendingCancellation,
        subscription: userSubscription,
      };
    }, 
    [activeSubscriptions]
  );

  return {
    activeSubscriptions: activeSubscriptions || [],
    loading,
    getSubscriptionStatus,
  };
} 