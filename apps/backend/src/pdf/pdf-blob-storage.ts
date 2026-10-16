import { Logger } from '@nestjs/common';
import { BlobNotFoundError, del, get, issueSignedToken } from '@vercel/blob';
import type { IncomingMessage } from 'node:http';

export const PDF_UPLOAD_PREFIX = 'pdf-uploads/';
export const MAX_PDF_BYTES = 20 * 1024 * 1024;

const PDF_PATHNAME_PATTERN = /^pdf-uploads\/[A-Za-z0-9._-]+\.pdf$/;

export function pdfStoreId(): string | undefined {
  return process.env.BLOB_PDF_STORE_ID || undefined;
}

export function pdfWebhookPublicKey(): string | undefined {
  return process.env.BLOB_PDF_WEBHOOK_PUBLIC_KEY || undefined;
}

export function isClientUploadConfigured(): boolean {
  return Boolean(pdfStoreId() && pdfWebhookPublicKey());
}

export function resolveOidcToken(req: IncomingMessage): string | undefined {
  const header = req.headers['x-vercel-oidc-token'];
  const fromHeader = Array.isArray(header) ? header[0] : header;
  return fromHeader || process.env.VERCEL_OIDC_TOKEN || undefined;
}

// The PDF store has no read-write token. If the SDK gets no OIDC token it falls
// back to BLOB_READ_WRITE_TOKEN, which is the public images store, so a PDF
// call would silently hit the wrong store. Fail here instead, and never pass `token`.
export function pdfCredentials(oidcToken: string | undefined): {
  storeId: string;
  oidcToken: string;
} {
  const storeId = pdfStoreId();
  if (!storeId || !oidcToken) {
    throw new Error('OIDC token not available for the PDF store');
  }
  return { storeId, oidcToken };
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
export const blobApi = { get, del, issueSignedToken };

const logger = new Logger('PdfBlobStorage');

// Only ever pass a validated pathname here, never a URL: a URL would let the
// server fetch arbitrary hosts.
export async function readPdf(pathname: string, oidcToken: string | undefined): Promise<Buffer> {
  const credentials = pdfCredentials(oidcToken);
  let result;
  try {
    result = await blobApi.get(pathname, { access: 'private', ...credentials });
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

export async function deletePdf(pathname: string, oidcToken: string | undefined): Promise<void> {
  try {
    await blobApi.del(pathname, pdfCredentials(oidcToken));
  } catch (err) {
    logger.error(
      `Could not delete ${pathname}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
