"use client";

import {
    GET_MY_ACTIVE_SUBSCRIPTIONS,
    SUBSCRIPTION_UPDATED
} from "@/api/membership/subscription";
import {
    GetMyActiveMembershipSubscriptionsQuery,
    GetMyActiveMembershipSubscriptionsQueryVariables,
    OnMembershipSubscriptionUpdatedSubscription
} from "@/gql/graphql";
import {
    useQuery
} from "@apollo/client";
import { useEffect } from "react";

export const useActiveSubscriptionsQuery = () => {
    // Query to get user's active subscriptions
    const {
        data,
        loading,
        error,
        subscribeToMore,
    } = useQuery<
        GetMyActiveMembershipSubscriptionsQuery,
        GetMyActiveMembershipSubscriptionsQueryVariables
    >(GET_MY_ACTIVE_SUBSCRIPTIONS);

    // Subscribe to subscription updates and update the cache
    useEffect(() => {
        const unsubscribe = subscribeToMore<OnMembershipSubscriptionUpdatedSubscription>({
            document: SUBSCRIPTION_UPDATED,
            updateQuery: (prev, { subscriptionData }) => {
                console.log({subscriptionData})
                if (!subscriptionData.data) return prev;
                
                const updatedSubscription = subscriptionData.data.onMembershipSubscriptionUpdated;
                
                // Update the existing subscription in the list or add if new
                const existingSubscriptions = prev.myActiveMembershipSubscriptions || [];
                const existingIndex = existingSubscriptions.findIndex(
                    sub => sub.id === updatedSubscription.id
                );
                
                if (existingIndex >= 0) {
                   
                }

                 // Update existing subscription
                const updatedSubscriptions = [...existingSubscriptions];
                updatedSubscriptions[existingIndex] = {
                    ...updatedSubscriptions[existingIndex],
                    ...updatedSubscription
                };
                
                // // Filter out inactive subscriptions
                // updatedSubscriptions = updatedSubscriptions.filter(
                //     sub => sub.status === MembershipSubscriptionStatus.Active
                // );
                
                return {
                    ...prev,
                    myActiveMembershipSubscriptions: updatedSubscriptions
                };
            },
        });

        return () => unsubscribe();
    }, [subscribeToMore]);

    return {
        activeSubscriptions:
            data?.myActiveMembershipSubscriptions || [],
        loading,
        error,
    };
};
