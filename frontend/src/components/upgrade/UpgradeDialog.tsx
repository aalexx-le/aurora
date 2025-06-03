import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Check, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description: string;
  features?: string[];
  currentUsage?: string;
  upgradeText?: string;
  triggerButton?: React.ReactNode;
}

export const UpgradeDialog = ({
  open,
  onOpenChange,
  title,
  description,
  features = [],
  currentUsage,
  upgradeText = "Upgrade to Pro",
  triggerButton
}: UpgradeDialogProps) => {
  const dialogContent = (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader className="text-center space-y-4 pb-2">
        <div className="mx-auto w-16 h-16">
          <div className="relative">
            <div className="absolute inset-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          
          {currentUsage && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground font-medium">
              <Zap className="w-3 h-3 mr-1" />
              {currentUsage}
            </Badge>
          )}
        </div>
        
        <DialogDescription className="text-base text-muted-foreground leading-relaxed">
          {description}
        </DialogDescription>
      </DialogHeader>

      {features.length > 0 && (
        <div className="py-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold text-foreground text-sm">
              Unlock Premium Features
            </span>
          </div>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200"
              >
                <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-card-foreground">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <DialogFooter className="flex-col gap-3 pt-4 border-t">
        <Button 
          asChild 
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          <Link href="/setting/subscription" className="flex items-center justify-center gap-2">
            <Crown className="h-4 w-4" />
            {upgradeText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          ✨ 7-day free trial • Cancel anytime • No commitment
        </p>
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