import { PlanFeaturesProps } from "@/app/(membership)/types";
import { Badge } from "@/components/ui/badge";
import { FeatureList } from "@/components/upgrade/FeatureList";
import { useMemo } from "react";

export function PlanFeatures({ features }: PlanFeaturesProps) {
  const featureNames = useMemo(() => {
    if (!features || features.length === 0) {
      return [];
    }
    
    return features
      .map(membershipFeature => membershipFeature.feature?.name)
      .filter((name): name is string => Boolean(name));
  }, [features]);

  // Return null if no features to display
  if (featureNames.length === 0) {
    return (
      <div className="space-y-3 flex-grow">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-muted-foreground dark:text-gray-400">
            Features
          </h4>
          <Badge variant="outline" className="text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300">
            Custom
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground dark:text-gray-400 italic">
          Contact us for custom feature details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 flex-grow">
      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-foreground dark:text-gray-200">
          What&apos;s Included
        </h4>
        <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
          {featureNames.length} feature{featureNames.length > 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-1">
        <FeatureList 
          features={featureNames}
          variant="unlocked"
        />
      </div>
    </div>
  );
} 