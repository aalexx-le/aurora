import { PlanCardProps } from "@/app/(membership)/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Crown, Sparkles } from "lucide-react";
import { PlanActions } from "./PlanActions";
import { PlanFeatures } from "./PlanFeatures";
import { PlanPricing } from "./PlanPricing";

export function PlanCard({
  plan,
  billingInterval,
  subscriptionStatus,
  isSelected,
  onReactivate,
  onSelectPlan,
  loading,
  appliedDiscount,
}: PlanCardProps) {
  const { isCurrentPlan, hasPendingCancellation } = subscriptionStatus;
  
  const price = plan.prices.find(p => p.billingCycle?.interval === billingInterval);
  
  if (!price) return null;

  // Determine if this is a popular/featured plan (e.g., Pro plan or most expensive)
  const isPopular = plan.name.toLowerCase().includes('pro') || 
                   plan.name.toLowerCase().includes('premium') ||
                   plan.name.toLowerCase().includes('plus');

  // Determine visual states
  const isDisabled = loading.checkout && !isSelected;
  const isInteractive = !isCurrentPlan && !isDisabled;
  
  return (
    <div className="relative">
      {/* Popular plan badge */}
      {isPopular && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-400 dark:to-emerald-400 text-white dark:text-gray-900 font-semibold px-3 py-1 shadow-lg"
          >
            <Crown className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      {/* Current plan indicator */}
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge 
            variant="outline" 
            className="bg-background border-border text-muted-foreground dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 font-semibold px-3 py-1 shadow-sm"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Current Plan
          </Badge>
        </div>
      )}

      <Card 
        className={cn(
          "flex flex-col h-full transition-all duration-300 ease-in-out group relative overflow-hidden",
          // Base styles
          "border-2",
          // Interactive states
          isInteractive && [
            "cursor-pointer hover:shadow-lg dark:hover:shadow-2xl",
            isPopular && "border-green-200 hover:border-green-400 dark:border-green-500/50 dark:hover:border-green-400"
          ],
          // Current plan styling - normal theme with disabled appearance
          isCurrentPlan && "border-border bg-muted/50 dark:bg-gray-800/50 dark:border-gray-600 opacity-75",
          // Popular plan styling - enhanced green theme for dark mode
          isPopular && !isCurrentPlan && "border-green-300 bg-gradient-to-br from-green-50/40 to-emerald-50/40 dark:border-green-500/60 dark:bg-gradient-to-br dark:from-green-900/30 dark:to-emerald-900/30",
          // Non-popular plan dark mode enhancement
          !isPopular && !isCurrentPlan && "dark:bg-gray-800/40 dark:border-gray-600 dark:hover:border-gray-500",
          // Disabled state
          isDisabled && "opacity-60 cursor-not-allowed",
          // Pending cancellation - bright warning with dark mode support
          hasPendingCancellation && "border-amber-400 bg-amber-50/50 dark:border-amber-400 dark:bg-amber-900/30"
        )}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        aria-label={isInteractive ? `Select ${plan.name} plan` : undefined}
      >
        {/* Background gradient for popular plans - enhanced dark theme */}
        {isPopular && !isCurrentPlan && (
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/8 to-emerald-500/8 dark:from-green-400/15 dark:to-emerald-400/15 pointer-events-none" />
        )}

        {/* Subtle background enhancement for non-popular cards in dark mode */}
        {!isPopular && !isCurrentPlan && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent dark:from-gray-700/5 dark:to-gray-600/5 pointer-events-none" />
        )}

        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={cn(
                "text-2xl font-bold transition-colors",
                // Current plan - muted colors for disabled appearance
                isCurrentPlan && "text-muted-foreground dark:text-gray-400",
                // Popular plan - enhanced green theme for dark mode
                isPopular && !isCurrentPlan && "text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400",
                // Non-popular plan dark mode enhancement
                !isPopular && !isCurrentPlan && "dark:text-gray-100"
              )}>
                {plan.name}
              </CardTitle>
              {plan.description && (
                <CardDescription className={cn(
                  "mt-2 text-base leading-relaxed",
                  // Current plan - more muted description
                  isCurrentPlan && "text-muted-foreground/80 dark:text-gray-500",
                  // Enhanced readability for dark mode
                  !isCurrentPlan && "dark:text-gray-300"
                )}>
                  {plan.description}
                </CardDescription>
              )}
            </div>
            
            {/* Plan status indicators */}
            <div className="flex flex-col items-end gap-1 ml-4">
              {hasPendingCancellation && (
                <Badge variant="outline" className="text-xs border-amber-400 text-amber-700 dark:border-amber-400 dark:text-amber-300 dark:bg-amber-900/20">
                  Ends Soon
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col gap-6 pt-0">
          {/* Pricing Section */}
          <div className="space-y-1">
            <PlanPricing 
              price={price} 
              billingInterval={billingInterval}
              appliedDiscount={appliedDiscount}
            />
          </div>

          {/* Features Section */}
          <div className="flex-grow">
            <PlanFeatures features={plan.membershipFeatures} />
          </div>

          {/* Action Section */}
          <div className="pt-4 border-t border-border/50 dark:border-gray-600/50">
            <PlanActions
              plan={plan}
              subscriptionStatus={subscriptionStatus}
              onReactivate={onReactivate}
              onSelectPlan={onSelectPlan}
              isSelected={isSelected}
              loading={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 