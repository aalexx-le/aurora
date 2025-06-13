import { PaymentProvider } from "@/gql/graphql";
import MEMBERSHIP_ROUTE from "@/lib/routes/membership-plan.route";
import { SubscriptionFormData } from "@/lib/schema/subscription";
import { useAppSelector } from "@/state/hooks";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { usePaddleCheckout } from "./payment/paddle/usePaddleCheckout";
import { usePaymentSession } from "./payment/usePaymentSession";
import { usePaymentProvider } from "./usePaymentProvider";
import { useSubscriptionPlans } from "./useSubscriptionPlans";

export interface PaymentData {
    planId: string;
    planName: string;
    amount: number;
    currency: string;
}

export interface CheckoutState {
    isLoading: boolean;
    paymentProvider: PaymentProvider;
    paymentData: PaymentData | null;
}

export function useCheckoutHandler() {
    const { openCheckout: openPaddleCheckout, loading: paddleLoading } =
        usePaddleCheckout();
    const { user } = useAppSelector((state) => state.auth.state);
    const router = useRouter();
    const { getPlanPriceId } = useSubscriptionPlans();
    const { createPaymentSession, loading: sessionCreating } = usePaymentSession();

    const { paymentMethodsLoading, getProviderMethods } = usePaymentProvider();

    const handleCheckout = useCallback(
        async (
            formData: SubscriptionFormData,
        ) => {
            if (!user?.id) {
                throw new Error("User ID not available for checkout.");
            }

            const priceId = getPlanPriceId(formData.planId, formData.billingInterval);

            if (!priceId) {
                throw new Error("Price ID not available for checkout.");
            }

            // Determine which discount to use - manual discount takes precedence
            const discountIdToUse = formData.discountId;

            if (formData.paymentProvider === PaymentProvider.Paddle) {
                const checkoutOptions = {
                    items: [
                        {
                            priceId,
                            quantity: 1,
                        },
                    ],
                    customData: {
                        userId: user.id,
                    },
                    discountId: discountIdToUse,
                };

                const providerMethods = getProviderMethods(
                    formData.paymentProvider,
                );
                const selectedMethod = providerMethods[0];

                if (selectedMethod?.paddlePaymentMethod) {
                    const paddlePaymentMethod =
                        selectedMethod.paddlePaymentMethod;

                    openPaddleCheckout({
                        ...checkoutOptions,
                        customer: {
                            id: paddlePaymentMethod.customerId,
                        },
                    });
                } else {
                    openPaddleCheckout({
                        ...checkoutOptions,
                        customer: {
                            email: user.email,
                        },
                    });
                }
            } else if (formData.paymentProvider === PaymentProvider.Metamask) {
                try {
                    const sessionResult = await createPaymentSession({
                        variables: {
                            data: {
                                planId: formData.planId,
                                priceId,
                                discountId: discountIdToUse,
                            }
                        }
                    });

                    if (!sessionResult.data?.createPaymentSession.sessionId) {
                        throw new Error("Failed to create payment session");
                    }

                    router.push(MEMBERSHIP_ROUTE.payment.metamask.value(sessionResult.data?.createPaymentSession.sessionId));

                } catch (error) {
                    console.error("Failed to create payment session:", error);
                    throw new Error("Failed to initiate secure payment session");
                }
            }
        },
        [user, openPaddleCheckout, getProviderMethods, router, createPaymentSession, getPlanPriceId],
    );

    return {
        handleCheckout,
        loading: paddleLoading || sessionCreating,
        paymentMethodsLoading,
        providerMethods: getProviderMethods(PaymentProvider.Paddle),
    };
}
