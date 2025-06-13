import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FeatureList } from "./FeatureList";
import { UpgradeButton } from "./UpgradeButton";
import { UPGRADE_CONSTANTS } from "@/lib/constants/upgrade";

interface UpgradeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  features: string[];
  currentUsage?: string;
  upgradeText?: string;
  triggerButton?: React.ReactNode;
}

export const UpgradeDialog = ({
  open,
  onOpenChange,
  title,
  description,
  features,
  currentUsage,
  upgradeText = UPGRADE_CONSTANTS.defaultUpgradeText,
  triggerButton
}: UpgradeDialogProps) => {
  const { icons } = UPGRADE_CONSTANTS;
  const CrownIcon = icons.crown;
  const ZapIcon = icons.zap;

  const dialogContent = (
    <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
      <DialogHeader className="text-center space-y-4 pb-2">
        <div className="mx-auto w-16 h-16">
          <div className="relative">
            <div className="absolute inset-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <CrownIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          
          {currentUsage && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground font-medium">
              <ZapIcon className="w-3 h-3 mr-1" />
              {currentUsage}
            </Badge>
          )}
        </div>
        
        <DialogDescription className="text-base text-muted-foreground leading-relaxed">
          {description}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-2">
        <h4 className="text-sm font-semibold text-foreground">
          What&apos;s Included
        </h4>
        <Badge variant="secondary" className="text-xs">
          {features.length} feature{features.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {features.length > 0 && (
        <div className="py-4">
          <FeatureList features={features} variant="unlocked" />
        </div>
      )}

      <DialogFooter className="pt-4 border-t">
        <UpgradeButton upgradeText={upgradeText} />
      </DialogFooter>
    </DialogContent>
  );

  if (triggerButton) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {triggerButton}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  );
}; 