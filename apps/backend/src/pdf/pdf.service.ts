import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import type { ExtractedPhoto } from '@repo/shared';
import { extractImages } from './pdf-image-extractor.js';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

@Injectable()
export class PdfService {
  async extract(buffer: Buffer): Promise<ExtractedPhoto[]> {
    const uploadId = randomUUID();
    const images = await extractImages(buffer, uploadId, UPLOADS_ROOT);

    return images.map((image) => ({
      pageNumber: image.pageNumber,
      imageUrl: `/api/images/${image.imageUrl}`,
      caption: image.caption,
      description: image.caption,
    }));
  }
}
