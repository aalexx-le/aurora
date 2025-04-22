"use client";

import {
    CANCEL_SUBSCRIPTION,
    GET_MY_ACTIVE_SUBSCRIPTIONS,
    GET_MY_SUBSCRIPTIONS,
    SUBSCRIPTION_UPDATED,
} from "@/api/scripts/membership/subscription";
import {
    CancelMembershipSubscriptionMutation,
    CancelMembershipSubscriptionMutationVariables,
    GetMyMembershipSubscriptionsQuery,
    GetMyMembershipSubscriptionsQueryVariables,
    OnMembershipSubscriptionUpdatedSubscription,
} from "@/gql/graphql";
import {
    useApolloClient,
    useMutation,
    useQuery,
    useSubscription,
} from "@apollo/client";
import { useState } from "react";

export const useMyMembershipSubscriptionQuery = () => {
    const [cancelingId, setCancelingId] = useState<string | null>(null);
    const apolloClient = useApolloClient();

    // Query to get all user subscriptions
    const { data, loading, error, refetch } = useQuery<
        GetMyMembershipSubscriptionsQuery,
        GetMyMembershipSubscriptionsQueryVariables
    >(GET_MY_SUBSCRIPTIONS);

    // Mutation to cancel a subscription
    const [cancelSubscription, { loading: cancelLoading }] = useMutation<
        CancelMembershipSubscriptionMutation,
        CancelMembershipSubscriptionMutationVariables
    >(CANCEL_SUBSCRIPTION, {
        onCompleted: () => {
            setCancelingId(null);
            refetch(); // Refresh the subscription list
        },
    });

    // Add subscription for real-time updates
    const { data: subscriptionUpdateData } =
        useSubscription<OnMembershipSubscriptionUpdatedSubscription>(
            SUBSCRIPTION_UPDATED,
            {
                onData: (data) => {
                    apolloClient.refetchQueries({
                        include: [
                            GET_MY_SUBSCRIPTIONS,
                            GET_MY_ACTIVE_SUBSCRIPTIONS,
                        ],
                    });
                },
            },
        );

    // Handler to cancel a subscription
    const handleCancelSubscription = async (id: string) => {
        if (cancelLoading) return;

        try {
            setCancelingId(id);
            await cancelSubscription({
                variables: { id },
            });
        } catch (error) {
            console.error("Error canceling subscription:", error);
            setCancelingId(null);
        }
    };

    // Return subscriptions data and operations
    return {
        subscriptions: data?.myMembershipSubscriptions || [],
        loading,
        error,
        cancelLoading,
        cancelingId,
        handleCancelSubscription,
        refetch,
    };
};
