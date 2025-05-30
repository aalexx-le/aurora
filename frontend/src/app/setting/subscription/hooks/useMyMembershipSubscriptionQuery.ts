"use client";

import {
    GET_MY_SUBSCRIPTIONS
} from "@/api/membership/subscription";
import {
    GetMyMembershipSubscriptionsQuery,
    GetMyMembershipSubscriptionsQueryVariables
} from "@/gql/graphql";
import {
    useQuery
} from "@apollo/client";

export const useMyMembershipSubscriptionQuery = () => {
    const { data, loading, error } = useQuery<
        GetMyMembershipSubscriptionsQuery,
        GetMyMembershipSubscriptionsQueryVariables
    >(GET_MY_SUBSCRIPTIONS);
    
    return {
        subscriptions: data?.myMembershipSubscriptions || [],
        loading,
        error,
    };
};
