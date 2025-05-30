import { Interval } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { type PlanPricingProps } from "../../types";

export function PlanPricing({ price, billingInterval }: PlanPricingProps) {
  const isMonthly = billingInterval === Interval.Month;
  const isYearly = billingInterval === Interval.Year;
  const monthlyAmount = Number(price.unitPrice.amount);
  const yearlyMonthlyAmount = (monthlyAmount / 12).toFixed(2);

  return (
    <div className="mb-4">
      {isMonthly && (
        <div className={cn("flex items-end", "opacity-100")}> 
          <span className="text-3xl font-bold">
            ${price.unitPrice.amount}
          </span>
          <span className="text-sm ml-1 mb-1">/month</span>
        </div>
      )}
      
      {isYearly && (
        <div className={cn("flex items-end mt-1", "opacity-100")}> 
          <span className="text-3xl font-bold">
            ${yearlyMonthlyAmount}
          </span>
          <span className="text-sm ml-1 mb-1">/month</span>
        </div>
      )}
    </div>
  );
} 