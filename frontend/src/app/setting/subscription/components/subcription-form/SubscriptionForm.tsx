'use client';

import { GET_MEMBERSHIP_PLANS } from "@/api/scripts/membership/membershipPlan";
import { GET_PAYMENT_METHODS } from "@/api/scripts/payment/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { GetMembershipPlansQuery, GetMembershipPlansQueryVariables, GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables, Interval, MembershipSubscriptionStatus, PaymentProvider } from "@/gql/graphql";
import { SubscriptionFormData, subscriptionFormSchema } from "@/lib/schema/subscription";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/state/hooks";
import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, RotateCcw } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { PaymentProviderSelect } from "../payment-provider-select/PaymentProviderSelect";
import { useActiveSubscriptionsQuery } from "./useActiveSubscriptionsQuery";
import { usePaddleCheckout } from "./usePaddleCheckout";

export function SubscriptionForm() {
  const { openCheckout, loading: paddleLoading } = usePaddleCheckout();
  const { data, loading: plansLoading, error } = useQuery<GetMembershipPlansQuery, GetMembershipPlansQueryVariables>(GET_MEMBERSHIP_PLANS);
  const { user } = useAppSelector(state => state.auth.state);
  const { data: paymentMethodsData, loading: paymentMethodsLoading } = useQuery<GetPaymentMethodsQuery, GetPaymentMethodsQueryVariables>(GET_PAYMENT_METHODS);
  
  // Use the new hook for active subscriptions
  const { 
    activeSubscriptions, 
    loading: activeSubscriptionsLoading, 
    reactivationLoading, 
    reactivatingId,
    handleReactivateSubscription 
  } = useActiveSubscriptionsQuery();

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      planId: "",
      priceId: "",
      billingInterval: Interval.Month,
      paymentProvider: PaymentProvider.Paddle,
    },
  });

  const watchBillingInterval: Interval = form.watch("billingInterval");
  const watchPaymentProvider: PaymentProvider = form.watch("paymentProvider");

  // Filter payment methods for selected provider
  const providerMethods = React.useMemo(() => {
    if (!paymentMethodsData?.getPaymentMethods) return [];
    return paymentMethodsData.getPaymentMethods.filter(m => m.provider === watchPaymentProvider);
  }, [paymentMethodsData, watchPaymentProvider]);

  const handleSubmit = (formData: SubscriptionFormData) => {
    if (!user?.id) {
      console.error("User ID not available for checkout.");
      return;
    }

    // Find the selected plan
    const selectedPlan = data?.getMembershipPlans.find(
      (plan) => plan.id === formData.planId
    );

    const selectedPrice = selectedPlan?.prices.find(p => p.id === formData.priceId);

    // Set up checkout options with basic details
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
      // TODO: Consider to use the first payment method for the selected provider
      const selectedMethod = providerMethods[0];

      if (selectedMethod?.paddlePaymentMethod) {
        const paddlePaymentMethod = selectedMethod.paddlePaymentMethod;
        
        openCheckout({
          ...checkoutOptions,
          customer: {
            id: paddlePaymentMethod.customerId, // Use the saved customer ID to reuse payment methods
          },
        });
      } else {
        // New customer: use openCheckout with email
        openCheckout({
          ...checkoutOptions,
          customer: {
            email: user.email,
          },
        });
      }
    }
  };

  if (plansLoading || paymentMethodsLoading || activeSubscriptionsLoading) {
    return <div>Loading plans...</div>;
  }

  if (error) {
    return <div>Error loading plans: {error.message}</div>;
  }

  if (!data?.getMembershipPlans || data.getMembershipPlans.length === 0) {
    return <div>No subscription plans available.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Payment Provider Select */}
            <FormField
              control={form.control}
              name="paymentProvider"
              render={({ field }) => (
                <FormItem>
                  <PaymentProviderSelect
                    selectedProvider={field.value}
                    setSelectedProvider={(provider) => field.onChange(provider)}
                  />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <h1 className="text-3xl font-bold">Choose Your Plan</h1>
              
              <FormField
                control={form.control}
                name="billingInterval"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <span className={cn("text-base", field.value === Interval.Month ? "font-semibold" : "text-muted-foreground")}> 
                        Monthly
                      </span>
                      <FormControl>
                        <Switch
                          checked={field.value === Interval.Year}
                          onCheckedChange={(checked) => {
                            const newInterval = checked ? Interval.Year : Interval.Month;
                            field.onChange(newInterval);
                            // Update price selection when billing interval changes
                            const currentPlanId = form.getValues("planId");
                            const plan = data?.getMembershipPlans.find(p => p.id === currentPlanId);
                            const price = plan?.prices.find(p => p.billingCycle?.interval === newInterval);
                            form.setValue("priceId", price?.id ?? "");
                          }}
                        />
                      </FormControl>
                      <span className={cn("text-base", field.value === Interval.Year ? "font-semibold" : "text-muted-foreground")}> 
                        Yearly
                      </span>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="planId"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data?.getMembershipPlans.map((plan) => {

                      const price = plan.prices.find(p => p.billingCycle?.interval === watchBillingInterval);
                      const isMonthly = watchBillingInterval === Interval.Month;
                      const isYearly = watchBillingInterval === Interval.Year;
                      
                      if (!price) return null;
                      
                      // Check if this is the user's current plan
                      const userSubscription = activeSubscriptions?.find(
                        sub => sub.planId === plan.id
                      );
                      const isCurrentPlan = !!userSubscription;
                      const isExpired = userSubscription?.endDate && new Date(userSubscription?.endDate) < new Date();
                      const hasPendingCancellation = isCurrentPlan && userSubscription?.status === MembershipSubscriptionStatus.Canceled && !isExpired;

                      return (
                        <Card 
                          key={plan.id} 
                          className={cn(
                            "flex flex-col h-full cursor-pointer hover:border-primary transition-colors",
                            field.value === plan.id && "border-2 border-primary",
                            isCurrentPlan && "border-2 border-green-500",
                            hasPendingCancellation && "border-2 border-yellow-500"
                          )}
                          onClick={() => {
                            if (!isCurrentPlan) {
                              field.onChange(plan.id);
                              form.setValue("priceId", price.id);
                            }
                          }}
                        >
                          <CardHeader>
                            <CardTitle className="text-2xl">{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow flex flex-col">
                            <div className="mb-4">
                              {isMonthly && (
                                <div className={cn("flex items-end", watchBillingInterval === Interval.Month ? "opacity-100" : "opacity-60")}> 
                                  <span className="text-3xl font-bold">
                                    ${price.unitPrice.amount}
                                  </span>
                                  <span className="text-sm ml-1 mb-1">/month</span>
                                </div>
                              )}
                              
                              {isYearly && (
                                <div className={cn("flex items-end mt-1", watchBillingInterval === Interval.Year ? "opacity-100" : "opacity-60")}> 
                                  <span className="text-3xl font-bold">
                                    ${(Number(price.unitPrice.amount) / 12).toFixed(2)}
                                  </span>
                                  <span className="text-sm ml-1 mb-1">/month</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2 flex-grow">
                              {plan.membershipFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span>{feature.feature.type}</span>
                                </div>
                              ))}
                            </div>
                            
                            {hasPendingCancellation ? (
                              <Button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click
                                  handleReactivateSubscription(userSubscription.id);
                                }}
                                disabled={reactivationLoading || reactivatingId === userSubscription.id}
                                className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600"
                                variant="default"
                              >
                                {(reactivationLoading || reactivatingId === userSubscription.id) ? "Reactivating..." : <>
                                  <RotateCcw className="w-4 h-4 mr-2" /> Reactivate Subscription
                                </>}
                              </Button>
                            ) : (
                              <Button 
                                type="button"
                                onClick={(e) => {
                                  if (!isCurrentPlan) {
                                    e.stopPropagation(); // Prevent card click
                                    field.onChange(plan.id);
                                    form.setValue("priceId", price.id);
                                    handleSubmit(form.getValues());
                                  }
                                }}
                                disabled={paddleLoading || isCurrentPlan}
                                className={cn("w-full mt-6", isCurrentPlan && "bg-green-500 hover:bg-green-500")}
                                variant="default"
                              >
                                {paddleLoading && field.value === plan.id ? "Loading..." : isCurrentPlan ? "Current Plan" : `Choose ${plan.name}`}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceId"
              render={() => <FormItem className="hidden"><FormMessage /></FormItem>}
            />
          </form>
        </Form>
      </div>
    </div>
  );
} 