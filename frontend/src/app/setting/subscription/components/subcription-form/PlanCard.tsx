import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type PlanCardProps } from "../../types";
import { PlanActions } from "./PlanActions";
import { PlanFeatures } from "./PlanFeatures";
import { PlanPricing } from "./PlanPricing";

export function PlanCard({
  plan,
  billingInterval,
  subscriptionStatus,
  isSelected,
  onCardClick,
  onReactivate,
  onSelectPlan,
  loading,
}: PlanCardProps) {
  const { isCurrentPlan, hasPendingCancellation } = subscriptionStatus;
  
  const price = plan.prices.find(p => p.billingCycle?.interval === billingInterval);
  
  if (!price) return null;

  const getCardBorderClass = () => {
    if (hasPendingCancellation) return "border-2 border-yellow-500";
    if (isCurrentPlan) return "border-2 border-green-500";
    if (isSelected) return "border-2 border-primary";
    return "";
  };

  return (
    <Card 
      className={cn(
        "flex flex-col h-full cursor-pointer hover:border-primary transition-colors",
        getCardBorderClass()
      )}
      onClick={() => {
        if (!isCurrentPlan) {
          onCardClick();
        }
      }}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        {plan.description && (
          <CardDescription>{plan.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        <PlanPricing 
          price={price} 
          billingInterval={billingInterval} 
        />
        
        <PlanFeatures features={plan.membershipFeatures} />
        
        <PlanActions
          plan={plan}
          subscriptionStatus={subscriptionStatus}
          onReactivate={onReactivate}
          onSelectPlan={onSelectPlan}
          isSelected={isSelected}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
} 