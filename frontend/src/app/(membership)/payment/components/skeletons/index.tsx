import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the payment header
 * Displays a placeholder UI while header data is loading
 */
export const PaymentHeaderSkeleton = () => (
  <div className="mb-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the payment context card
 * Displays a placeholder UI while plan and pricing data is loading
 */
export const PaymentContextCardSkeleton = () => (
  <div className="space-y-6">
    <div className="rounded-xl border bg-card shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="p-6 pt-0 space-y-4">
        {/* Plan features skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-1">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="h-1.5 w-1.5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Pricing breakdown skeleton */}
        <div className="rounded-lg border p-4 space-y-3">
          <Skeleton className="h-5 w-28" />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-14" />
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the MetaMask payment interface
 * Displays a placeholder UI while payment component is loading
 */
export const MetaMaskPaymentSkeleton = () => (
  <div className="bg-card rounded-lg shadow-lg border p-6 space-y-6">
    {/* Payment method header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>

    {/* Payment steps skeleton */}
    <div className="space-y-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>

    {/* Action buttons skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <div className="flex space-x-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  </div>
);

/**
 * Complete payment page skeleton
 * Displays a placeholder UI while the entire payment page is loading
 */
export const PaymentPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <PaymentHeaderSkeleton />
        
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column skeleton */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PaymentContextCardSkeleton />
          </div>
          
          {/* Right column skeleton */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <MetaMaskPaymentSkeleton />
          </div>
        </div>

        {/* Footer help section skeleton */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-1 w-1 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  </div>
); 