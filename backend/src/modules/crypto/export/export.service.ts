import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import { PrismaService } from "nestjs-prisma";
import * as path from "path";
import {
    ExportFormat,
    ExportPortfolioInput,
    ExportResult,
} from "./dto/export.dto";
import {
    AssetExportData,
    CategoryExportData,
    PortfolioExportData,
} from "./interfaces/export-data.interface";
import { CsvExportService } from "./services/csv-export.service";
import { ExcelExportService } from "./services/excel-export.service";
import { PdfExportService } from "./services/pdf-export.service";

@Injectable()
export class ExportService {
    private readonly uploadsDir: string;

    constructor(
        private readonly prisma: PrismaService,
        private readonly pdfExportService: PdfExportService,
        private readonly csvExportService: CsvExportService,
        private readonly excelExportService: ExcelExportService,
        private readonly configService: ConfigService,
    ) {
        this.uploadsDir = path.join(process.cwd(), "uploads", "exports");
        this.ensureUploadsDirectory();
    }

    async exportPortfolio(
        input: ExportPortfolioInput,
        userId: number,
    ): Promise<ExportResult> {
        // Get portfolio data
        const portfolioData = await this.getPortfolioData(
            input.portfolioId,
            userId,
        );

        // Transform data for export
        const exportData = await this.transformPortfolioData(
            portfolioData,
            input.portfolioName,
        );

        // Generate export based on format
        let buffer: Buffer;
        let mimeType: string;
        let fileExtension: string;

        switch (input.format) {
            case ExportFormat.PDF:
                buffer = await this.pdfExportService.generatePdf(
                    exportData,
                    input,
                );
                mimeType = "application/pdf";
                fileExtension = "pdf";
                break;
            case ExportFormat.CSV:
                buffer = await this.csvExportService.generateCsv(exportData);
                mimeType = "text/csv";
                fileExtension = "csv";
                break;
            case ExportFormat.EXCEL:
                buffer =
                    await this.excelExportService.generateExcel(exportData);
                mimeType =
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                fileExtension = "xlsx";
                break;
            default:
                throw new Error(`Unsupported export format: ${input.format}`);
        }

        // Save file and return download info
        return this.saveExportFile(buffer, exportData, fileExtension, mimeType);
    }

    private async getPortfolioData(portfolioId: string, userId: number) {
        const portfolio = await this.prisma.cryptoPortfolio.findFirst({
            where: {
                id: portfolioId,
                userId: userId,
            },
            include: {
                historicalAssetProfits: {
                    include: {
                        assetInfo: true,
                    },
                },
                balances: {
                    include: {
                        assetInfo: true,
                    },
                },
            },
        });

        if (!portfolio) {
            throw new NotFoundException("Portfolio not found");
        }

        return portfolio;
    }

    private async transformPortfolioData(
        portfolio: any,
        portfolioName?: string,
    ): Promise<PortfolioExportData> {
        const assetProfits = portfolio.historicalAssetProfits || [];

        // Calculate totals
        const totalInvestment = assetProfits.reduce(
            (sum: number, asset: any) => sum + asset.totalCostInQuoteQty,
            0,
        );
        const currentValue = assetProfits.reduce(
            (sum: number, asset: any) =>
                sum + asset.remainingQty * asset.assetInfo.lastPrice,
            0,
        );
        const totalProfit = assetProfits.reduce(
            (sum: number, asset: any) => sum + asset.estimatedProfit,
            0,
        );
        const profitPercentage =
            totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0;

        // Transform assets
        const assets: AssetExportData[] = assetProfits.map((asset: any) => ({
            assetId: asset.assetInfo.id,
            symbol: asset.assetInfo.symbol,
            name: asset.assetInfo.symbol,
            investment: asset.totalCostInQuoteQty,
            currentPrice: asset.assetInfo.lastPrice,
            quantity: asset.remainingQty,
            currentValue: asset.remainingQty * asset.assetInfo.lastPrice,
            profit: asset.estimatedProfit,
            profitPercentage:
                asset.totalCostInQuoteQty > 0
                    ? (asset.estimatedProfit / asset.totalCostInQuoteQty) * 100
                    : 0,
            tag: asset.assetInfo.tag || "Other",
            exchange: portfolio.exchanges || "Unknown",
        }));

        // Group by categories (tags)
        const categoryMap = new Map<
            string,
            {
                investment: number;
                currentValue: number;
                profit: number;
                assetCount: number;
            }
        >();

        assets.forEach((asset) => {
            const existing = categoryMap.get(asset.tag) || {
                investment: 0,
                currentValue: 0,
                profit: 0,
                assetCount: 0,
            };

            categoryMap.set(asset.tag, {
                investment: existing.investment + asset.investment,
                currentValue: existing.currentValue + asset.currentValue,
                profit: existing.profit + asset.profit,
                assetCount: existing.assetCount + 1,
            });
        });

        // Transform categories
        const categories: CategoryExportData[] = Array.from(
            categoryMap.entries(),
        ).map(([tag, data]) => ({
            tag,
            investment: data.investment,
            currentValue: data.currentValue,
            profit: data.profit,
            profitPercentage:
                data.investment > 0 ? (data.profit / data.investment) * 100 : 0,
            assetCount: data.assetCount,
            allocationPercentage:
                totalInvestment > 0
                    ? (data.investment / totalInvestment) * 100
                    : 0,
        }));

        return {
            portfolioId: portfolio.id,
            portfolioName: portfolioName || portfolio.name || "Portfolio",
            exportDate: new Date(),
            totalInvestment,
            currentValue,
            totalProfit,
            profitPercentage,
            assets,
            categories,
        };
    }

    private async saveExportFile(
        buffer: Buffer,
        exportData: PortfolioExportData,
        fileExtension: string,
        mimeType: string,
    ): Promise<ExportResult> {
        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `Portfolio_${exportData.portfolioName.replace(/\s+/g, "_")}_${timestamp}.${fileExtension}`;
        const filePath = path.join(this.uploadsDir, fileName);

        // Write file
        await fs.promises.writeFile(filePath, buffer);

        // Get file stats
        const stats = await fs.promises.stat(filePath);

        const serverUrl =
            this.configService.get("SERVER_HOST") +
            ":" +
            this.configService.get("SERVER_PORT");
        console.log(serverUrl);
        // Generate download URL (you might want to use a proper file serving mechanism)
        const downloadUrl = `${serverUrl}/api/exports/download/${fileName}`;

        // Set expiration (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        return {
            downloadUrl,
            fileName,
            mimeType,
            fileSize: stats.size,
            expiresAt,
        };
    }

    private ensureUploadsDirectory() {
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    async cleanupExpiredFiles() {
        try {
            const files = await fs.promises.readdir(this.uploadsDir);
            const now = new Date();

            for (const file of files) {
                const filePath = path.join(this.uploadsDir, file);
                const stats = await fs.promises.stat(filePath);

                // Delete files older than 24 hours
                const ageInHours =
                    (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60);
                if (ageInHours > 24) {
                    await fs.promises.unlink(filePath);
                }
            }
        } catch (error) {
            console.error("Error cleaning up export files:", error);
        }
    }
}
