import { Button } from "@/components/ui/button";
import { UPGRADE_CONSTANTS } from "@/lib/constants/upgrade";
import MEMBERSHIP_ROUTE from "@/lib/routes/membership-plan.route";
import Link from "next/link";

interface UpgradeButtonProps {
  upgradeText?: string;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showTrial?: boolean;
}

export const UpgradeButton = ({ 
  upgradeText = UPGRADE_CONSTANTS.defaultUpgradeText, 
  size = "lg",
  className = "",
  showTrial = true
}: UpgradeButtonProps) => {
  const { icons } = UPGRADE_CONSTANTS;
  const ZapIcon = icons.zap;
  const ArrowRightIcon = icons.arrowRight;

  return (
    <div className="space-y-3 w-full">
      <Button
        asChild
        size={size}
        className={`w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group ${className}`}
      >
        <Link href={MEMBERSHIP_ROUTE.plan.value} className="flex items-center justify-center gap-2">
          <ZapIcon className="h-4 w-4" />
          {upgradeText}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
      
      {showTrial && (
        <p className="text-xs text-muted-foreground text-center">
          {UPGRADE_CONSTANTS.trialText}
        </p>
      )}
    </div>
  );
}; 