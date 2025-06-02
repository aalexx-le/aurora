import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExportService } from './export.service';

@Injectable()
export class ExportCleanupService {
  private readonly logger = new Logger(ExportCleanupService.name);

  constructor(private readonly exportService: ExportService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredFiles() {
    this.logger.log('Starting cleanup of expired export files...');
    try {
      await this.exportService.cleanupExpiredFiles();
      this.logger.log('Export files cleanup completed successfully');
    } catch (error) {
      this.logger.error('Failed to cleanup export files', error);
    }
  }
} 