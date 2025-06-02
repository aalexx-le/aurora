import { Injectable } from '@nestjs/common';
import { PortfolioExportData } from '../interfaces/export-data.interface';

@Injectable()
export class CsvExportService {
  async generateCsv(data: PortfolioExportData): Promise<Buffer> {
    const csvContent = this.generateCsvContent(data);
    return Buffer.from(csvContent, 'utf-8');
  }

  private generateCsvContent(data: PortfolioExportData): string {
    const lines: string[] = [];
    
    // Portfolio Summary Section
    lines.push('PORTFOLIO SUMMARY');
    lines.push('Portfolio Name,' + this.escapeCSV(data.portfolioName));
    lines.push('Export Date,' + this.formatDate(data.exportDate));
    lines.push('Total Investment,' + this.formatCurrency(data.totalInvestment));
    lines.push('Current Value,' + this.formatCurrency(data.currentValue));
    lines.push('Total Profit,' + this.formatCurrency(data.totalProfit));
    lines.push('Profit Percentage,' + this.formatPercentage(data.profitPercentage));
    lines.push(''); // Empty line
    
    // Assets Section
    lines.push('ASSETS BREAKDOWN');
    lines.push('Symbol,Investment,Current Price,Quantity,Current Value,Profit,Profit %,Category,Exchange');
    
    data.assets.forEach(asset => {
      lines.push([
        this.escapeCSV(asset.symbol),
        this.formatCurrency(asset.investment),
        this.formatCurrency(asset.currentPrice),
        asset.quantity.toFixed(6),
        this.formatCurrency(asset.currentValue),
        this.formatCurrency(asset.profit),
        this.formatPercentage(asset.profitPercentage),
        this.escapeCSV(asset.tag),
        this.escapeCSV(asset.exchange)
      ].join(','));
    });
    
    lines.push(''); // Empty line
    
    // Categories Section
    lines.push('CATEGORIES BREAKDOWN');
    lines.push('Category,Investment,Current Value,Profit,Profit %,Asset Count,Allocation %');
    
    data.categories.forEach(category => {
      lines.push([
        this.escapeCSV(category.tag),
        this.formatCurrency(category.investment),
        this.formatCurrency(category.currentValue),
        this.formatCurrency(category.profit),
        this.formatPercentage(category.profitPercentage),
        category.assetCount.toString(),
        this.formatPercentage(category.allocationPercentage)
      ].join(','));
    });
    
    return lines.join('\n');
  }

  private escapeCSV(value: string): string {
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  private formatPercentage(percentage: number): string {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
} 