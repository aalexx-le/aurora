import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { DiscountType, Interval } from "@/gql/graphql";
import { SubscriptionFormData } from "@/lib/schema/subscription";
import { Control } from "react-hook-form";
import { DiscountValidationResult, type MembershipPlan } from "../../../types";
import { useDiscountsForPriceQuery } from "@/app/(membership)/hooks/useDiscount";
import { MembershipDiscount } from "../../types";
interface BillingIntervalToggleProps {
  control: Control<SubscriptionFormData>;
  selectedPlan?: MembershipPlan;
  appliedDiscount?: DiscountValidationResult | null; // Manual discount from discount code
}

// Utility function to calculate discount amount for a price
const calculateDiscountAmount = (
  originalAmount: number,
  discount: MembershipDiscount
): number => {
  if (!discount) return 0;
  
  const discountValue = parseFloat(discount.value);
  switch (discount.type) {
    case DiscountType.Percentage:
      return originalAmount * discountValue;
    case DiscountType.FixedAmount:
      return discountValue;
    default:
      return 0;
  }
};

// Utility function to get the best automatic discount for a price
const getBestAutomaticDiscount = (automaticDiscounts: MembershipDiscount[]) => {
  return automaticDiscounts?.find(discount => 
    discount.isActive && 
    (!discount.endDate || new Date(discount.endDate) > new Date()) &&
    !discount.code // Automatic discounts shouldn't require codes
  );
};

// Enhanced utility function to calculate savings percentage with discounts
const calculateYearlySavingsWithDiscounts = (
  plan?: MembershipPlan,
  appliedDiscount?: DiscountValidationResult | null,
  monthlyAutomaticDiscounts?: MembershipDiscount[],
  yearlyAutomaticDiscounts?: MembershipDiscount[]
): number => {
  if (!plan?.prices || plan.prices.length < 2) return 0;
  
  const monthlyPrice = plan.prices.find(p => p.billingCycle?.interval === Interval.Month);
  const yearlyPrice = plan.prices.find(p => p.billingCycle?.interval === Interval.Year);
  
  if (!monthlyPrice || !yearlyPrice) return 0;
  
  const monthlyAmount = Number(monthlyPrice.unitPrice.amount);
  const yearlyAmount = Number(yearlyPrice.unitPrice.amount);
  
  // Calculate discounted amounts
  let finalMonthlyAmount = monthlyAmount;
  let finalYearlyAmount = yearlyAmount;
  
  // Apply manual discount if available (takes precedence)
  if (appliedDiscount?.isValid && appliedDiscount?.discountAmount) {
    const manualDiscountAmount = parseFloat(appliedDiscount.discountAmount);
    // Apply to both monthly and yearly (assuming the discount applies to the selected interval)
    finalMonthlyAmount = Math.max(0, monthlyAmount - manualDiscountAmount);
    finalYearlyAmount = Math.max(0, yearlyAmount - manualDiscountAmount);
  } else {
    // Apply automatic discounts if no manual discount
    const bestMonthlyDiscount = getBestAutomaticDiscount(monthlyAutomaticDiscounts || []);
    const bestYearlyDiscount = getBestAutomaticDiscount(yearlyAutomaticDiscounts || []);
    
    if (bestMonthlyDiscount) {
      const monthlyDiscountAmount = calculateDiscountAmount(monthlyAmount, bestMonthlyDiscount);
      finalMonthlyAmount = Math.max(0, monthlyAmount - monthlyDiscountAmount);
    }
    
    if (bestYearlyDiscount) {
      const yearlyDiscountAmount = calculateDiscountAmount(yearlyAmount, bestYearlyDiscount);
      finalYearlyAmount = Math.max(0, yearlyAmount - yearlyDiscountAmount);
    }
  }
  
  // Calculate what 12 months would cost at discounted monthly rate
  const annualMonthlyEquivalent = finalMonthlyAmount * 12;
  
  // Calculate savings
  const savings = annualMonthlyEquivalent - finalYearlyAmount;
  const savingsPercentage = annualMonthlyEquivalent > 0 ? (savings / annualMonthlyEquivalent) * 100 : 0;
  
  return Math.round(Math.max(0, savingsPercentage));
};

export function BillingIntervalToggle({ 
  control, 
  selectedPlan,
  appliedDiscount
}: BillingIntervalToggleProps) {
  // Get automatic discounts for both monthly and yearly prices
  const monthlyPrice = selectedPlan?.prices?.find(p => p.billingCycle?.interval === Interval.Month);
  const yearlyPrice = selectedPlan?.prices?.find(p => p.billingCycle?.interval === Interval.Year);
  
  const { data: monthlyAutomaticDiscounts } = useDiscountsForPriceQuery(monthlyPrice?.id || "");
  const { data: yearlyAutomaticDiscounts } = useDiscountsForPriceQuery(yearlyPrice?.id || "");
  
  const savingsPercentage = calculateYearlySavingsWithDiscounts(
    selectedPlan,
    appliedDiscount,
    monthlyAutomaticDiscounts,
    yearlyAutomaticDiscounts
  );
  
  const showSavings = savingsPercentage > 0;
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-bold">Choose Your Plan</h1>
      
      <FormField
        control={control}
        name="billingInterval"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="inline-flex items-center bg-muted rounded-lg p-1 gap-1">
                {/* Monthly Button */}
                <Button
                  type="button"
                  variant={field.value === Interval.Month ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    field.onChange(Interval.Month);
                  }}
                  className="transition-all duration-300"
                >
                  MONTHLY
                </Button>
                
                {/* Yearly Button */}
                <Button
                  type="button"
                  variant={field.value === Interval.Year ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    field.onChange(Interval.Year);
                  }}
                  className="transition-all duration-300"
                >
                  {showSavings ? `YEARLY (SAVE ${savingsPercentage}%)` : 'YEARLY'}
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
} 