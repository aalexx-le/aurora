import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/exports')
export class ExportController {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'exports');

  @Get('download/:fileName')
  async downloadFile(@Param('fileName') fileName: string, @Res() res: Response) {
    // Validate file name to prevent directory traversal
    if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      throw new NotFoundException('File not found');
    }

    const filePath = path.join(this.uploadsDir, fileName);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Check if file is expired (older than 24 hours)
    const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
    if (ageInHours > 24) {
      // Delete expired file
      fs.unlinkSync(filePath);
      throw new NotFoundException('File has expired');
    }

    // Determine content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.csv':
        contentType = 'text/csv';
        break;
      case '.xlsx':
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
    }

    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', stats.size);

    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}