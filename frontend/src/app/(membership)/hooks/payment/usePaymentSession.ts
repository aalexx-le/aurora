import {
    CREATE_PAYMENT_SESSION,
    GET_PAYMENT_SESSION,
} from "@/api/payment/payment-session";
import type {
    CreatePaymentSessionMutation,
    CreatePaymentSessionMutationVariables,
    GetPaymentSessionQuery,
    GetPaymentSessionQueryVariables,
} from "@/gql/graphql";
import { useMutation, useQuery } from "@apollo/client";

export interface PaymentSessionData {
  planId: string;
  amount: number;
  currency: string;
  planName: string;
  billingInterval: string;
  discountId?: string;
}

export const usePaymentSession = () => {
  const [createPaymentSession, { loading }] = useMutation<
    CreatePaymentSessionMutation,
    CreatePaymentSessionMutationVariables
  >(CREATE_PAYMENT_SESSION);

  return {
    createPaymentSession,
    loading,
  };
};

export const useGetPaymentSession = (sessionId: string | null) => {
  const { data, loading, error, refetch } = useQuery<
    GetPaymentSessionQuery,
    GetPaymentSessionQueryVariables
  >(GET_PAYMENT_SESSION, {
    variables: { data: { sessionId: sessionId || "" } },
    skip: !sessionId,
    errorPolicy: "all",
  });

  return {
    data: data?.getPaymentSession,
    loading,
    error,
    refetch,
  };
}; 