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
 * Skeleton loader for the balance pie chart component
 * Displays a placeholder UI while pie chart data is loading
 */
export const BalancePieChartSkeleton = () => (
  <div className="rounded-md border p-4 space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="flex justify-center">
      <Skeleton className="h-[250px] w-[250px] rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-2">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton loader for the timeframe select component
 * Displays a placeholder UI while timeframe options are loading
 */
export const TimeframeSelectSkeleton = () => (
  <div className="flex space-x-2">
    {Array(4).fill(0).map((_, i) => (
      <Skeleton key={i} className="h-8 w-16 rounded-md" />
    ))}
  </div>
);

/**
 * Skeleton loader for the currency select component
 * Displays a placeholder UI while currency options are loading
 */
export const CurrencySelectSkeleton = () => (
  <div className="flex items-center space-x-2">
    <Skeleton className="h-6 w-24" />
    <Skeleton className="h-8 w-24 rounded-md" />
  </div>
);

/**
 * Skeleton loader for the portfolio analysis component
 * Displays a placeholder UI while analysis data is loading
 */
export const PortfolioAnalysisSkeleton = () => (
  <div className="rounded-md border p-4 space-y-4">
    <Skeleton className="h-6 w-40" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton loader for the entire investment page
 * Combines multiple skeleton components for a complete loading state
 */
export const InvestmentPageSkeleton = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48" />
      <div className="flex space-x-4">
        <TimeframeSelectSkeleton />
        <CurrencySelectSkeleton />
      </div>
    </div>
    
    <PortfolioSkeleton />
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartSkeleton />
      <BalancePieChartSkeleton />
    </div>
    
    <PortfolioAnalysisSkeleton />
    
    <AssetTableSkeleton />
    
    <TradeTableSkeleton />
  </div>
); 