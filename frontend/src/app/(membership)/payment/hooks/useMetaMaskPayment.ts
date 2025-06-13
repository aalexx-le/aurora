import {
    CREATE_METAMASK_PAYMENT_METHOD,
    CREATE_METAMASK_SUBSCRIPTION_FROM_SESSION,
    GET_CRYPTO_PRICE,
} from "@/api/payment/payment";
import {
    CreateMetaMaskPaymentMethodDto,
    CreateMetaMaskPaymentMethodMutation,
    CreateMetaMaskPaymentMethodMutationVariables,
    CreateMetaMaskSubscriptionFromSessionDto,
    CreateMetaMaskSubscriptionFromSessionMutation,
    CreateMetaMaskSubscriptionFromSessionMutationVariables,
    GetCryptoPriceQuery,
    QueryGetCryptoPriceArgs,
} from "@/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback } from "react";

// Hook for creating MetaMask payment method
export function useCreateMetaMaskPaymentMethod() {
    const [createPaymentMethod, { loading, error }] = useMutation<
        CreateMetaMaskPaymentMethodMutation,
        CreateMetaMaskPaymentMethodMutationVariables
    >(CREATE_METAMASK_PAYMENT_METHOD);

    const create = useCallback(
        async (input: CreateMetaMaskPaymentMethodDto) => {
            const result = await createPaymentMethod({
                variables: { input },
            });
            return result.data?.createMetaMaskPaymentMethod;
        },
        [createPaymentMethod],
    );

    return {
        create,
        loading,
        error,
    };
}

// Hook for creating MetaMask subscription from session
export function useCreateMetaMaskSubscriptionFromSession() {
    const [createSubscription, { loading, error }] = useMutation<
        CreateMetaMaskSubscriptionFromSessionMutation,
        CreateMetaMaskSubscriptionFromSessionMutationVariables
    >(CREATE_METAMASK_SUBSCRIPTION_FROM_SESSION);

    const create = useCallback(
        async (input: CreateMetaMaskSubscriptionFromSessionDto) => {
            const result = await createSubscription({
                variables: { input },
            });
            return result.data?.createMetaMaskSubscriptionFromSession;
        },
        [createSubscription],
    );

    return {
        create,
        loading,
        error,
    };
}

// Hook for getting crypto price
export function useGetCryptoPrice(tokenSymbol?: string, usdAmount?: number) {
    const { data, loading, error } = useQuery<
        GetCryptoPriceQuery,
        QueryGetCryptoPriceArgs
    >(GET_CRYPTO_PRICE, {
        variables: {
            tokenSymbol: tokenSymbol || "",
            usdAmount: usdAmount || 0,
        },
        skip: !tokenSymbol || !usdAmount,
    });

    return {
        loading,
        error,
        data: data?.getCryptoPrice,
    };
}