import { Logger } from '@nestjs/common';
import { BlobNotFoundError, del, get } from '@vercel/blob';

export const PDF_UPLOAD_PREFIX = 'pdf-uploads/';
export const MAX_PDF_BYTES = 20 * 1024 * 1024;

const PDF_PATHNAME_PATTERN = /^pdf-uploads\/[A-Za-z0-9._-]+\.pdf$/;

// Separate private store. Never fall back to BLOB_READ_WRITE_TOKEN: that is the
// public images store, and PDFs must not land there.
export function pdfBlobToken(): string | undefined {
  return process.env.BLOB_PDF_READ_WRITE_TOKEN || undefined;
}

export function isClientUploadConfigured(): boolean {
  return Boolean(pdfBlobToken());
}

export function isValidPdfPathname(p: string): boolean {
  return PDF_PATHNAME_PATTERN.test(p) && !p.includes('..');
}

export type PdfBlobErrorKind = 'not-found' | 'too-large' | 'not-pdf';

export class PdfBlobError extends Error {
  constructor(readonly kind: PdfBlobErrorKind, message: string) {
    super(message);
  }
}

// Seam so checks can swap the Vercel calls without a network.
export const blobApi = { get, del };

const logger = new Logger('PdfBlobStorage');

// Only ever pass a validated pathname here, never a URL: a URL would let the
// server fetch arbitrary hosts.
export async function readPdf(pathname: string): Promise<Buffer> {
  let result;
  try {
    result = await blobApi.get(pathname, { access: 'private', token: pdfBlobToken() });
  } catch (err) {
    if (err instanceof BlobNotFoundError) {
      throw new PdfBlobError('not-found', 'PDF not found');
    }
    throw err;
  }
  if (!result || result.statusCode !== 200) {
    throw new PdfBlobError('not-found', 'PDF not found');
  }
  if (result.blob.size > MAX_PDF_BYTES) {
    throw new PdfBlobError('too-large', 'PDF is too large');
  }

  const reader = result.stream.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_PDF_BYTES) {
      await reader.cancel();
      throw new PdfBlobError('too-large', 'PDF is too large');
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks, total);
}

export async function deletePdf(pathname: string): Promise<void> {
  try {
    await blobApi.del(pathname, { token: pdfBlobToken() });
  } catch (err) {
    logger.error(
      `Could not delete ${pathname}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
