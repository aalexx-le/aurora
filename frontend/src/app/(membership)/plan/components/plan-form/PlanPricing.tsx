import { calculateDiscountAmount, useAutomaticDiscount } from "@/app/(membership)/hooks/useAutomaticDiscount";
import { PlanPricingProps } from "@/app/(membership)/types";
import { Badge } from "@/components/ui/badge";
import { DiscountType, Interval } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { Sparkles, Zap } from "lucide-react";
import { useMemo } from 'react';

// Types for better type safety
interface DiscountCalculation {
  manualDiscountAmount: number;
  automaticDiscountAmount: number;
  activeDiscountAmount: number;
  isManualDiscount: boolean;
  hasActiveDiscount: boolean;
}

interface PriceCalculation {
  originalAmount: number;
  discountedAmount: number;
  monthlyDisplayAmount: string;
  discountedMonthlyAmount: string;
}

// Helper functions extracted for better organization
const formatPrice = (amount: number): string => amount.toFixed(2);

const getPromotionalText = (
  discount: any, 
  isManualDiscount: boolean, 
  isYearly: boolean
): string | null => {
  if (!discount || isManualDiscount) return null;
  
  switch (discount.type) {
    case DiscountType.Percentage:
      return discount.description || `${(parseFloat(discount.value) * 100).toFixed(0)}% off`;
    case DiscountType.FixedAmount:
      return `Save $${discount.value} ${isYearly ? 'annually' : 'monthly'}`;
    case DiscountType.FreeTrial:
      return 'Free trial included';
    default:
      return discount.description || 'Special offer';
  }
};

const getBadgeStyles = (isManualDiscount: boolean) => cn(
  "text-xs font-semibold",
  isManualDiscount 
    ? "bg-primary/15 text-primary border-primary/30 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/40" 
    : "bg-green-100 text-green-800 border-green-200 dark:bg-green-800/30 dark:text-green-300 dark:border-green-600/50"
);

// Sub-components for better readability
const ManualDiscountBanner = ({ 
  appliedDiscount, 
  discountAmount 
}: { 
  appliedDiscount: any; 
  discountAmount: number; 
}) => (
  <div className="relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 dark:from-blue-500 dark:to-purple-600 text-white text-center py-3 px-4 rounded-lg shadow-lg">
    <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
    <div className="relative flex items-center justify-center gap-2">
      <Sparkles className="w-4 h-4" />
      <span className="text-sm font-semibold">
        {appliedDiscount?.discount?.code} Applied • Save ${formatPrice(discountAmount)}!
      </span>
      <Sparkles className="w-4 h-4" />
    </div>
  </div>
);

const PriceDisplay = ({ 
  amount, 
  hasDiscount, 
  interval 
}: { 
  amount: string; 
  hasDiscount: boolean; 
  interval: string; 
}) => (
  <div className="flex items-baseline gap-2">
    <span className={cn(
      "text-4xl font-bold tracking-tight",
      hasDiscount ? "text-primary dark:text-green-400" : "text-foreground dark:text-gray-100"
    )}>
      ${amount}
    </span>
    <span className="text-lg text-muted-foreground dark:text-gray-400 font-medium">
      /{interval}
    </span>
  </div>
);

const DiscountBadge = ({ 
  originalPrice, 
  savingsAmount, 
  isManualDiscount,
  interval = ""
}: { 
  originalPrice: string; 
  savingsAmount: string; 
  isManualDiscount: boolean;
  interval?: string;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-lg text-muted-foreground dark:text-gray-400 line-through">
      ${originalPrice}{interval}
    </span>
    <Badge variant="secondary" className={getBadgeStyles(isManualDiscount)}>
      <Zap className="w-3 h-3 mr-1" />
      Save ${savingsAmount}
    </Badge>
  </div>
);

const PromotionalBanner = ({ text }: { text: string }) => (
  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-800/20 dark:to-emerald-800/20 border border-green-200 dark:border-green-600/50 rounded-lg p-3">
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        {text}
      </span>
    </div>
  </div>
);

export function PlanPricing({ price, billingInterval, appliedDiscount }: PlanPricingProps) {
  const isMonthly = billingInterval === Interval.Month;
  const isYearly = billingInterval === Interval.Year;
  
  // Get automatic discount
  const { discount: bestAutomaticDiscount } = useAutomaticDiscount(price.id);
  
  // Memoized calculations for performance
  const discountCalculation = useMemo((): DiscountCalculation => {
    const manualDiscountAmount = appliedDiscount?.isValid && appliedDiscount?.discountAmount 
      ? parseFloat(appliedDiscount.discountAmount) 
      : 0;
    
    const automaticDiscountAmount = calculateDiscountAmount(bestAutomaticDiscount, Number(price.unitPrice.amount));
    
    // Manual discount takes precedence
    const activeDiscountAmount = manualDiscountAmount > 0 ? manualDiscountAmount : automaticDiscountAmount;
    const isManualDiscount = manualDiscountAmount > 0;
    
    return {
      manualDiscountAmount,
      automaticDiscountAmount,
      activeDiscountAmount,
      isManualDiscount,
      hasActiveDiscount: activeDiscountAmount > 0
    };
  }, [appliedDiscount, bestAutomaticDiscount, price.unitPrice.amount]);

  const priceCalculation = useMemo((): PriceCalculation => {
    const originalAmount = Number(price.unitPrice.amount);
    const discountedAmount = Math.max(0, originalAmount - discountCalculation.activeDiscountAmount);
    
    return {
      originalAmount,
      discountedAmount,
      monthlyDisplayAmount: formatPrice(originalAmount),
      discountedMonthlyAmount: formatPrice(discountedAmount / 12)
    };
  }, [price.unitPrice.amount, discountCalculation.activeDiscountAmount]);

  const promotionalText = useMemo(() => 
    getPromotionalText(bestAutomaticDiscount, discountCalculation.isManualDiscount, isYearly),
    [bestAutomaticDiscount, discountCalculation.isManualDiscount, isYearly]
  );

  const { 
    manualDiscountAmount, 
    activeDiscountAmount, 
    isManualDiscount, 
    hasActiveDiscount 
  } = discountCalculation;

  const { 
    originalAmount, 
    discountedAmount, 
    monthlyDisplayAmount, 
    discountedMonthlyAmount 
  } = priceCalculation;

  return (
    <div className="space-y-4">
      {/* Manual Discount Banner */}
      {isManualDiscount && (
        <ManualDiscountBanner 
          appliedDiscount={appliedDiscount}
          discountAmount={manualDiscountAmount}
        />
      )}

      {/* Main Pricing Display */}
      <div className="space-y-3">
        {isMonthly && (
          <div className="space-y-2">
            <PriceDisplay 
              amount={hasActiveDiscount ? formatPrice(discountedAmount) : monthlyDisplayAmount}
              hasDiscount={hasActiveDiscount}
              interval="month"
            />
            
            {hasActiveDiscount && (
              <DiscountBadge
                originalPrice={monthlyDisplayAmount}
                savingsAmount={formatPrice(activeDiscountAmount)}
                isManualDiscount={isManualDiscount}
              />
            )}
          </div>
        )}
        
        {isYearly && (
          <div className="space-y-2">
            <PriceDisplay 
              amount={hasActiveDiscount ? discountedMonthlyAmount : formatPrice(originalAmount / 12)}
              hasDiscount={hasActiveDiscount}
              interval="month"
            />
            
            {hasActiveDiscount && (
              <DiscountBadge
                originalPrice={formatPrice(originalAmount / 12)}
                savingsAmount={formatPrice(activeDiscountAmount / 12)}
                isManualDiscount={isManualDiscount}
                interval="/month"
              />
            )}
            
            {/* Annual Billing Information */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Billed <span className="font-semibold dark:text-gray-200">
                  ${hasActiveDiscount ? formatPrice(discountedAmount) : monthlyDisplayAmount}
                </span> annually
              </p>
            </div>
          </div>
        )}

        {/* Promotional Text for Automatic Discounts */}
        {promotionalText && !isManualDiscount && (
          <PromotionalBanner text={promotionalText} />
        )}
      </div>
    </div>
  );
} 