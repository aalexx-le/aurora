import { REACTIVATE_PADDLE_SUBSCRIPTION } from "@/api/membership/subscription";
import { ReactivatePaddleSubscriptionMutation, ReactivatePaddleSubscriptionMutationVariables } from "@/gql/graphql";
import { useMutation } from "@apollo/client";

export const useReactivateSubscriptionMutation = () => {
    const [reactivateSubscription, { loading }] = useMutation<ReactivatePaddleSubscriptionMutation, ReactivatePaddleSubscriptionMutationVariables>(REACTIVATE_PADDLE_SUBSCRIPTION);

    const handleReactivateSubscription = async (subscriptionId: string) => {
        try {
            await reactivateSubscription({
                variables: {
                    id: subscriptionId,
                },
            });
        } catch (error) {
            console.error("Error reactivating subscription:", error);
        }
    };

    return {
        handleReactivateSubscription,
        loading,
    };
};