export interface PortfolioExportData {
  portfolioId: string;
  portfolioName: string;
  exportDate: Date;
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
  assets: AssetExportData[];
  categories: CategoryExportData[];
}

export interface AssetExportData {
  assetId: string;
  symbol: string;
  name: string;
  investment: number;
  currentPrice: number;
  quantity: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  tag: string;
  exchange: string;
}

export interface CategoryExportData {
  tag: string;
  investment: number;
  currentValue: number;
  profit: number;
  profitPercentage: number;
  assetCount: number;
  allocationPercentage: number;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'excel';
  includeCharts: boolean;
  includeSummary: boolean;
  portfolioName?: string;
} 