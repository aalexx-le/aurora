import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Crown, Lock, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

interface FeatureLockedCardProps {
  title: string;
  description: string;
  features?: string[];
  upgradeText?: string;
  className?: string;
}

export const FeatureLockedCard = ({
  title,
  description,
  features = [],
  upgradeText = "Upgrade to Pro",
  className = "",
}: FeatureLockedCardProps) => {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardHeader className="relative text-center pb-4">
        <div className="mx-auto w-20 h-20 mb-6">
          <div className="relative">
            <div className="absolute inset-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>
        
        <CardTitle className="text-2xl font-bold text-foreground mb-2">
          {title}
        </CardTitle>
        
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {features.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-foreground text-sm">
                Premium Features Awaiting
              </span>
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </div>
            
            <div className="grid gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors duration-200 group"
                >
                  <div className="flex-shrink-0 relative">
                    <Lock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <span className="text-sm font-medium text-card-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <Button
            asChild
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link href="/setting/subscription" className="flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              {upgradeText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            ✨ Instant access • 7-day free trial • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}; 