'use client';

import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Interval, PaymentProvider } from "@/gql/graphql";
import { SubscriptionFormData, subscriptionFormSchema } from "@/lib/schema/subscription";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useReactivateSubscriptionMutation } from "../../hooks/useReactivateSubscriptionMutation";
import { PaymentProviderSelect } from "../payment-provider-select/PaymentProviderSelect";

// Extracted hooks
import { useCheckoutHandler } from "../../hooks/useCheckoutHandler";
import { useSubscriptionStatus } from "../../hooks/useSubscriptionStatus";

// Extracted components
import { useSubscriptionPlans } from "../../hooks/useSubscriptionPlans";
import { EmptyState, ErrorState, SubscriptionFormSkeleton } from "../skeletons";
import { BillingIntervalToggle } from "./BillingIntervalToggle";
import { PlanCard } from "./PlanCard";

export function SubscriptionForm() {
  // Custom hooks for business logic
  const { plans, loading: plansLoading, error: plansError, getPlanPrice } = useSubscriptionPlans();
  const { getSubscriptionStatus, loading: statusLoading } = useSubscriptionStatus();
  const { handleCheckout, loading: checkoutLoading } = useCheckoutHandler();
  const { loading: reactivationLoading, handleReactivateSubscription } = useReactivateSubscriptionMutation();

  // Form setup
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      planId: "",
      priceId: "",
      billingInterval: Interval.Month,
      paymentProvider: PaymentProvider.Paddle,
    },
  });

  const watchBillingInterval = form.watch("billingInterval");
  const watchPlanId = form.watch("planId");

  // Handle billing interval change
  const handleIntervalChange = useCallback((newInterval: Interval) => {
    const currentPlanId = form.getValues("planId");
    if (currentPlanId) {
      const priceId = getPlanPrice(currentPlanId, newInterval);
      form.setValue("priceId", priceId ?? "");
    }
  }, [form, getPlanPrice]);

  // Handle plan selection
  const handlePlanSelect = useCallback((planId: string) => {
    form.setValue("planId", planId);
    const priceId = getPlanPrice(planId, watchBillingInterval);
    form.setValue("priceId", priceId ?? "");
  }, [form, getPlanPrice, watchBillingInterval]);

  // Handle plan selection and checkout
  const handlePlanSelectAndCheckout = useCallback((planId: string) => {
    handlePlanSelect(planId);
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      const formData = { ...form.getValues(), planId };
      handleCheckout(formData, plan);
    }
  }, [handlePlanSelect, plans, form, handleCheckout]);

  // Loading state
  const isLoading = plansLoading || statusLoading;
  if (isLoading) {
    return <SubscriptionFormSkeleton />;
  }

  // Error state
  if (plansError) {
    return <ErrorState error={plansError} message="Error loading subscription plans" />;
  }

  // Empty state
  if (!plans || plans.length === 0) {
    return <EmptyState message="No subscription plans available" />;
  }

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
        <Form {...form}>
          <form className="space-y-8">
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
            
            {/* Billing Interval Toggle */}
            <BillingIntervalToggle
              control={form.control}
              onIntervalChange={handleIntervalChange}
            />

            {/* Plan Selection */}
            <FormField
              control={form.control}
              name="planId"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        billingInterval={watchBillingInterval}
                        subscriptionStatus={getSubscriptionStatus(plan.id)}
                        isSelected={watchPlanId === plan.id}
                        onCardClick={() => handlePlanSelect(plan.id)}
                        onReactivate={handleReactivateSubscription}
                        onSelectPlan={() => handlePlanSelectAndCheckout(plan.id)}
                        loading={{
                          checkout: checkoutLoading,
                          reactivation: reactivationLoading,
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden price field for validation */}
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