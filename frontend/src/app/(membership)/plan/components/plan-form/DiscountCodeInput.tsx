'use client';

import { DiscountCodeInputProps } from '@/app/(membership)/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';

export function DiscountCodeInput({
  onCodeApply,
  onRemoveDiscount,
  isLoading = false,
  appliedDiscount,
  error,
}: DiscountCodeInputProps) {
  const [code, setCode] = useState('');

  const handleApply = async () => {
    if (code.trim()) {
      await onCodeApply(code.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApply();
    }
  };

  // Applied discount state
  if (appliedDiscount && appliedDiscount.isValid) {
    const savings = appliedDiscount.discountAmount ? parseFloat(appliedDiscount.discountAmount) : 0;
    const discountCode = appliedDiscount.discount?.code || 'Discount';
    
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium text-green-800 dark:text-green-200">
                  {discountCode} applied
                </span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Save ${savings.toFixed(2)}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveDiscount}
                className="h-auto p-1 text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove discount</span>
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Enter discount code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
            aria-label="Enter discount code"
            aria-describedby={error ? "discount-error" : "discount-help"}
          />
          <Button
            type="button"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
            className="whitespace-nowrap"
          >
            {isLoading ? "Applying..." : "Apply Code"}
          </Button>
        </div>
        
        {error && (
          <Alert 
            variant="destructive"
            id="discount-error"
            role="alert"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {!error && (
          <p id="discount-help" className="text-xs text-muted-foreground">
            Have a discount code? Enter it above to save on your subscription.
          </p>
        )}
      </CardContent>
    </Card>
  );
} 