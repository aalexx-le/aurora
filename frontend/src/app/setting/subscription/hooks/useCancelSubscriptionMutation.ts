"use client";

import {
    CANCEL_SUBSCRIPTION,
    GET_MY_ACTIVE_SUBSCRIPTIONS
} from "@/api/membership/subscription";
import {
    CancelMembershipSubscriptionMutation,
    CancelMembershipSubscriptionMutationVariables
} from "@/gql/graphql";
import {
    useMutation
} from "@apollo/client";

export const useCancelSubscriptionMutation = () => {
    const [cancelSubscription, { loading }] = useMutation<
        CancelMembershipSubscriptionMutation,
        CancelMembershipSubscriptionMutationVariables
    >(CANCEL_SUBSCRIPTION, {
        awaitRefetchQueries: true,
        refetchQueries: [GET_MY_ACTIVE_SUBSCRIPTIONS],
    });

    // Handler to cancel a subscription
    const handleCancelSubscription = async (id: string) => {
        try {
            await cancelSubscription({
                variables: { id },
            });
        } catch (error) {
            console.error("Error canceling subscription:", error);
        }
    };

    return {
        handleCancelSubscription,
        loading,
    };
};