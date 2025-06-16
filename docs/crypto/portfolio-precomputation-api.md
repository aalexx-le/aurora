# Portfolio Precomputation API Documentation

## Overview

This document provides comprehensive API documentation for the Portfolio Data Precomputation system, including GraphQL mutations, Kafka message schemas, service interfaces, and database operations.

## GraphQL API

### Mutations

#### Create Portfolio with Precomputation

```graphql
mutation CreateCryptoPortfolio($input: CreateCryptoPortfolioInput!) {
  createCryptoPortfolio(input: $input) {
    executionId
    status
    progressPercent
    currentStep
    currentMilestone
    computationStage
    computationProgress
    symbolsDiscovered
    tradesProcessed
    pricesProcessed
    pnlCalculated
    analyticsCalculated
    errorMessage
  }
}
```

**Input Schema:**
```typescript
interface CreateCryptoPortfolioInput {
  exchangeId: string;
  credentials: ExchangeCredentialsInput;
  portfolioName?: string;
  enablePrecomputation?: boolean; // Default: true
  precomputationOptions?: PrecomputationOptionsInput;
}

interface ExchangeCredentialsInput {
  apiKey: string;
  apiSecret: string;
  passphrase?: string; // For exchanges like Coinbase Pro
  sandbox?: boolean;   // For testing environments
}

interface PrecomputationOptionsInput {
  batchSize?: number;           // Default: 5
  requestDelay?: number;        // Default: 100ms
  batchDelay?: number;          // Default: 1000ms
  maxRetries?: number;          // Default: 3
  timeout?: number;             // Default: 300000ms (5 minutes)
  skipAnalytics?: boolean;      // Default: false
  historicalDays?: number;      // Default: 100
}
```

**Response Schema:**
```typescript
interface CreateCryptoPortfolioResponse {
  executionId: number;
  status: PortfolioCreationStatus;
  progressPercent: number;
  currentStep: PortfolioCreationStep;
  currentMilestone: PortfolioCreationMilestone;
  computationStage?: ComputationStage;
  computationProgress?: number;
  symbolsDiscovered?: number;
  tradesProcessed?: number;
  pricesProcessed?: number;
  pnlCalculated: boolean;
  analyticsCalculated: boolean;
  errorMessage?: string;
}

enum ComputationStage {
  SYMBOL_DISCOVERY = 'SYMBOL_DISCOVERY',
  TRADE_HISTORY_FETCH = 'TRADE_HISTORY_FETCH',
  PRICE_HISTORY_FETCH = 'PRICE_HISTORY_FETCH',
  PNL_CALCULATION = 'PNL_CALCULATION',
  ANALYTICS_CALCULATION = 'ANALYTICS_CALCULATION',
  COMPLETED = 'COMPLETED'
}
```

### Subscriptions

#### Portfolio Creation Progress

```graphql
subscription PortfolioCreationProgress($executionId: Int!) {
  portfolioCreationProgress(executionId: $executionId) {
    executionId
    currentStep
    currentMilestone
    progressPercent
    computationStage
    computationProgress
    symbolsDiscovered
    tradesProcessed
    pricesProcessed
    pnlCalculated
    analyticsCalculated
    errorMessage
    timestamp
  }
}
```

### Queries

#### Get Portfolio Analytics

```graphql
query GetPortfolioAnalytics($portfolioId: String!) {
  portfolioAnalytics(portfolioId: $portfolioId) {
    totalValue
    totalPnl
    totalRealizedPnl
    totalUnrealizedPnl
    assetCount
    diversificationScore
    riskScore
    volatility
    sharpeRatio
    maxDrawdown
    portfolioBeta
    annualizedReturn
    lastUpdated
    isPrecomputed
    
    assetBreakdown {
      symbol
      quantity
      currentValue
      totalPnl
      realizedPnl
      unrealizedPnl
      percentageGain
      holdingPeriodDays
      averageCostBasis
    }
    
    performanceMetrics {
      timeframe
      totalReturn
      annualizedReturn
      volatility
      sharpeRatio
      maxDrawdown
      calmarRatio
    }
  }
}
```

## Kafka Message Schemas

### Portfolio Creation Messages

#### Compute Portfolio Data Message

```typescript
interface ComputePortfolioDataMessage {
  executionId: number;
  userId: number;
  portfolioId: string;
  exchangeId: string;
  encryptedCredentials: string;
  stage: ComputationStage;
  context: ComputationContext;
  options: PrecomputationOptions;
  timestamp: Date;
}

interface ComputationContext {
  currentBalanceSymbols: string[];
  symbols?: string[];
  enhancedTrades?: EnhancedTrade[];
  priceHistory?: Map<string, any[]>;
  currentPrices?: Map<string, number>;
  assetPnLData?: AssetPnLData[];
  portfolioAnalytics?: PortfolioAnalyticsResult;
  errors: ComputationError[];
  retryCount: number;
  startTime: number;
  stageTimings: Map<ComputationStage, number>;
  apiRequestCount: number;
  processingTime: number;
}
```

### Kafka Topics

```typescript
const KAFKA_TOPICS = {
  // Portfolio creation flow
  CREATE_PORTFOLIO: 'create-portfolio',
  PORTFOLIO_CREATED: 'portfolio-created',
  PORTFOLIO_CREATION_FAILED: 'portfolio-creation-failed',
  
  // Precomputation pipeline
  COMPUTE_PORTFOLIO_DATA: 'compute-portfolio-data',
  PORTFOLIO_COMPUTATION_PROGRESS: 'portfolio-computation-progress',
  PORTFOLIO_COMPUTATION_COMPLETED: 'portfolio-computation-completed',
  PORTFOLIO_COMPUTATION_FAILED: 'portfolio-computation-failed'
};
```

## Service Interfaces

### Portfolio Computation Service

```typescript
interface IPortfolioComputationService {
  // Main orchestration method
  processComputationStage(message: ComputePortfolioDataMessage): Promise<void>;
  
  // Stage execution methods
  executeSymbolDiscovery(context: ComputationContext): Promise<SymbolDiscoveryResult>;
  executeTradeHistoryFetch(context: ComputationContext): Promise<TradeHistoryResult>;
  executePriceHistoryFetch(context: ComputationContext): Promise<PriceHistoryResult>;
  executePnLCalculation(context: ComputationContext): Promise<PnLCalculationResult>;
  executeAnalyticsCalculation(context: ComputationContext): Promise<PortfolioAnalyticsResult>;
  
  // Utility methods
  validateComputationContext(context: ComputationContext): boolean;
  updateExecutionProgress(executionId: number, updates: Partial<CreatePortfolioExecution>): Promise<void>;
  handleComputationError(error: ComputationError, context: ComputationContext): Promise<void>;
}
```

### P&L Calculation Service

```typescript
interface IPnLCalculationService {
  // Main calculation methods
  calculatePortfolioPnL(trades: EnhancedTrade[], currentPrices: Map<string, number>): Promise<PnLCalculationResult>;
  calculateAssetPnL(assetSymbol: string, trades: EnhancedTrade[], currentPrice: number): Promise<AssetPnLData>;
  
  // FIFO algorithm methods
  processBuyOrder(taxLotQueue: Queue<TaxLot>, trade: EnhancedTrade): void;
  processSellOrder(taxLotQueue: Queue<TaxLot>, trade: EnhancedTrade): SaleResult;
  
  // Utility methods
  calculateUnrealizedPnL(remainingLots: TaxLot[], currentPrice: number): number;
  calculateHoldingPeriod(purchaseDate: Date, saleDate: Date): number;
  validateTradeData(trades: EnhancedTrade[]): boolean;
}
```

### Portfolio Analytics Service

```typescript
interface IPortfolioAnalyticsService {
  // Main analytics calculation
  calculatePortfolioAnalytics(
    trades: EnhancedTrade[],
    currentPrices: Map<string, number>,
    priceHistory: Map<string, any[]>
  ): Promise<PortfolioAnalyticsResult>;
  
  // Performance metrics
  calculateTotalReturn(initialValue: number, currentValue: number): number;
  calculateAnnualizedReturn(totalReturn: number, holdingPeriodDays: number): number;
  
  // Risk metrics
  calculateVolatility(returns: number[]): number;
  calculateMaxDrawdown(values: number[]): number;
  calculateSharpeRatio(returns: number[], riskFreeRate?: number): number;
  
  // Diversification metrics
  calculateDiversificationScore(assetValues: Map<string, number>): number;
  calculateConcentrationRisk(assetValues: Map<string, number>): number;
}
```

## Database Operations

### Enhanced Trade Operations

```typescript
interface ITradeRepository {
  // Create enhanced trade records
  createEnhancedTrades(trades: EnhancedTrade[]): Promise<Trade[]>;
  
  // Query methods
  findTradesByPortfolio(portfolioId: string): Promise<Trade[]>;
  findTradesByAsset(portfolioId: string, assetSymbol: string): Promise<Trade[]>;
  findPrecomputedTrades(portfolioId: string): Promise<Trade[]>;
  
  // Update methods
  updateTradeWithPnL(tradeId: number, pnlData: Partial<Trade>): Promise<Trade>;
  markTradesAsPrecomputed(tradeIds: number[]): Promise<void>;
  
  // Analytics queries
  getTradeStatistics(portfolioId: string): Promise<TradeStatistics>;
  getTradingPairs(portfolioId: string): Promise<string[]>;
}
```

### Historical Analytics Operations

```typescript
interface IHistoricalAnalyticsRepository {
  // Create analytics records
  createHistoricalBalance(data: CreateHistoricalBalanceInput): Promise<HistoricalCryptoBalance>;
  createHistoricalAssetProfit(data: CreateHistoricalAssetProfitInput): Promise<HistoricalAssetProfit>;
  
  // Query methods
  getLatestPortfolioAnalytics(portfolioId: string): Promise<HistoricalCryptoBalance | null>;
  getPortfolioAnalyticsHistory(portfolioId: string, limit?: number): Promise<HistoricalCryptoBalance[]>;
  getAssetProfitHistory(portfolioId: string, assetSymbol?: string): Promise<HistoricalAssetProfit[]>;
  
  // Precomputed data queries
  getPrecomputedAnalytics(portfolioId: string): Promise<{
    balance: HistoricalCryptoBalance | null;
    assets: HistoricalAssetProfit[];
  }>;
}
```

## Error Handling

### Error Types

```typescript
enum ComputationError {
  SYMBOL_DISCOVERY_FAILED = 'SYMBOL_DISCOVERY_FAILED',
  TRADE_HISTORY_FAILED = 'TRADE_HISTORY_FAILED',
  PRICE_HISTORY_FAILED = 'PRICE_HISTORY_FAILED',
  PNL_CALCULATION_FAILED = 'PNL_CALCULATION_FAILED',
  ANALYTICS_CALCULATION_FAILED = 'ANALYTICS_CALCULATION_FAILED',
  EXCHANGE_API_ERROR = 'EXCHANGE_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INSUFFICIENT_DATA = 'INSUFFICIENT_DATA',
  DATABASE_ERROR = 'DATABASE_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR'
}
```

### Error Response Schema

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: Date;
    requestId?: string;
  };
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: Date;
  requestId?: string;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

## Performance Monitoring

### Metrics Collection

```typescript
interface PerformanceMetrics {
  executionId: number;
  totalDuration: number;
  stageTimings: {
    symbolDiscovery: number;
    tradeHistoryFetch: number;
    priceHistoryFetch: number;
    pnlCalculation: number;
    analyticsCalculation: number;
  };
  apiMetrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    rateLimitHits: number;
  };
  dataMetrics: {
    symbolsDiscovered: number;
    tradesProcessed: number;
    pricesProcessed: number;
    assetsAnalyzed: number;
  };
  resourceMetrics: {
    peakMemoryUsage: number;
    averageCpuUsage: number;
    diskIOOperations: number;
  };
}
```

This comprehensive API documentation provides developers with all the necessary information to integrate with and extend the Portfolio Data Precomputation system.
