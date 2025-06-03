"use client";

import { type PortfolioAnalyseData } from "@/app/(dashboard)/finance/investment/types";
import { toast } from "@/hooks/use-toast";
import { ExportFormat, ExportService } from "@/lib/utils/export/export-service";
import { useState } from "react";
import { ExportDialog } from "./ExportDialog";
import { ExportDropdown } from "./ExportDropdown";

interface ExportButtonProps {
  analyseData: PortfolioAnalyseData[];
  portfolioId: string;
  portfolioName?: string;
  className?: string;
}

export function ExportButton({
  analyseData,
  portfolioId,
  portfolioName = "Portfolio",
  className
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleQuickExport = async (format: ExportFormat) => {
    try {
      setIsExporting(true);

      // Validate data before export
      const validation = ExportService.validateExportData(analyseData);
      if (!validation.isValid) {
        toast({
          title: "Export Failed",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      // Export using frontend service
      const result = await ExportService.exportPortfolio(
        analyseData,
        format,
        {
          includeCharts: true,
          includeSummary: true,
          portfolioName
        },
        (progress) => {
          // Optional: Could show progress in UI
          console.log(`Export progress: ${progress.progress}% - ${progress.message}`);
        }
      );

      if (result.success) {
        toast({
          title: "Export Successful",
          description: `Your ${format} report has been downloaded.`,
        });
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Unable to export your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleMoreOptions = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setIsExporting(false);
  };

  return (
    <>
      <ExportDropdown
        onQuickExport={handleQuickExport}
        onMoreOptions={handleMoreOptions}
        isExporting={isExporting}
        className={className}
      />

      <ExportDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        analyseData={analyseData}
        portfolioId={portfolioId}
        portfolioName={portfolioName}
        onClose={handleDialogClose}
      />
    </>
  );
} 