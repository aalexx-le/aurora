import { GET_MEMBERSHIP_PLANS } from "@/api/membership/membershipPlan";
import {
    GetMembershipPlansQuery,
    GetMembershipPlansQueryVariables,
    Interval
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { type MembershipPlan } from "../types";

export interface UseSubscriptionPlansReturn {
  plans: MembershipPlan[];
  loading: boolean;
  error: Error | undefined;
  getPlanPrice: (planId: string, interval: Interval) => string | undefined;
  getPlanById: (planId: string) => MembershipPlan | undefined;
}

export function useSubscriptionPlans(): UseSubscriptionPlansReturn {
  const { data, loading, error } = useQuery<
    GetMembershipPlansQuery, 
    GetMembershipPlansQueryVariables
  >(GET_MEMBERSHIP_PLANS);

  const plans = useMemo(() => data?.getMembershipPlans || [], [data?.getMembershipPlans]);

  const getPlanPrice = useMemo(() => 
    (planId: string, interval: Interval) => {
      const plan = plans.find(p => p.id === planId);
      const price = plan?.prices.find(p => p.billingCycle?.interval === interval);
      return price?.id;
    }, [plans]
  );

  const getPlanById = useMemo(() => 
    (planId: string) => plans.find(p => p.id === planId), 
    [plans]
  );

  return {
    plans,
    loading,
    error,
    getPlanPrice,
    getPlanById,
  };
}