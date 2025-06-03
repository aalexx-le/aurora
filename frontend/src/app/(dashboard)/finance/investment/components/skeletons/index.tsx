import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the portfolio component
 * Displays a placeholder UI while portfolio data is loading
 */
export const PortfolioSkeleton = () => (
  <div className="flex flex-col rounded-md border p-4 gap-4">
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
 * Skeleton loader for the trade table component
 * Displays a placeholder UI while trade data is loading
 */
export const TradeTableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-6 p-4 border-b">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[90%]" />
          ))}
        </div>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="grid grid-cols-6 p-4 border-b">
            {Array(6).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[80%]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the asset table component
 * Displays a placeholder UI while asset data is loading
 */
export const AssetTableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-7 p-4 border-b">
          {Array(7).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[90%]" />
          ))}
        </div>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="grid grid-cols-7 p-4 border-b">
            {Array(7).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[80%]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for chart components
 * Displays a placeholder UI while chart data is loading
 */
export const BalanceChartSkeleton = () => (
  <div className="flex-1 rounded-md border p-4 space-y-4">
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
 * Skeleton loader for the portfolio analysis component
 * Displays a placeholder UI while analysis data is loading
 */
export const PortfolioAnalysisSkeleton = () => (
  <div className="flex-1 rounded-md border">
    <div className="p-4 flex justify-between items-center border-b">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-6 w-6 rounded-full" /> {/* Question mark icon */}
    </div>
    <div className="p-4 flex flex-col lg:flex-row items-center justify-between">
      {/* Left side: Pie chart */}
      <div className="flex-1 flex flex-col items-center mb-6 lg:mb-0">
        <Skeleton className="h-[250px] w-[250px] rounded-full" />
      </div>
      
      {/* Right side: Category summary */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Category items */}
        {Array(2).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            {/* Category header/button */}
            <Skeleton className="h-8 w-full rounded-md" />
            
            {/* Collapsed content */}
            <div className="space-y-2 px-4">
              {Array(3).fill(0).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" /> {/* Icon or avatar */}
                    <Skeleton className="h-4 w-24" /> {/* Name */}
                  </div>
                  <Skeleton className="h-4 w-16" /> {/* Value */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the portfolio header section
 * Displays a placeholder UI for PortfolioSelect, CreatePortfolioDialog, and CurrencySelect
 */
export const PortfolioHeaderSkeleton = () => (
  <>
    {/* Portfolio Select Skeleton */}
    <Skeleton className="h-10 w-40 rounded-md" />
    
    {/* Create Portfolio Button Skeleton */}
    <Skeleton className="h-10 w-10 rounded-md" />
    
    {/* Currency Select Skeleton (auto-aligned to right) */}
    <div className="ml-auto">
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  </>
);

/**
 * Skeleton loader for the entire investment page
 * Combines multiple skeleton components for a complete loading state
 */
export const InvestmentPageSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-4">
      <PortfolioHeaderSkeleton />
    </div>
    
    <PortfolioSkeleton />
    
    <div className="flex flex-col lg:flex-row gap-4">
      <BalanceChartSkeleton />
      <PortfolioAnalysisSkeleton />
    </div>
  
    <AssetTableSkeleton />
  </div>
); 