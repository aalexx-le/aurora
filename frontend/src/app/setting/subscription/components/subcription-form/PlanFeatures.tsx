import { Check } from "lucide-react";
import { type PlanFeaturesProps } from "../../types";

export function PlanFeatures({ features }: PlanFeaturesProps) {
  return (
    <div className="space-y-2 flex-grow">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start space-x-2">
          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <span>{feature.feature.type}</span>
        </div>
      ))}
    </div>
  );
} 