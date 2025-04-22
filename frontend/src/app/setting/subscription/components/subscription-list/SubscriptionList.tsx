'use client';

import { GET_PAYMENT_METHODS } from "@/api/scripts/payment/payment";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables, MembershipSubscription, PaymentProvider } from "@/gql/graphql";
import { useAppSelector } from "@/state/hooks";
import { useQuery } from "@apollo/client";
import { usePaddleCheckout } from "../subcription-form/usePaddleCheckout";
import { SubscriptionCard } from "./SubscriptionCard";
import { useMyMembershipSubscriptionQuery } from "./useMyMembershipSubscriptionQuery";

export function SubscriptionList() {
  const { 
    subscriptions, 
    loading, 
    error, 
    handleCancelSubscription, 
    cancelingId 
  } = useMyMembershipSubscriptionQuery();
  const { openCheckout, loading: paddleLoading } = usePaddleCheckout();
  const { user } = useAppSelector(state => state.auth.state);
  
  // Fetch payment methods to check for existing Paddle customer
  const { data: paymentMethodsData } = useQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(
    GET_PAYMENT_METHODS
  );

  // Get Paddle customer ID if available
  const getPaddleCustomerId = () => {
    if (!paymentMethodsData?.getPaymentMethods) return null;
    
    const paddleMethod = paymentMethodsData.getPaymentMethods.find(
      method => method.provider === PaymentProvider.Paddle && method.paddlePaymentMethod
    );
    
    return paddleMethod?.paddlePaymentMethod?.customerId || null;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-36 w-full rounded-md" />
        <Skeleton className="h-36 w-full rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        Error loading subscriptions: {error.message}
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Subscriptions</CardTitle>
          <CardDescription>
            You don't have any subscriptions yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleUpgradeSubscription = (subscriptionId: string) => {
    if (!user?.id) {
      console.error("User ID not available for checkout.");
      return;
    }
    
    const paddleCustomerId = getPaddleCustomerId();
    
    // Open Paddle checkout for plan upgrade with existing customer ID
    const checkoutOptions = {
      items: [
        {
          priceId: "pri_placeholder", // Replace with actual price ID or use dynamic value
          quantity: 1,
        },
      ],
      customData: {
        userId: user.id,
        subscriptionId: subscriptionId,
        action: 'upgrade'
      }
    };
    
    // Add customer information based on whether we have a stored customer ID
    if (paddleCustomerId) {
      openCheckout({
        ...checkoutOptions,
        customer: {
          id: paddleCustomerId, // Use existing customer ID to reuse payment methods
        },
      });
    } else {
      openCheckout({
        ...checkoutOptions,
        customer: {
          email: user.email, // For new customers, just use email
        },
      });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-3xl">
      {subscriptions.map((subscription) => (
        <SubscriptionCard 
          key={subscription.id}
          subscription={subscription}
          onCancel={handleCancelSubscription}
          onUpgrade={handleUpgradeSubscription}
          cancelingId={cancelingId}
          paddleLoading={paddleLoading}
        />
      ))}
    </div>
  );
} 