"use client";

import {
    GET_MY_ACTIVE_SUBSCRIPTIONS,
    GET_MY_SUBSCRIPTIONS,
    REACTIVATE_PADDLE_SUBSCRIPTION,
    SUBSCRIPTION_UPDATED,
} from "@/api/scripts/membership/subscription";
import {
    GetMyActiveMembershipSubscriptionsQuery,
    GetMyActiveMembershipSubscriptionsQueryVariables,
    OnMembershipSubscriptionUpdatedSubscription,
    ReactivatePaddleSubscriptionMutation,
    ReactivatePaddleSubscriptionMutationVariables,
} from "@/gql/graphql";
import {
    useApolloClient,
    useMutation,
    useQuery,
    useSubscription,
} from "@apollo/client";
import { useState } from "react";

export const useActiveSubscriptionsQuery = () => {
    const [reactivatingId, setReactivatingId] = useState<string | null>(null);
    const apolloClient = useApolloClient();

    // Query to get user's active subscriptions
    const {
        data: activeSubscriptionsData,
        loading: activeSubscriptionsLoading,
        refetch: refetchActiveSubscriptions,
        error,
    } = useQuery<
        GetMyActiveMembershipSubscriptionsQuery,
        GetMyActiveMembershipSubscriptionsQueryVariables
    >(GET_MY_ACTIVE_SUBSCRIPTIONS);

    // Add reactivation mutation
    const [reactivateSubscription, { loading: reactivationLoading }] =
        useMutation<
            ReactivatePaddleSubscriptionMutation,
            ReactivatePaddleSubscriptionMutationVariables
        >(REACTIVATE_PADDLE_SUBSCRIPTION, {
            awaitRefetchQueries: true,
            refetchQueries: [GET_MY_ACTIVE_SUBSCRIPTIONS],
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

    // Add a function to handle subscription reactivation
    const handleReactivateSubscription = async (subscriptionId: string) => {
        if (reactivationLoading) return;

        try {
            setReactivatingId(subscriptionId);
            await reactivateSubscription({
                variables: {
                    id: subscriptionId,
                },
            });
        } catch (error) {
            console.error("Error reactivating subscription:", error);
        } finally {
            setReactivatingId(null);
        }
    };

    return {
        activeSubscriptions:
            activeSubscriptionsData?.myActiveMembershipSubscriptions || [],
        loading: activeSubscriptionsLoading,
        error,
        reactivationLoading,
        reactivatingId,
        handleReactivateSubscription,
        refetchActiveSubscriptions,
    };
};
