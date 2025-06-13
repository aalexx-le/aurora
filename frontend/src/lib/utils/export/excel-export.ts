import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ExportData, ExportOptions, ExportProgressCallback } from "./types";

export async function exportToExcel(
    data: ExportData,
    options: ExportOptions = {},
    onProgress?: ExportProgressCallback,
): Promise<void> {
    try {
        onProgress?.({
            stage: "Creating workbook",
            progress: 10,
            message: "Initializing Excel workbook...",
        });

        const workbook = XLSX.utils.book_new();

        onProgress?.({
            stage: "Adding summary sheet",
            progress: 30,
            message: "Creating summary sheet...",
        });

        // Add summary sheet
        if (options.includeSummary !== false) {
            addSummarySheet(workbook, data);
        }

        onProgress?.({
            stage: "Adding assets sheet",
            progress: 50,
            message: "Creating assets breakdown...",
        });

        // Add assets sheet
        addAssetsSheet(workbook, data);

        onProgress?.({
            stage: "Adding categories sheet",
            progress: 70,
            message: "Creating categories summary...",
        });

        // Add categories sheet
        addCategoriesSheet(workbook, data);

        onProgress?.({
            stage: "Generating file",
            progress: 90,
            message: "Finalizing Excel file...",
        });

        // Generate and download
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
        const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const fileName = generateFileName(data.summary.portfolioName);

        onProgress?.({
            stage: "Downloading",
            progress: 100,
            message: "Download starting...",
        });

        saveAs(blob, fileName);
    } catch (error) {
        console.error("Excel export failed:", error);
        throw new Error("Failed to export Excel file");
    }
}

function addSummarySheet(workbook: XLSX.WorkBook, data: ExportData): void {
    const summaryData = [
        ["Aurora - Portfolio Analysis Report"],
        [`Generated: ${new Date().toLocaleString()}`],
        [],
        ["PORTFOLIO SUMMARY"],
        [],
        ["Metric", "Value"],
        ["Portfolio Name", data.summary.portfolioName],
        ["Total Value", formatCurrency(data.summary.totalValue)],
        ["Total Investment", formatCurrency(data.summary.totalInvestment)],
        ["Total Profit", formatCurrency(data.summary.totalProfit)],
        ["Profit Percentage", formatPercentage(data.summary.profitPercentage)],
        ["Number of Assets", data.summary.assetCount],
        ["Last Updated", new Date(data.summary.lastUpdated).toLocaleString()],
        [],
        ["PERFORMANCE METRICS"],
        [],
        ["Best Performing Asset", getBestPerformingAsset(data.assets)],
        ["Worst Performing Asset", getWorstPerformingAsset(data.assets)],
        ["Largest Holding", getLargestHolding(data.assets)],
        ["Most Diverse Category", getMostDiverseCategory(data.categories)],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Apply formatting
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");

    // Set column widths
    worksheet["!cols"] = [{ width: 25 }, { width: 20 }];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");
}

function addAssetsSheet(workbook: XLSX.WorkBook, data: ExportData): void {
    const headers = [
        "Symbol",
        "Name",
        "Balance",
        "Value",
        "Investment",
        "Profit",
        "Profit %",
        "Category",
        "Exchange",
        "Price",
    ];

    const assetsData = [
        ["ASSETS BREAKDOWN"],
        [`Total Assets: ${data.assets.length}`],
        [],
        headers,
        ...data.assets.map((asset) => [
            asset.symbol,
            asset.name,
            asset.balance,
            asset.value,
            asset.investment,
            asset.profit,
            asset.profitPercentage / 100, // Excel percentage format
            asset.category,
            asset.exchange,
            asset.price,
        ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(assetsData);

    // Set column widths
    worksheet["!cols"] = [
        { width: 12 }, // Symbol
        { width: 20 }, // Name
        { width: 15 }, // Balance
        { width: 15 }, // Value
        { width: 15 }, // Investment
        { width: 15 }, // Profit
        { width: 12 }, // Profit %
        { width: 15 }, // Category
        { width: 12 }, // Exchange
        { width: 12 }, // Price
    ];

    // Format currency and percentage columns
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let row = 4; row <= range.e.r; row++) {
        // Format currency columns (D, E, F, J)
        ["D", "E", "F", "J"].forEach((col) => {
            const cellRef = col + (row + 1);
            if (worksheet[cellRef]) {
                worksheet[cellRef].z = '"$"#,##0.00';
            }
        });

        // Format percentage column (G)
        const percentRef = "G" + (row + 1);
        if (worksheet[percentRef]) {
            worksheet[percentRef].z = "0.00%";
        }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
}

function addCategoriesSheet(workbook: XLSX.WorkBook, data: ExportData): void {
    const headers = [
        "Category",
        "Value",
        "Investment",
        "Profit",
        "Profit %",
        "Assets",
        "Portfolio %",
    ];

    const categoriesData = [
        ["CATEGORIES SUMMARY"],
        [`Total Categories: ${data.categories.length}`],
        [],
        headers,
        ...data.categories.map((category) => [
            category.name,
            category.totalValue,
            category.totalInvestment,
            category.totalProfit,
            category.profitPercentage / 100, // Excel percentage format
            category.assetCount,
            category.percentage / 100, // Excel percentage format
        ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(categoriesData);

    // Set column widths
    worksheet["!cols"] = [
        { width: 20 }, // Category
        { width: 15 }, // Value
        { width: 15 }, // Investment
        { width: 15 }, // Profit
        { width: 12 }, // Profit %
        { width: 10 }, // Assets
        { width: 12 }, // Portfolio %
    ];

    // Format currency and percentage columns
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let row = 4; row <= range.e.r; row++) {
        // Format currency columns (B, C, D)
        ["B", "C", "D"].forEach((col) => {
            const cellRef = col + (row + 1);
            if (worksheet[cellRef]) {
                worksheet[cellRef].z = '"$"#,##0.00';
            }
        });

        // Format percentage columns (E, G)
        ["E", "G"].forEach((col) => {
            const percentRef = col + (row + 1);
            if (worksheet[percentRef]) {
                worksheet[percentRef].z = "0.00%";
            }
        });
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
}

// Helper functions
function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}

function getBestPerformingAsset(assets: any[]): string {
    const best = assets.reduce((prev, current) =>
        prev.profitPercentage > current.profitPercentage ? prev : current,
    );
    return `${best.symbol} (${formatPercentage(best.profitPercentage)})`;
}

function getWorstPerformingAsset(assets: any[]): string {
    const worst = assets.reduce((prev, current) =>
        prev.profitPercentage < current.profitPercentage ? prev : current,
    );
    return `${worst.symbol} (${formatPercentage(worst.profitPercentage)})`;
}

function getLargestHolding(assets: any[]): string {
    const largest = assets.reduce((prev, current) =>
        prev.value > current.value ? prev : current,
    );
    return `${largest.symbol} (${formatCurrency(largest.value)})`;
}

function getMostDiverseCategory(categories: any[]): string {
    const mostDiverse = categories.reduce((prev, current) =>
        prev.assetCount > current.assetCount ? prev : current,
    );
    return `${mostDiverse.name} (${mostDiverse.assetCount} assets)`;
}

function generateFileName(portfolioName: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const sanitizedName = portfolioName.replace(/[^a-zA-Z0-9]/g, "_");
    return `${sanitizedName}_analysis_${timestamp}.xlsx`;
}
