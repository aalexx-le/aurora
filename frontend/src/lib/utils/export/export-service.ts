
import { PortfolioAnalyseData } from "@/app/(dashboard)/finance/investment/types";
import { exportToCsv } from "./csv-export";
import { transformAnalyseDataToExportData } from "./data-transformers";
import { exportToExcel } from "./excel-export";
import { exportToPdf } from "./pdf-export";
import { ExportOptions, ExportProgressCallback, ExportResult } from "./types";

// Import ExportFormat from the constants file instead of GraphQL
export enum ExportFormat {
    Pdf = "PDF",
    Csv = "CSV",
    Excel = "EXCEL",
}

export class ExportService {
    static async exportPortfolio(
        analyseData: PortfolioAnalyseData[],
        format: ExportFormat,
        options: ExportOptions = {},
        onProgress?: ExportProgressCallback,
    ): Promise<ExportResult> {
        try {
            onProgress?.({
                stage: "Starting export",
                progress: 0,
                message: "Preparing data...",
            });

            const exportData = transformAnalyseDataToExportData(
                analyseData,
                options.portfolioName || "Portfolio",
            );

            onProgress?.({
                stage: "Data prepared",
                progress: 5,
                message: "Starting export generation...",
            });

            switch (format) {
                case ExportFormat.Csv:
                    await exportToCsv(exportData, options, onProgress);
                    break;
                case ExportFormat.Excel:
                    await exportToExcel(exportData, options, onProgress);
                    break;
                case ExportFormat.Pdf:
                    await exportToPdf(exportData, options, onProgress);
                    break;
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }

            return {
                success: true,
                fileName: generateFileName(
                    exportData.summary.portfolioName,
                    format,
                ),
            };
        } catch (error) {
            console.error("Export failed:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Export failed",
            };
        }
    }

    static getFormatInfo(format: ExportFormat) {
        const formatInfo = {
            [ExportFormat.Pdf]: {
                title: "PDF Report",
                description: "Professional report with charts and tables",
                mimeType: "application/pdf",
                extension: "pdf",
                estimatedSize: "~500KB",
            },
            [ExportFormat.Csv]: {
                title: "CSV Data",
                description: "Raw data for spreadsheet applications",
                mimeType: "text/csv",
                extension: "csv",
                estimatedSize: "~50KB",
            },
            [ExportFormat.Excel]: {
                title: "Excel Workbook",
                description: "Formatted workbook with multiple sheets",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                extension: "xlsx",
                estimatedSize: "~200KB",
            },
        };

        return formatInfo[format];
    }

    static validateExportData(analyseData: PortfolioAnalyseData[]): {
        isValid: boolean;
        error?: string;
    } {
        if (!analyseData || analyseData.length === 0) {
            return {
                isValid: false,
                error: "No portfolio data available for export",
            };
        }

        // Check if data has required fields
        const hasValidData = analyseData.every(
            (item) =>
                item.name &&
                typeof item.price === "number" &&
                typeof item.invest === "number" &&
                typeof item.remainingQty === "number",
        );

        if (!hasValidData) {
            return {
                isValid: false,
                error: "Portfolio data is incomplete or invalid",
            };
        }

        return { isValid: true };
    }
}

function generateFileName(portfolioName: string, format: ExportFormat): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const sanitizedName = portfolioName.replace(/[^a-zA-Z0-9]/g, "_");
    const extension = ExportService.getFormatInfo(format).extension;
    return `${sanitizedName}_analysis_${timestamp}.${extension}`;
}
