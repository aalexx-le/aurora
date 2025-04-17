import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the portfolio component
 * Displays a placeholder UI while portfolio data is loading
 */
export const PortfolioSkeleton = () => (
  <div className="rounded-md border p-4 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton loader for chart components
 * Displays a placeholder UI while chart data is loading
 */
export const ChartSkeleton = () => (
  <div className="rounded-md border p-4 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
    <Skeleton className="h-[300px] w-full rounded-md" />
  </div>
);

/**
 * Skeleton loader for the finance page
 * Combines multiple skeleton components for a complete loading state
 */
export const FinancePageSkeleton = () => (
  <div className="space-y-6">
    <ChartSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PortfolioSkeleton />
      <PortfolioSkeleton />
    </div>
    <ChartSkeleton />
  </div>
); 