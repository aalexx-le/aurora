"use client";

import { type PortfolioAnalyseData } from "@/app/(dashboard)/finance/investment/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ExportFormat, ExportService } from "@/lib/utils/export/export-service";
import { FileSpreadsheet, FileText, Table } from "lucide-react";
import { useState } from "react";
import { EXPORT_FORMATS } from "./export-constants";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analyseData: PortfolioAnalyseData[];
  portfolioId: string;
  portfolioName?: string;
  onClose: () => void;
}

const formatIcons = {
  FileText,
  Table,
  FileSpreadsheet
};

export function ExportDialog({
  open,
  onOpenChange,
  analyseData,
  portfolioId,
  portfolioName = "Portfolio",
  onClose
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(ExportFormat.Pdf);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
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
        selectedFormat,
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
          description: `Your ${selectedFormat} report has been downloaded.`,
        });

        onClose();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Portfolio Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Select Format</h4>
            <div className="space-y-2">
              {EXPORT_FORMATS.map((format) => {
                const IconComponent = formatIcons[format.icon as keyof typeof formatIcons];
                
                return (
                  <div
                    key={format.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedFormat === format.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{format.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format.fileSize}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 