"use client";

import {
    GET_MY_SUBSCRIPTIONS,
    SUBSCRIPTION_UPDATED,
} from "@/api/membership/subscription";
import {
    GetMyMembershipSubscriptionsQuery,
    GetMyMembershipSubscriptionsQueryVariables,
    OnMembershipSubscriptionUpdatedSubscription,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export const useMyMembershipSubscriptionQuery = () => {
    const { data, loading, error, subscribeToMore } = useQuery<
        GetMyMembershipSubscriptionsQuery,
        GetMyMembershipSubscriptionsQueryVariables
    >(GET_MY_SUBSCRIPTIONS);

    // Subscribe to subscription updates and update the cache
    useEffect(() => {
        const unsubscribe =
            subscribeToMore<OnMembershipSubscriptionUpdatedSubscription>({
                document: SUBSCRIPTION_UPDATED,
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;

                    const updatedSubscription =
                        subscriptionData.data.onMembershipSubscriptionUpdated;

                    // Update the existing subscription in the list or add if new
                    const existingSubscriptions =
                        prev.myMembershipSubscriptions || [];
                    const existingIndex = existingSubscriptions.findIndex(
                        (sub) => sub.id === updatedSubscription.id,
                    );

                    if (existingIndex >= 0) {
                        // Update existing subscription, preserving fields from the original query
                        const updatedSubscriptions = [...existingSubscriptions];
                        updatedSubscriptions[existingIndex] = {
                            ...updatedSubscriptions[existingIndex],
                            ...updatedSubscription,
                            // Preserve the plan and paymentTransactions fields from the original query
                            plan: updatedSubscriptions[existingIndex].plan,
                            paymentTransactions:
                                updatedSubscriptions[existingIndex]
                                    .paymentTransactions,
                        };

                        return {
                            ...prev,
                            myMembershipSubscriptions: updatedSubscriptions,
                        };
                    } else {
                        // For new subscriptions, let Apollo refetch to get complete data with plan and paymentTransactions
                        return prev;
                    }
                },
            });

        return () => unsubscribe();
    }, [subscribeToMore]);

    return {
        subscriptions: data?.myMembershipSubscriptions || [],
        loading,
        error,
    };
};
