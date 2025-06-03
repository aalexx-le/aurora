import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Sparkles } from "lucide-react";
import Link from "next/link";

interface UpgradeButtonProps {
  variant?: "default" | "outline" | "ghost" | "gradient";
  size?: "sm" | "default" | "lg";
  text?: string;
  showIcon?: boolean;
  className?: string;
}

export const UpgradeButton = ({
  variant = "default",
  size = "default",
  text = "Upgrade to Pro",
  showIcon = true,
  className = "",
}: UpgradeButtonProps) => {
  if (variant === "gradient") {
    return (
      <Button
        asChild
        size={size}
        className={`bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${className}`}
      >
        <Link href="/setting/subscription" className="flex items-center justify-center gap-2 relative z-10">
          {/* Subtle sparkle effect */}
          <Sparkles className="absolute top-1 left-1 h-3 w-3 text-primary-foreground/70 animate-pulse" />
          <Sparkles className="absolute bottom-1 right-1 h-2 w-2 text-primary-foreground/50 animate-pulse delay-500" />
          
          {showIcon && <Crown className="h-4 w-4" />}
          {text}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
    >
      <Link href="/setting/subscription" className="flex items-center justify-center gap-2">
        {showIcon && <Crown className="h-4 w-4" />}
        {text}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </Button>
  );
}; 