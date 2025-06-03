"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ExportFormat } from "@/lib/utils/export/export-service";
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2, Settings, Table } from "lucide-react";
import { EXPORT_FORMATS } from "./export-constants";

interface ExportDropdownProps {
  onQuickExport: (format: ExportFormat) => void;
  onMoreOptions: () => void;
  isExporting: boolean;
  className?: string;
}

const formatIcons = {
  FileText,
  Table,
  FileSpreadsheet
};

export function ExportDropdown({
  onQuickExport,
  onMoreOptions,
  isExporting,
  className
}: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("gap-2", className)}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {EXPORT_FORMATS.map((format) => {
          const IconComponent = formatIcons[format.icon as keyof typeof formatIcons];
          
          return (
            <DropdownMenuItem
              key={format.id}
              onClick={() => onQuickExport(format.id)}
              disabled={isExporting}
              className="flex items-center gap-3 p-3"
            >
              <IconComponent className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="font-medium">{format.title}</span>
                <span className="text-xs text-muted-foreground">
                  {format.fileSize}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={onMoreOptions}
          disabled={isExporting}
          className="flex items-center gap-3 p-3"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">More Options</span>
            <span className="text-xs text-muted-foreground">
              Advanced export settings
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 