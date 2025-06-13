import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import { ExportPortfolioInput } from "../dto/export.dto";
import { PortfolioExportData } from "../interfaces/export-data.interface";

@Injectable()
export class PdfExportService {
    async generatePdf(
        data: PortfolioExportData,
        options: ExportPortfolioInput,
    ): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        try {
            const page = await browser.newPage();

            // Generate HTML content
            const htmlContent = this.generateHtmlContent(data, options);

            // Set content and generate PDF
            await page.setContent(htmlContent, { waitUntil: "networkidle0" });

            const pdfBuffer = await page.pdf({
                format: "A4",
                printBackground: true,
                margin: {
                    top: "20mm",
                    right: "15mm",
                    bottom: "20mm",
                    left: "15mm",
                },
            });

            return Buffer.from(pdfBuffer);
        } finally {
            await browser.close();
        }
    }

    private generateHtmlContent(
        data: PortfolioExportData,
        options: ExportPortfolioInput,
    ): string {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Portfolio Analysis Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2c3e50;
            margin: 0;
            font-size: 28px;
          }
          .header .subtitle {
            color: #7f8c8d;
            font-size: 14px;
            margin-top: 5px;
          }
          .summary-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .summary-item {
            text-align: center;
          }
          .summary-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .summary-value {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
          }
          .profit-positive { color: #28a745; }
          .profit-negative { color: #dc3545; }
          .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin: 30px 0 15px 0;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 5px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 12px;
          }
          .table th {
            background: #f8f9fa;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #dee2e6;
            color: #495057;
          }
          .table td {
            padding: 10px 8px;
            border-bottom: 1px solid #dee2e6;
          }
          .table tr:nth-child(even) {
            background: #f8f9fa;
          }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #e0e0e0;
            padding-top: 20px;
          }
          @media print {
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Portfolio Analysis Report</h1>
          <div class="subtitle">
            ${data.portfolioName} • Generated on ${this.formatDate(data.exportDate)}
          </div>
        </div>

        ${options.includeSummary ? this.generateSummarySection(data) : ""}
        
        <div class="section-title">Assets Breakdown</div>
        ${this.generateAssetsTable(data.assets)}
        
        <div class="page-break"></div>
        
        <div class="section-title">Categories Analysis</div>
        ${this.generateCategoriesTable(data.categories)}
        
        <div class="footer">
          <p>This report was generated automatically by XELA Finance Management System</p>
          <p>Report ID: ${data.portfolioId} | Generated: ${this.formatDate(data.exportDate)}</p>
        </div>
      </body>
      </html>
    `;
    }

    private generateSummarySection(data: PortfolioExportData): string {
        return `
      <div class="summary-section">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Investment</div>
            <div class="summary-value">${this.formatCurrency(data.totalInvestment)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Current Value</div>
            <div class="summary-value">${this.formatCurrency(data.currentValue)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Total Profit/Loss</div>
            <div class="summary-value ${data.totalProfit >= 0 ? "profit-positive" : "profit-negative"}">
              ${this.formatCurrency(data.totalProfit)}
            </div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Profit Percentage</div>
            <div class="summary-value ${data.profitPercentage >= 0 ? "profit-positive" : "profit-negative"}">
              ${this.formatPercentage(data.profitPercentage)}
            </div>
          </div>
        </div>
      </div>
    `;
    }

    private generateAssetsTable(assets: any[]): string {
        const rows = assets
            .map(
                (asset) => `
      <tr>
        <td>${asset.symbol}</td>
        <td class="text-right">${this.formatCurrency(asset.investment)}</td>
        <td class="text-right">${this.formatCurrency(asset.currentPrice)}</td>
        <td class="text-right">${asset.quantity.toFixed(6)}</td>
        <td class="text-right">${this.formatCurrency(asset.currentValue)}</td>
        <td class="text-right ${asset.profit >= 0 ? "profit-positive" : "profit-negative"}">
          ${this.formatCurrency(asset.profit)}
        </td>
        <td class="text-right ${asset.profitPercentage >= 0 ? "profit-positive" : "profit-negative"}">
          ${this.formatPercentage(asset.profitPercentage)}
        </td>
        <td class="text-center">${asset.tag}</td>
        <td class="text-center">${asset.exchange}</td>
      </tr>
    `,
            )
            .join("");

        return `
      <table class="table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th class="text-right">Investment</th>
            <th class="text-right">Current Price</th>
            <th class="text-right">Quantity</th>
            <th class="text-right">Current Value</th>
            <th class="text-right">Profit/Loss</th>
            <th class="text-right">Profit %</th>
            <th class="text-center">Category</th>
            <th class="text-center">Exchange</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
    }

    private generateCategoriesTable(categories: any[]): string {
        const rows = categories
            .map(
                (category) => `
      <tr>
        <td>${category.tag}</td>
        <td class="text-right">${this.formatCurrency(category.investment)}</td>
        <td class="text-right">${this.formatCurrency(category.currentValue)}</td>
        <td class="text-right ${category.profit >= 0 ? "profit-positive" : "profit-negative"}">
          ${this.formatCurrency(category.profit)}
        </td>
        <td class="text-right ${category.profitPercentage >= 0 ? "profit-positive" : "profit-negative"}">
          ${this.formatPercentage(category.profitPercentage)}
        </td>
        <td class="text-center">${category.assetCount}</td>
        <td class="text-right">${this.formatPercentage(category.allocationPercentage)}</td>
      </tr>
    `,
            )
            .join("");

        return `
      <table class="table">
        <thead>
          <tr>
            <th>Category</th>
            <th class="text-right">Investment</th>
            <th class="text-right">Current Value</th>
            <th class="text-right">Profit/Loss</th>
            <th class="text-right">Profit %</th>
            <th class="text-center">Asset Count</th>
            <th class="text-right">Allocation %</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
    }

    private formatCurrency(amount: number): string {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    }

    private formatPercentage(percentage: number): string {
        return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(2)}%`;
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
}
