import { ExportFormat } from "@/lib/utils/export/export-service";

export interface ExportFormatConfig {
    id: ExportFormat;
    title: string;
    description: string;
    icon: string;
    fileSize: string;
}

export const EXPORT_FORMATS: ExportFormatConfig[] = [
    {
        id: ExportFormat.Pdf,
        title: "PDF Report",
        description: "Professional report with charts and tables",
        icon: "FileText",
        fileSize: "~500KB",
    },
    {
        id: ExportFormat.Csv,
        title: "CSV Data",
        description: "Raw data for spreadsheet applications",
        icon: "Table",
        fileSize: "~50KB",
    },
    {
        id: ExportFormat.Excel,
        title: "Excel Workbook",
        description: "Formatted workbook with multiple sheets",
        icon: "FileSpreadsheet",
        fileSize: "~200KB",
    },
];
