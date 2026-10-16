import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ExtractedPhoto } from '@repo/shared';
import { deletePdf, readPdf, PdfBlobError } from './pdf-blob-storage.js';
import { extractImages } from './pdf-image-extractor.js';

@Injectable()
export class PdfService {
  async extract(buffer: Buffer): Promise<ExtractedPhoto[]> {
    const uploadId = randomUUID();
    const images = await extractImages(buffer, uploadId);

    return images.map((image) => ({
      pageNumber: image.pageNumber,
      imageUrl: image.imageUrl,
      downloadUrl: image.downloadUrl,
      caption: image.caption,
      description: image.caption,
    }));
  }

  async extractFromBlob(
    pathname: string,
    oidcToken: string | undefined,
  ): Promise<ExtractedPhoto[]> {
    try {
      const buffer = await readPdf(pathname, oidcToken);
      if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
        throw new PdfBlobError('not-pdf', 'File is not a PDF');
      }
      return await this.extract(buffer);
    } finally {
      await deletePdf(pathname, oidcToken);
    }
  }
}
