"use client";

import {
    GET_MY_ACTIVE_SUBSCRIPTIONS
} from "@/api/membership/subscription";
import {
    GetMyActiveMembershipSubscriptionsQuery,
    GetMyActiveMembershipSubscriptionsQueryVariables
} from "@/gql/graphql";
import {
    useQuery
} from "@apollo/client";

export const useActiveSubscriptionsQuery = () => {
    // Query to get user's active subscriptions
    const {
        data,
        loading,
        error,
    } = useQuery<
        GetMyActiveMembershipSubscriptionsQuery,
        GetMyActiveMembershipSubscriptionsQueryVariables
    >(GET_MY_ACTIVE_SUBSCRIPTIONS);

    return {
        activeSubscriptions:
            data?.myActiveMembershipSubscriptions || [],
        loading,
        error,
    };
};
