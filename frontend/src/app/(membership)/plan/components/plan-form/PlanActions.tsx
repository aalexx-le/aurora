import { PlanActionsProps } from "@/app/(membership)/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Crown, Loader2, RotateCcw } from "lucide-react";

export function PlanActions({
  plan,
  subscriptionStatus,
  onReactivate,
  onSelectPlan,
  isSelected,
  loading,
}: PlanActionsProps) {
  const { isCurrentPlan, hasPendingCancellation, subscription } = subscriptionStatus;
  
  // Determine if this is a popular/featured plan
  const isPopular = plan.name.toLowerCase().includes('pro') || 
                   plan.name.toLowerCase().includes('premium') ||
                   plan.name.toLowerCase().includes('plus');

  // Handle reactivation scenario
  if (hasPendingCancellation) {
    return (
      <Button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onReactivate(subscription!.id);
        }}
        disabled={loading.reactivation}
        className={cn(
          "w-full transition-all duration-200",
          "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600",
          "dark:from-yellow-400 dark:to-amber-400 dark:hover:from-yellow-500 dark:hover:to-amber-500",
          "text-white dark:text-gray-900 font-semibold shadow-lg hover:shadow-xl",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        size="lg"
      >
        {loading.reactivation ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Reactivating...
          </>
        ) : (
          <>
            <RotateCcw className="w-4 h-4 mr-2" /> 
            Reactivate Plan
          </>
        )}
      </Button>
    );
  }

  // Handle current plan display - enhanced theme with better dark mode
  if (isCurrentPlan) {
    return (
      <Button 
        type="button"
        disabled
        className={cn(
          "w-full transition-all duration-200",
          "bg-muted text-muted-foreground dark:bg-gray-700 dark:text-gray-300",
          "font-semibold cursor-default",
          "opacity-75 dark:opacity-80"
        )}
        size="lg"
      >
        <Check className="w-4 h-4 mr-2" />
        Current Plan
      </Button>
    );
  }

  // Handle plan selection
  const isLoading = loading.checkout && isSelected;
  const isDisabled = loading.checkout && !isSelected;

  return (
    <Button 
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onSelectPlan(plan.id);
      }}
      disabled={loading.checkout}
      className={cn(
        "w-full transition-all duration-200 font-semibold",
        // Popular plan styling - enhanced green theme for dark mode
        isPopular && [
          "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
          "dark:from-green-400 dark:to-emerald-400 dark:hover:from-green-500 dark:hover:to-emerald-500",
          "text-white dark:text-gray-900 shadow-lg hover:shadow-xl",
          "ring-2 ring-green-400/20 hover:ring-green-400/40 dark:ring-green-400/30 dark:hover:ring-green-400/50"
        ],
        // Default state (not popular, not selected) - enhanced for dark mode
        !isPopular && [
          "bg-primary hover:bg-primary/90 dark:bg-gray-100 dark:hover:bg-gray-200",
          "text-primary-foreground dark:text-gray-900",
          "hover:shadow-md dark:shadow-lg dark:hover:shadow-xl"
        ],
        // Disabled state
        isDisabled && "opacity-50 cursor-not-allowed",
        // Loading state
        isLoading && "cursor-wait"
      )}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Getting Started...
        </>
      ) : (
        <>
          {isPopular && <Crown className="w-4 h-4 mr-2" />}
          {`Choose ${plan.name}`}
        </>
      )}
    </Button>
  );
} 