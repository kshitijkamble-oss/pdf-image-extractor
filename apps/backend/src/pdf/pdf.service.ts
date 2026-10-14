import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { ExtractedPhoto } from '@repo/shared';
import { extractImages } from './pdf-image-extractor.js';

@Injectable()
export class PdfService {
  async extract(buffer: Buffer): Promise<ExtractedPhoto[]> {
    const uploadId = randomUUID();
    const images = await extractImages(buffer, uploadId);

    return images.map((image) => ({
      pageNumber: image.pageNumber,
      imageUrl: image.imageUrl,
      caption: image.caption,
      description: image.caption,
    }));
  }
}
