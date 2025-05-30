import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { type PlanActionsProps } from "../../types";

export function PlanActions({
  plan,
  subscriptionStatus,
  onReactivate,
  onSelectPlan,
  isSelected,
  loading,
}: PlanActionsProps) {
  const { isCurrentPlan, hasPendingCancellation, subscription } = subscriptionStatus;

  if (hasPendingCancellation) {
    return (
      <Button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onReactivate(subscription!.id);
        }}
        disabled={loading.reactivation}
        className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600"
        variant="default"
      >
        {loading.reactivation ? "Reactivating..." : (
          <>
            <RotateCcw className="w-4 h-4 mr-2" /> 
            Reactivate Subscription
          </>
        )}
      </Button>
    );
  }

  return (
    <Button 
      type="button"
      onClick={(e) => {
        if (!isCurrentPlan) {
          e.stopPropagation();
          onSelectPlan();
        }
      }}
      disabled={loading.checkout || isCurrentPlan}
      className={cn(
        "w-full mt-6", 
        isCurrentPlan && "bg-green-500 hover:bg-green-500"
      )}
      variant="default"
    >
      {loading.checkout && isSelected 
        ? "Loading..." 
        : isCurrentPlan 
          ? "Current Plan" 
          : `Choose ${plan.name}`
      }
    </Button>
  );
} 