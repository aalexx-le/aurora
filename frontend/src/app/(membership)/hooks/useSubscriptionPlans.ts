import { GET_MEMBERSHIP_PLANS } from "@/api/membership/plan";
import {
    GetMembershipPlansQuery,
    GetMembershipPlansQueryVariables,
    Interval,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useCallback, useMemo } from "react";

export function useSubscriptionPlans() {
    const { data, loading, error } = useQuery<
        GetMembershipPlansQuery,
        GetMembershipPlansQueryVariables
    >(GET_MEMBERSHIP_PLANS);

    const plans = useMemo(
        () => data?.getMembershipPlans || [],
        [data?.getMembershipPlans],
    );

    const getPlanPriceId = useCallback(
        (planId: string, interval: Interval) => {
            const plan = plans.find((p) => p.id === planId);
            const price = plan?.prices.find(
                (p) => p.billingCycle?.interval === interval,
            );
            return price?.id;
        },
        [plans],
    );

    const getPlanPriceById = useCallback(
        (priceId: string) => {
            for (const plan of plans) {
                for (const price of plan.prices) {
                    if (price.id === priceId) {
                        return price;
                    }
                }
            }
        },
        [plans],
    );

    const getPlanById = useMemo(
        () => (planId: string) => plans.find((p) => p.id === planId),
        [plans],
    );

    return {
        plans,
        loading,
        error,
        getPlanPriceId,
        getPlanPriceById,
        getPlanById,
    };
}
