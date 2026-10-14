import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { ExtractedPhoto } from '@repo/shared';
import { PdfService } from './pdf.service.js';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ExtractedPhoto[]> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.pdfService.extract(file.buffer);
  }
}
