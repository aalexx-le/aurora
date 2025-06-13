'use client';

import { useAutomaticDiscount } from "@/app/(membership)/hooks/useAutomaticDiscount";
import { useCheckoutHandler } from "@/app/(membership)/hooks/useCheckoutHandler";
import { useDiscountValidation } from "@/app/(membership)/hooks/useDiscountValidation";
import { useSubscriptionPlans } from "@/app/(membership)/hooks/useSubscriptionPlans";
import { useSubscriptionStatus } from "@/app/(membership)/hooks/useSubscriptionStatus";
import { PaymentProviderSelect } from "@/app/(membership)/plan/components/payment-provider-select/PaymentProviderSelect";
import { EmptyState, ErrorState, SubscriptionFormSkeleton } from "@/app/(membership)/plan/components/skeletons";
import { useReactivateSubscriptionMutation } from "@/app/setting/subscription/hooks/useReactivateSubscriptionMutation";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Interval, PaymentProvider } from "@/gql/graphql";
import AUTH_ROUTE from "@/lib/routes/auth.route";
import { SubscriptionFormData, subscriptionFormSchema } from "@/lib/schema/subscription";
import { useAppSelector } from "@/state/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BillingIntervalToggle } from "./BillingIntervalToggle";
import { DiscountCodeInput } from "./DiscountCodeInput";
import { PlanCard } from "./PlanCard";

export function PlanForm() {
  const router = useRouter();
  const { state: { user }, loading: authLoading } = useAppSelector(state => state.auth);
  const { plans, loading: plansLoading, error: plansError, getPlanPriceId } = useSubscriptionPlans();

  const { getSubscriptionStatus, loading: statusLoading } = useSubscriptionStatus();
  
  const { 
    handleCheckout, 
    loading: checkoutLoading
  } = useCheckoutHandler();

  const { loading: reactivationLoading, handleReactivateSubscription } = useReactivateSubscriptionMutation();
  
  const {
    validateDiscount,
    clearDiscount,
    loading: discountLoading,
    error: discountError,
    appliedDiscount,
  } = useDiscountValidation();

  // Form setup
  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      planId: "",
      billingInterval: Interval.Month,
      paymentProvider: PaymentProvider.Metamask,
      discountId: "",
    },
  });

  useEffect(() => {
    if (plans.length > 0) {
      form.setValue("planId", plans[0].id);
    }
  }, [plans]);

  const watchBillingInterval = form.watch("billingInterval");
  const watchPlanId = form.watch("planId");

  // Get the currently selected plan for calculating savings
  const selectedPlan = watchPlanId ? plans.find(p => p.id === watchPlanId) : plans[0];

  // Get automatic discount for the currently selected price
  const currentPriceId = useMemo(() => {
    if (!watchPlanId || !watchBillingInterval) return "";
    return getPlanPriceId(watchPlanId, watchBillingInterval) || "";
  }, [watchPlanId, watchBillingInterval, getPlanPriceId]);

  const { discount: automaticDiscount } = useAutomaticDiscount(currentPriceId);

  // Handle discount code application
  const handleDiscountApply = useCallback(async (code: string) => {
    // Get current plan and price information
    const currentPlanId = form.getValues("planId");
    const currentBillingInterval = form.getValues("billingInterval");
    
    if (!currentPlanId || !currentBillingInterval) {
      // Show error via the hook's error handling
      return;
    }

    const selectedPriceId = getPlanPriceId(currentPlanId, currentBillingInterval);
    
    if (!selectedPriceId) {
      return;
    }

    const result = await validateDiscount({
      code,
      priceId: selectedPriceId,
    });

    if (result?.discount?.id) {
      form.setValue("discountId", result.discount.id);
    }
  }, [validateDiscount, form, getPlanPriceId]);

  // Handle discount removal
  const handleDiscountRemove = useCallback(() => {
    clearDiscount();
    form.setValue("discountId", "");
  }, [clearDiscount, form]);

  // Handle plan selection and checkout
  const handlePlanSelectAndCheckout = useCallback((planId: string) => {
    if (authLoading) {
      return;
    }

    if (!user) {
      router.push(AUTH_ROUTE.value);
      return;
    }

    // Set the plan ID directly without clearing the discount
    form.setValue("planId", planId);

    const formData = form.getValues();
    
    // If no manual discount is applied, use automatic discount if available
    if (!formData.discountId && automaticDiscount?.id) {
      formData.discountId = automaticDiscount.id;
    }
    handleCheckout(formData);
  }, [handleCheckout, form, authLoading, user, router, automaticDiscount]);

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
                <FormItem className="flex justify-center">
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
              selectedPlan={selectedPlan}
              appliedDiscount={appliedDiscount}
            />

            {/* Discount Code Input */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <DiscountCodeInput
                  onCodeApply={handleDiscountApply}
                  onRemoveDiscount={handleDiscountRemove}
                  isLoading={discountLoading}
                  appliedDiscount={appliedDiscount}
                  error={discountError}
                />
              </div>
            </div>

            {/* Plan Selection */}
            <FormField
              control={form.control}
              name="planId"
              render={() => (
                <FormItem>
                  <div className="flex flex-col md:flex-row gap-6 justify-center">
                    {plans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        billingInterval={watchBillingInterval}
                        subscriptionStatus={getSubscriptionStatus(plan.id)}
                        isSelected={watchPlanId === plan.id}
                        onReactivate={handleReactivateSubscription}
                        onSelectPlan={handlePlanSelectAndCheckout}
                        loading={{
                          checkout: checkoutLoading,
                          reactivation: reactivationLoading,
                        }}
                        appliedDiscount={appliedDiscount}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Hidden fields for validation */}
            {/* <FormField
              control={form.control}
              name="priceId"
              render={() => <FormItem className="hidden"><FormMessage /></FormItem>}
            />
            <FormField
              control={form.control}
              name="discountCode"
              render={() => <FormItem className="hidden"><FormMessage /></FormItem>}
            /> */}
          </form>
        </Form>
      </div>
    </div>
  );
} 