import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PortfolioExportData } from '../interfaces/export-data.interface';

@Injectable()
export class ExcelExportService {
  async generateExcel(data: PortfolioExportData): Promise<Buffer> {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Create Summary sheet
    const summarySheet = this.createSummarySheet(data);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Create Assets sheet
    const assetsSheet = this.createAssetsSheet(data);
    XLSX.utils.book_append_sheet(workbook, assetsSheet, 'Assets');
    
    // Create Categories sheet
    const categoriesSheet = this.createCategoriesSheet(data);
    XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Categories');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    return Buffer.from(excelBuffer);
  }

  private createSummarySheet(data: PortfolioExportData): XLSX.WorkSheet {
    const summaryData = [
      ['Portfolio Analysis Summary'],
      [''],
      ['Portfolio Name', data.portfolioName],
      ['Export Date', this.formatDate(data.exportDate)],
      [''],
      ['Financial Overview'],
      ['Total Investment', data.totalInvestment],
      ['Current Value', data.currentValue],
      ['Total Profit/Loss', data.totalProfit],
      ['Profit Percentage', data.profitPercentage / 100], // Excel percentage format
      [''],
      ['Portfolio Statistics'],
      ['Total Assets', data.assets.length],
      ['Asset Categories', data.categories.length],
      ['Profitable Assets', data.assets.filter(a => a.profit > 0).length],
      ['Loss-making Assets', data.assets.filter(a => a.profit < 0).length]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 20 },
      { width: 15 }
    ];
    
    // Format currency cells
    const currencyFormat = '#,##0.00_);[Red](#,##0.00)';
    const percentageFormat = '0.00%';
    
    if (worksheet['B7']) worksheet['B7'].z = currencyFormat;
    if (worksheet['B8']) worksheet['B8'].z = currencyFormat;
    if (worksheet['B9']) worksheet['B9'].z = currencyFormat;
    if (worksheet['B10']) worksheet['B10'].z = percentageFormat;
    
    return worksheet;
  }

  private createAssetsSheet(data: PortfolioExportData): XLSX.WorkSheet {
    const headers = [
      'Symbol', 'Investment', 'Current Price', 'Quantity', 
      'Current Value', 'Profit/Loss', 'Profit %', 'Category', 'Exchange'
    ];
    
    const assetsData = [
      headers,
      ...data.assets.map(asset => [
        asset.symbol,
        asset.investment,
        asset.currentPrice,
        asset.quantity,
        asset.currentValue,
        asset.profit,
        asset.profitPercentage / 100, // Excel percentage format
        asset.tag,
        asset.exchange
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(assetsData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 12 }, // Symbol
      { width: 12 }, // Investment
      { width: 12 }, // Current Price
      { width: 12 }, // Quantity
      { width: 12 }, // Current Value
      { width: 12 }, // Profit/Loss
      { width: 10 }, // Profit %
      { width: 12 }, // Category
      { width: 10 }  // Exchange
    ];
    
    // Format currency and percentage columns
    const currencyFormat = '#,##0.00_);[Red](#,##0.00)';
    const percentageFormat = '0.00%';
    
    // Apply formatting to data rows (skip header)
    for (let row = 2; row <= data.assets.length + 1; row++) {
      const cellB = `B${row}`; // Investment
      const cellC = `C${row}`; // Current Price
      const cellE = `E${row}`; // Current Value
      const cellF = `F${row}`; // Profit/Loss
      const cellG = `G${row}`; // Profit %
      
      if (worksheet[cellB]) worksheet[cellB].z = currencyFormat;
      if (worksheet[cellC]) worksheet[cellC].z = currencyFormat;
      if (worksheet[cellE]) worksheet[cellE].z = currencyFormat;
      if (worksheet[cellF]) worksheet[cellF].z = currencyFormat;
      if (worksheet[cellG]) worksheet[cellG].z = percentageFormat;
    }
    
    return worksheet;
  }

  private createCategoriesSheet(data: PortfolioExportData): XLSX.WorkSheet {
    const headers = [
      'Category', 'Investment', 'Current Value', 'Profit/Loss', 
      'Profit %', 'Asset Count', 'Allocation %'
    ];
    
    const categoriesData = [
      headers,
      ...data.categories.map(category => [
        category.tag,
        category.investment,
        category.currentValue,
        category.profit,
        category.profitPercentage / 100, // Excel percentage format
        category.assetCount,
        category.allocationPercentage / 100 // Excel percentage format
      ])
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(categoriesData);
    
    // Set column widths
    worksheet['!cols'] = [
      { width: 15 }, // Category
      { width: 12 }, // Investment
      { width: 12 }, // Current Value
      { width: 12 }, // Profit/Loss
      { width: 10 }, // Profit %
      { width: 12 }, // Asset Count
      { width: 12 }  // Allocation %
    ];
    
    // Format currency and percentage columns
    const currencyFormat = '#,##0.00_);[Red](#,##0.00)';
    const percentageFormat = '0.00%';
    
    // Apply formatting to data rows (skip header)
    for (let row = 2; row <= data.categories.length + 1; row++) {
      const cellB = `B${row}`; // Investment
      const cellC = `C${row}`; // Current Value
      const cellD = `D${row}`; // Profit/Loss
      const cellE = `E${row}`; // Profit %
      const cellG = `G${row}`; // Allocation %
      
      if (worksheet[cellB]) worksheet[cellB].z = currencyFormat;
      if (worksheet[cellC]) worksheet[cellC].z = currencyFormat;
      if (worksheet[cellD]) worksheet[cellD].z = currencyFormat;
      if (worksheet[cellE]) worksheet[cellE].z = percentageFormat;
      if (worksheet[cellG]) worksheet[cellG].z = percentageFormat;
    }
    
    return worksheet;
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