import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ExportData, ExportOptions, ExportProgressCallback } from "./types";

export async function exportToPdf(
    data: ExportData,
    options: ExportOptions = {},
    onProgress?: ExportProgressCallback,
): Promise<void> {
    try {
        onProgress?.({
            stage: "Initializing PDF",
            progress: 10,
            message: "Setting up PDF document...",
        });

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        onProgress?.({
            stage: "Adding header",
            progress: 20,
            message: "Creating document header...",
        });

        // Add header
        yPosition = addHeader(pdf, data, yPosition, pageWidth, margin);

        onProgress?.({
            stage: "Adding summary",
            progress: 40,
            message: "Adding portfolio summary...",
        });

        // Add portfolio summary
        if (options.includeSummary !== false) {
            yPosition = addPortfolioSummary(
                pdf,
                data,
                yPosition,
                pageWidth,
                margin,
                pageHeight,
            );
        }

        onProgress?.({
            stage: "Adding assets table",
            progress: 60,
            message: "Creating assets breakdown...",
        });

        // Add assets table
        yPosition = addAssetsTable(
            pdf,
            data,
            yPosition,
            pageWidth,
            margin,
            pageHeight,
        );

        onProgress?.({
            stage: "Adding categories",
            progress: 80,
            message: "Adding categories summary...",
        });

        // Add categories summary
        yPosition = addCategoriesTable(
            pdf,
            data,
            yPosition,
            pageWidth,
            margin,
            pageHeight,
        );

        onProgress?.({
            stage: "Finalizing PDF",
            progress: 90,
            message: "Generating PDF file...",
        });

        // Add footer
        addFooter(pdf, pageWidth, pageHeight, margin);

        // Save the PDF
        const fileName = generateFileName(data.summary.portfolioName);

        onProgress?.({
            stage: "Downloading",
            progress: 100,
            message: "Download starting...",
        });

        pdf.save(fileName);
    } catch (error) {
        console.error("PDF export failed:", error);
        throw new Error("Failed to export PDF file");
    }
}

function addHeader(
    pdf: jsPDF,
    data: ExportData,
    yPosition: number,
    pageWidth: number,
    margin: number,
): number {
    // Title
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text("Aurora - Portfolio Analysis Report", margin, yPosition);
    yPosition += 10;

    // Portfolio name
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Portfolio: ${data.summary.portfolioName}`, margin, yPosition);
    yPosition += 8;

    // Generation date
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, yPosition);
    yPosition += 15;

    // Reset text color
    pdf.setTextColor(0);

    return yPosition;
}

function addPortfolioSummary(
    pdf: jsPDF,
    data: ExportData,
    yPosition: number,
    pageWidth: number,
    margin: number,
    pageHeight: number,
): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
    }

    // Section title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Portfolio Summary", margin, yPosition);
    yPosition += 10;

    // Summary data
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const summaryItems = [
        ["Total Value:", formatCurrency(data.summary.totalValue)],
        ["Total Investment:", formatCurrency(data.summary.totalInvestment)],
        ["Total Profit:", formatCurrency(data.summary.totalProfit)],
        ["Profit Percentage:", formatPercentage(data.summary.profitPercentage)],
        ["Number of Assets:", data.summary.assetCount.toString()],
        ["Last Updated:", new Date(data.summary.lastUpdated).toLocaleString()],
    ];

    summaryItems.forEach(([label, value]) => {
        pdf.text(label, margin, yPosition);
        pdf.text(value, margin + 50, yPosition);
        yPosition += 6;
    });

    yPosition += 10;
    return yPosition;
}

function addAssetsTable(
    pdf: jsPDF,
    data: ExportData,
    yPosition: number,
    pageWidth: number,
    margin: number,
    pageHeight: number,
): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = margin;
    }

    // Section title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Assets Breakdown", margin, yPosition);
    yPosition += 10;

    // Table headers
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");

    const headers = [
        "Symbol",
        "Name",
        "Value",
        "Investment",
        "Profit",
        "Profit %",
    ];
    const colWidths = [20, 40, 25, 25, 25, 20];
    let xPosition = margin;

    headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
    });

    yPosition += 8;

    // Table data
    pdf.setFont("helvetica", "normal");

    data.assets.slice(0, 20).forEach((asset) => {
        // Limit to first 20 assets for PDF
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;

            // Re-add headers on new page
            pdf.setFont("helvetica", "bold");
            xPosition = margin;
            headers.forEach((header, index) => {
                pdf.text(header, xPosition, yPosition);
                xPosition += colWidths[index];
            });
            yPosition += 8;
            pdf.setFont("helvetica", "normal");
        }

        xPosition = margin;
        const rowData = [
            asset.symbol,
            asset.name.length > 15
                ? asset.name.substring(0, 15) + "..."
                : asset.name,
            formatCurrency(asset.value),
            formatCurrency(asset.investment),
            formatCurrency(asset.profit),
            formatPercentage(asset.profitPercentage),
        ];

        rowData.forEach((cell, index) => {
            pdf.text(cell, xPosition, yPosition);
            xPosition += colWidths[index];
        });

        yPosition += 6;
    });

    if (data.assets.length > 20) {
        yPosition += 5;
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(
            `... and ${data.assets.length - 20} more assets`,
            margin,
            yPosition,
        );
        pdf.setTextColor(0);
        pdf.setFontSize(10);
    }

    yPosition += 15;
    return yPosition;
}

function addCategoriesTable(
    pdf: jsPDF,
    data: ExportData,
    yPosition: number,
    pageWidth: number,
    margin: number,
    pageHeight: number,
): number {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
    }

    // Section title
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Categories Summary", margin, yPosition);
    yPosition += 10;

    // Table headers
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");

    const headers = [
        "Category",
        "Value",
        "Investment",
        "Profit",
        "Assets",
        "Portfolio %",
    ];
    const colWidths = [35, 25, 25, 25, 15, 20];
    let xPosition = margin;

    headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
    });

    yPosition += 8;

    // Table data
    pdf.setFont("helvetica", "normal");

    data.categories.forEach((category) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin;

            // Re-add headers on new page
            pdf.setFont("helvetica", "bold");
            xPosition = margin;
            headers.forEach((header, index) => {
                pdf.text(header, xPosition, yPosition);
                xPosition += colWidths[index];
            });
            yPosition += 8;
            pdf.setFont("helvetica", "normal");
        }

        xPosition = margin;
        const rowData = [
            category.name.length > 20
                ? category.name.substring(0, 20) + "..."
                : category.name,
            formatCurrency(category.totalValue),
            formatCurrency(category.totalInvestment),
            formatCurrency(category.totalProfit),
            category.assetCount.toString(),
            formatPercentage(category.percentage),
        ];

        rowData.forEach((cell, index) => {
            pdf.text(cell, xPosition, yPosition);
            xPosition += colWidths[index];
        });

        yPosition += 6;
    });

    return yPosition;
}

function addFooter(
    pdf: jsPDF,
    pageWidth: number,
    pageHeight: number,
    margin: number,
): void {
    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100);

        // Page number
        pdf.text(
            `Page ${i} of ${pageCount}`,
            pageWidth - margin - 20,
            pageHeight - 10,
        );

        // Footer text
        pdf.text(
            "Generated by Aurora",
            margin,
            pageHeight - 10,
        );
    }

    pdf.setTextColor(0);
}

// Helper functions
function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

function formatPercentage(value: number): string {
    return `${value.toFixed(2)}%`;
}

function generateFileName(portfolioName: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    const sanitizedName = portfolioName.replace(/[^a-zA-Z0-9]/g, "_");
    return `${sanitizedName}_analysis_${timestamp}.pdf`;
}

// Chart capture functionality (for future enhancement)
export async function captureChartAsImage(
    chartElement: HTMLElement,
): Promise<string> {
    try {
        const canvas = await html2canvas(chartElement, {
            backgroundColor: "#ffffff",
            scale: 2,
            logging: false,
        });
        return canvas.toDataURL("image/png");
    } catch (error) {
        console.error("Failed to capture chart:", error);
        return "";
    }
}
