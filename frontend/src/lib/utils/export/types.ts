export interface ExportOptions {
    includeCharts?: boolean;
    includeSummary?: boolean;
    portfolioName?: string;
}

export interface ExportProgress {
    stage: string;
    progress: number;
    message: string;
}

export interface ExportResult {
    success: boolean;
    fileName?: string;
    error?: string;
}

export interface PortfolioSummary {
    portfolioName: string;
    totalValue: number;
    totalInvestment: number;
    totalProfit: number;
    profitPercentage: number;
    assetCount: number;
    lastUpdated: string;
}

export interface AssetExportData {
    symbol: string;
    name: string;
    balance: number;
    value: number;
    investment: number;
    profit: number;
    profitPercentage: number;
    category: string;
    exchange: string;
    price: number;
}

export interface CategoryExportData {
    name: string;
    totalValue: number;
    totalInvestment: number;
    totalProfit: number;
    profitPercentage: number;
    assetCount: number;
    percentage: number;
}

export interface ExportData {
    summary: PortfolioSummary;
    assets: AssetExportData[];
    categories: CategoryExportData[];
}

export type ExportProgressCallback = (progress: ExportProgress) => void;
