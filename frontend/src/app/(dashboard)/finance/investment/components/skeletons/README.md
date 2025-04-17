# Investment Skeleton Components

This directory contains skeleton loading components for the Finance/Investment section of the dashboard.

## Purpose

These skeleton components provide a visual representation of the UI structure while data is being loaded. They improve the user experience by:

1. Reducing perceived loading time
2. Preventing layout shifts when content loads
3. Providing visual feedback that content is loading
4. Maintaining a consistent UI structure during loading states

## Available Components

- **PortfolioSkeleton**: Skeleton for the portfolio summary component
- **TradeTableSkeleton**: Skeleton for the trade history table
- **AssetTableSkeleton**: Skeleton for the asset listing table
- **ChartSkeleton**: Generic skeleton for line chart components
- **BalancePieChartSkeleton**: Specialized skeleton for the balance pie chart with legend
- **TimeframeSelectSkeleton**: Skeleton for the timeframe selection buttons
- **CurrencySelectSkeleton**: Skeleton for the currency selection dropdown
- **PortfolioAnalysisSkeleton**: Skeleton for the portfolio analysis metrics
- **InvestmentPageSkeleton**: Composite skeleton that combines all investment-related skeletons for a complete page loading state

## Usage

Import the skeleton components from this directory:

```tsx
import { 
  PortfolioSkeleton,
  AssetTableSkeleton,
  ChartSkeleton,
  InvestmentPageSkeleton
  // ... other skeletons as needed
} from "@/app/(dashboard)/finance/investment/components/skeletons";
```

Use them in loading states or as Suspense fallbacks:

```tsx
{isLoading ? (
  <AssetTableSkeleton />
) : (
  <AssetTable assets={assets} />
)}
```

Or with Suspense:

```tsx
<Suspense fallback={<InvestmentPageSkeleton />}>
  <InvestmentPage />
</Suspense>
```

## Design Principles

1. Each skeleton mimics the structure of the actual component it represents
2. Chart skeletons use appropriate shapes (rectangles for line charts, circles for pie charts)
3. Table skeletons include headers and multiple rows to represent data tables
4. The page skeleton maintains the overall layout structure of the investment page
5. Control skeletons (timeframe, currency) match the size and position of their actual counterparts 