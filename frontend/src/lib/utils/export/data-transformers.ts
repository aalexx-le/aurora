import { AnalyseData } from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysis";
import {
    AssetExportData,
    CategoryExportData,
    ExportData,
    PortfolioSummary,
} from "./types";

export function transformAnalyseDataToExportData(
    analyseData: AnalyseData[],
    portfolioName: string = "Portfolio",
): ExportData {
    // Calculate portfolio summary
    const summary = calculatePortfolioSummary(analyseData, portfolioName);

    // Transform assets data
    const assets = transformAssetsData(analyseData);

    // Calculate categories data
    const categories = calculateCategoriesData(analyseData);

    return {
        summary,
        assets,
        categories,
    };
}

function calculatePortfolioSummary(
    analyseData: AnalyseData[],
    portfolioName: string,
): PortfolioSummary {
    const totalValue = analyseData.reduce(
        (sum, item) => sum + item.remainingQty * item.price,
        0,
    );
    const totalInvestment = analyseData.reduce(
        (sum, item) => sum + item.invest,
        0,
    );
    const totalProfit = analyseData.reduce(
        (sum, item) => sum + item.estimatedProfit,
        0,
    );
    const profitPercentage =
        totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;
    const assetCount = analyseData.length;

    return {
        portfolioName,
        totalValue,
        totalInvestment,
        totalProfit,
        profitPercentage,
        assetCount,
        lastUpdated: new Date().toISOString(),
    };
}

function transformAssetsData(analyseData: AnalyseData[]): AssetExportData[] {
    return analyseData.map((item) => ({
        symbol: item.name,
        name: item.name,
        balance: item.remainingQty,
        value: item.remainingQty * item.price,
        investment: item.invest,
        profit: item.estimatedProfit,
        profitPercentage: item.profitPercent,
        category: item.tag || "Uncategorized",
        exchange: item.exchange || "Unknown",
        price: item.price,
    }));
}

function calculateCategoriesData(
    analyseData: AnalyseData[],
): CategoryExportData[] {
    const categoryMap = new Map<
        string,
        {
            totalValue: number;
            totalInvestment: number;
            assetCount: number;
        }
    >();

    // Group by category (using tag as category)
    analyseData.forEach((item) => {
        const category = item.tag || "Uncategorized";
        const existing = categoryMap.get(category) || {
            totalValue: 0,
            totalInvestment: 0,
            assetCount: 0,
        };

        categoryMap.set(category, {
            totalValue: existing.totalValue + item.remainingQty * item.price,
            totalInvestment: existing.totalInvestment + item.invest,
            assetCount: existing.assetCount + 1,
        });
    });

    // Calculate totals for percentage calculation
    const grandTotalValue = analyseData.reduce(
        (sum, item) => sum + item.remainingQty * item.price,
        0,
    );

    // Transform to export format
    return Array.from(categoryMap.entries())
        .map(([name, data]) => {
            const totalProfit = data.totalValue - data.totalInvestment;
            const profitPercentage =
                data.totalInvestment > 0
                    ? (totalProfit / data.totalInvestment) * 100
                    : 0;
            const percentage =
                grandTotalValue > 0
                    ? (data.totalValue / grandTotalValue) * 100
                    : 0;

            return {
                name,
                totalValue: data.totalValue,
                totalInvestment: data.totalInvestment,
                totalProfit,
                profitPercentage,
                assetCount: data.assetCount,
                percentage,
            };
        })
        .sort((a, b) => b.totalValue - a.totalValue); // Sort by value descending
}
