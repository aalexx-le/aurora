import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UPGRADE_CONSTANTS } from "@/lib/constants/upgrade";
import { FeatureList } from "./FeatureList";
import { UpgradeButton } from "./UpgradeButton";

interface UpgradeComponentProps {
  title: string;
  description: string;
  features?: readonly string[];
  upgradeText?: string;
  currentUsage?: string;
  className?: string;
}

export const FeatureLockedCard = ({
  title,
  description,
  features = [],
  upgradeText = UPGRADE_CONSTANTS.defaultUpgradeText,
  className = "",
}: UpgradeComponentProps) => {
  const CrownIcon = UPGRADE_CONSTANTS.icons.crown;

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="relative text-center pb-4">
        <div className="mx-auto mb-4">
          <CrownIcon className="h-8 w-8 text-yellow-500" />
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground mb-2">
          {title}
        </CardTitle>
        
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <FeatureList features={features} variant="locked" />

        <div className="pt-4 border-t">
          <UpgradeButton upgradeText={upgradeText} />
        </div>
      </CardContent>
    </Card>
  );
}; 