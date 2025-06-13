import { GET_PAYMENT_METHODS } from "@/api/payment/payment";
import {
    GetPaymentMethodsQuery,
    GetPaymentMethodsQueryVariables,
    PaymentProvider,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { PaymentMethod } from "../types";

export interface UsePaymentProviderReturn {
    paymentMethodsLoading: boolean;
    getProviderMethods: (provider: PaymentProvider) => PaymentMethod[];
    getAllMethods: () => PaymentMethod[];
}

export function usePaymentProvider(): UsePaymentProviderReturn {
    const { data: paymentMethodsData, loading: paymentMethodsLoading } =
        useQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(
            GET_PAYMENT_METHODS,
        );

    const getProviderMethods = useCallback(
        (provider: PaymentProvider): PaymentMethod[] => {
            if (!paymentMethodsData?.getPaymentMethods) return [];
            return paymentMethodsData.getPaymentMethods.filter(
                (m) => m.provider === provider,
            );
        },
        [paymentMethodsData],
    );

    const getAllMethods = useCallback((): PaymentMethod[] => {
        if (!paymentMethodsData?.getPaymentMethods) return [];
        return paymentMethodsData.getPaymentMethods;
    }, [paymentMethodsData]);

    return {
        paymentMethodsLoading,
        getProviderMethods,
        getAllMethods,
    };
}
