import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileX } from "lucide-react";

/**
 * Skeleton for Payment Provider Select component
 * Displays a placeholder UI while payment provider options are loading
 */
export const PaymentProviderSelectSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-32" /> {/* Label */}
    <div className="flex items-center gap-2 p-3 border rounded-md">
      <Skeleton className="h-4 w-4 rounded-full" /> {/* Avatar */}
      <Skeleton className="h-4 w-16" /> {/* Provider name */}
      <Skeleton className="h-4 w-4 ml-auto" /> {/* Chevron */}
    </div>
  </div>
);

/**
 * Skeleton for Billing Interval Toggle component
 * Displays a placeholder UI for the billing interval selection
 */
export const BillingIntervalToggleSkeleton = () => (
  <div className="flex flex-col items-center justify-center space-y-4">
    <Skeleton className="h-9 w-48" /> {/* "Choose Your Plan" title */}
    <div className="flex items-center space-x-2">
      <Skeleton className="h-4 w-16" /> {/* "Monthly" text */}
      <Skeleton className="h-6 w-11 rounded-full" /> {/* Switch */}
      <Skeleton className="h-4 w-12" /> {/* "Yearly" text */}
    </div>
  </div>
);

/**
 * Skeleton for individual Plan Card component
 * Uses ShadCN Card components for proper structure and visual consistency
 */
export const PlanCardSkeleton = () => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <Skeleton className="h-8 w-24" /> {/* Plan title */}
      <Skeleton className="h-4 w-full" /> {/* Plan description line 1 */}
      <Skeleton className="h-4 w-3/4" /> {/* Plan description line 2 */}
    </CardHeader>
    
    <CardContent className="flex-grow flex flex-col">
      {/* Pricing Section */}
      <div className="mb-4">
        <div className="flex items-end">
          <Skeleton className="h-9 w-16" /> {/* Price amount */}
          <Skeleton className="h-4 w-12 ml-1 mb-1" /> {/* /month text */}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="space-y-2 flex-grow">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="flex items-start space-x-2">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0 mt-0.5" /> {/* Check icon */}
            <Skeleton className="h-4 w-full" /> {/* Feature text */}
          </div>
        ))}
      </div>
      
      {/* Action Button */}
      <div className="mt-6">
        <Skeleton className="h-10 w-full rounded-md" /> {/* Select plan button */}
      </div>
    </CardContent>
  </Card>
);

/**
 * Skeleton for Subscription List component
 * Uses ShadCN Card components for subscription items
 */
export const SubscriptionListSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-4">
      {Array(2).fill(0).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" /> {/* Plan name */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-0 py-0">
                  <Skeleton className="h-4 w-16" /> {/* Status badge */}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" /> {/* Price */}
              <Skeleton className="h-8 w-8" /> {/* Menu button */}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" /> {/* Calendar icon */}
              <Skeleton className="h-4 w-40" /> {/* Next billing date */}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" /> {/* Clock icon */}
              <Skeleton className="h-4 w-36" /> {/* Payment method */}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-9 w-24" /> {/* Action button 1 */}
            <Skeleton className="h-9 w-24" /> {/* Action button 2 */}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

/**
 * Complete Subscription Form Skeleton
 * Combines all subscription form components for a complete loading state
 */
export const SubscriptionFormSkeleton = () => (
  <div className="w-full">
    <div className="flex flex-col space-y-8 max-w-6xl mx-auto">
      {/* Payment Provider Select Skeleton */}
      <PaymentProviderSelectSkeleton />
      
      {/* Billing Interval Toggle Skeleton */}
      <BillingIntervalToggleSkeleton />

      {/* Plan Selection Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, i) => (
          <PlanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Complete Subscription Page Skeleton
 * Matches the structure of the subscription page with tabs for current and all subscriptions
 */
export const SubscriptionPageSkeleton = () => (
  <div className="space-y-6">
    {/* Header Section */}
    <div>
      <Skeleton className="h-7 w-32" /> {/* "Subscription" title */}
      <Skeleton className="h-4 w-80 mt-1" /> {/* Description */}
    </div>
    
    <Skeleton className="h-px w-full" /> {/* Separator */}
    
    {/* Tabs Section */}
    <div className="space-y-6">
      {/* Tab List */}
      <div className="flex space-x-1 rounded-md w-fit">
        <Skeleton className="h-9 w-44" /> {/* "Current Subscriptions" tab */}
        <Skeleton className="h-9 w-36" /> {/* "All Subscriptions" tab */}
      </div>
      
      {/* Tab Content - Default to Current Subscriptions view */}
      <div className="mt-6">
        <div className="space-y-4">
          {/* Subscription List */}
          <SubscriptionListSkeleton />
          
          {/* Manage Subscription Button */}
          <div className="pt-2">
            <Skeleton className="h-10 w-48" /> {/* Manage subscription button */}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Error State Component
 * Enhanced error display using ShadCN Alert component
 */
export const ErrorState = ({ 
  error, 
  message = "Error loading subscription data",
  onRetry
}: { 
  error: Error; 
  message?: string;
  onRetry?: () => void;
}) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>{message}</AlertTitle>
    <AlertDescription className="space-y-3">
      <p>{error.message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="h-8"
        >
          Try Again
        </Button>
      )}
    </AlertDescription>
  </Alert>
);

/**
 * Empty State Component
 * Enhanced empty state display using ShadCN components
 */
export const EmptyState = ({ 
  message = "No subscription plans available",
  description,
  action
}: { 
  message?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}) => (
  <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg border-2 border-dashed">
    <FileX className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">{message}</h3>
    {description && (
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
    )}
    {action && (
      <Button onClick={action.onClick} variant="outline">
        {action.label}
      </Button>
    )}
  </div>
); 