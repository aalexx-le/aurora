import { Module } from "@nestjs/common";
import { ExportCleanupService } from "./export-cleanup.service";
import { ExportController } from "./export.controller";
import { ExportResolver } from "./export.resolver";
import { ExportService } from "./export.service";
import { CsvExportService } from "./services/csv-export.service";
import { ExcelExportService } from "./services/excel-export.service";
import { PdfExportService } from "./services/pdf-export.service";

@Module({
    controllers: [ExportController],
    providers: [
        ExportService,
        ExportResolver,
        ExportCleanupService,
        PdfExportService,
        CsvExportService,
        ExcelExportService,
    ],
    exports: [ExportService],
})
export class ExportModule {}
