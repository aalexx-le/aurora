import { GET_PAYMENT_METHODS } from "@/api/payment/payment";
import {
    GetPaymentMethodsQuery,
    GetPaymentMethodsQueryVariables,
    PaymentProvider
} from "@/gql/graphql";
import { SubscriptionFormData } from "@/lib/schema/subscription";
import { useAppSelector } from "@/state/hooks";
import { useQuery } from "@apollo/client";
import { useCallback } from "react";
import { usePaddleCheckout } from "../components/subcription-form/usePaddleCheckout";
import { type MembershipPlan, type PaymentMethod } from "../types";

export interface UseCheckoutHandlerReturn {
  handleCheckout: (formData: SubscriptionFormData, selectedPlan: MembershipPlan) => void;
  loading: boolean;
  paymentMethodsLoading: boolean;
  providerMethods: PaymentMethod[];
}

export function useCheckoutHandler(): UseCheckoutHandlerReturn {
  const { openCheckout, loading: paddleLoading } = usePaddleCheckout();
  const { user } = useAppSelector(state => state.auth.state);
  
  const { 
    data: paymentMethodsData, 
    loading: paymentMethodsLoading 
  } = useQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(
    GET_PAYMENT_METHODS
  );

  const getProviderMethods = useCallback((provider: PaymentProvider) => {
    if (!paymentMethodsData?.getPaymentMethods) return [];
    return paymentMethodsData.getPaymentMethods.filter(m => m.provider === provider);
  }, [paymentMethodsData]);

  const handleCheckout = useCallback((
    formData: SubscriptionFormData, 
    selectedPlan: MembershipPlan
  ) => {
    if (!user?.id) {
      console.error("User ID not available for checkout.");
      return;
    }

    const selectedPrice = selectedPlan?.prices.find(
      (p) => p.billingCycle?.interval === formData.billingInterval
    );

    const checkoutOptions = {
      items: [
        {
          priceId: selectedPrice?.id ?? "",
          quantity: 1,
        },
      ],
      customData: {
        userId: user.id,
      },
    };

    if (formData.paymentProvider === PaymentProvider.Paddle) {
      const providerMethods = getProviderMethods(formData.paymentProvider);
      const selectedMethod = providerMethods[0];

      if (selectedMethod?.paddlePaymentMethod) {
        const paddlePaymentMethod = selectedMethod.paddlePaymentMethod;
        
        openCheckout({
          ...checkoutOptions,
          customer: {
            id: paddlePaymentMethod.customerId,
          },
        });
      } else {
        openCheckout({
          ...checkoutOptions,
          customer: {
            email: user.email,
          },
        });
      }
    }
  }, [user, openCheckout, getProviderMethods]);

  return {
    handleCheckout,
    loading: paddleLoading,
    paymentMethodsLoading,
    providerMethods: getProviderMethods(PaymentProvider.Paddle),
  };
} 