import { saveAs } from "file-saver";
import { ExportData, ExportOptions, ExportProgressCallback } from "./types";

export async function exportToCsv(
    data: ExportData,
    options: ExportOptions = {},
    onProgress?: ExportProgressCallback,
): Promise<void> {
    try {
        onProgress?.({
            stage: "Preparing CSV data",
            progress: 10,
            message: "Processing portfolio data...",
        });

        const csvContent = generateCsvContent(data, options);

        onProgress?.({
            stage: "Generating file",
            progress: 80,
            message: "Creating CSV file...",
        });

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const fileName = generateFileName(data.summary.portfolioName);

        onProgress?.({
            stage: "Downloading",
            progress: 100,
            message: "Download starting...",
        });

        saveAs(blob, fileName);
    } catch (error) {
        console.error("CSV export failed:", error);
        throw new Error("Failed to export CSV file");
    }
}

function generateCsvContent(data: ExportData, options: ExportOptions): string {
    const lines: string[] = [];

    // Add header
    lines.push("Aurora - Portfolio Analysis Report");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");

    // Portfolio Summary
    if (options.includeSummary !== false) {
        lines.push("PORTFOLIO SUMMARY");
        lines.push("Metric,Value");
        lines.push(`Portfolio Name,"${data.summary.portfolioName}"`);
        lines.push(`Total Value,${formatCurrency(data.summary.totalValue)}`);
        lines.push(
            `Total Investment,${formatCurrency(data.summary.totalInvestment)}`,
        );
        lines.push(`Total Profit,${formatCurrency(data.summary.totalProfit)}`);
        lines.push(
            `Profit Percentage,${formatPercentage(data.summary.profitPercentage)}`,
        );
        lines.push(`Number of Assets,${data.summary.assetCount}`);
        lines.push(
            `Last Updated,${new Date(data.summary.lastUpdated).toLocaleString()}`,
        );
        lines.push("");
    }

    // Assets Breakdown
    lines.push("ASSETS BREAKDOWN");
    lines.push(
        "Symbol,Name,Balance,Value,Investment,Profit,Profit %,Category,Exchange,Price",
    );

    data.assets.forEach((asset) => {
        lines.push(
            [
                `"${asset.symbol}"`,
                `"${asset.name}"`,
                asset.balance.toString(),
                formatCurrency(asset.value),
                formatCurrency(asset.investment),
                formatCurrency(asset.profit),
                formatPercentage(asset.profitPercentage),
                `"${asset.category}"`,
                `"${asset.exchange}"`,
                formatCurrency(asset.price),
            ].join(","),
        );
    });

    lines.push("");

    // Categories Summary
    lines.push("CATEGORIES SUMMARY");
    lines.push("Category,Value,Investment,Profit,Profit %,Assets,Portfolio %");

    data.categories.forEach((category) => {
        lines.push(
            [
                `"${category.name}"`,
                formatCurrency(category.totalValue),
                formatCurrency(category.totalInvestment),
                formatCurrency(category.totalProfit),
                formatPercentage(category.profitPercentage),
                category.assetCount.toString(),
                formatPercentage(category.percentage),
            ].join(","),
        );
    });

    return lines.join("\n");
}

function formatCurrency(value: number): string {
    return value.toFixed(2);
}

function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}

function generateFileName(portfolioName: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const sanitizedName = portfolioName.replace(/[^a-zA-Z0-9]/g, "_");
    return `${sanitizedName}_analysis_${timestamp}.csv`;
}
