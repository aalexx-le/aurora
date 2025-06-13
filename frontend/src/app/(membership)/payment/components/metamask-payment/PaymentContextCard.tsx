'use client';

import { MembershipPlan, MembershipPrice } from '@/app/(membership)/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FeatureList } from '@/components/upgrade';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, CreditCard, Shield, Tag } from 'lucide-react';
import { useState } from 'react';

interface PaymentContextCardProps {
  plan: MembershipPlan;
  price: MembershipPrice;
  originalAmount?: number;
  discountAmount?: number | null;
  finalAmount: number;
  currency: string;
  hasDiscount?: boolean;
  className?: string;
}

export function PaymentContextCard({
  plan,
  price,
  originalAmount,
  discountAmount,
  finalAmount,
  currency,
  hasDiscount = false,
  className
}: PaymentContextCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>
                {price.billingCycle?.interval} billing
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-2">
              <CreditCard className="mr-1 h-3 w-3" />
              Payment
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Collapsible Plan Details */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="secondary" 
                className="w-full justify-between h-auto text-left"
              >
                <h4 className="text-sm font-medium text-muted-foreground">
                  What&apos;s included:
                </h4>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-3 pt-2">
              {/* Plan Features */}
              <FeatureList features={plan.membershipFeatures.map(feature => feature.feature.name)} />
            </CollapsibleContent>
          </Collapsible>

          {/* Pricing Breakdown */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium text-sm">Payment Summary</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              {hasDiscount && originalAmount ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan Price:</span>
                  <span className="line-through text-muted-foreground">
                    ${originalAmount.toFixed(2)} {currency}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plan Price:</span>
                  <span className="font-medium">
                    ${finalAmount.toFixed(2)} {currency}
                  </span>
                </div>
              )}
              
              {hasDiscount && discountAmount && (
                <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                  <span>Discount:</span>
                  <span className="font-medium">
                    -${discountAmount.toFixed(2)} {currency}
                  </span>
                </div>
              )}
              
              <div className="border-t pt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-lg">
                    ${finalAmount.toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Secure payment processing</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 