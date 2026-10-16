import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { put } from '@vercel/blob';

export const UPLOADS_ROOT = join(process.cwd(), 'uploads');

function imagesBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined;
}

export function usesBlobStorage(): boolean {
  return Boolean(imagesBlobToken());
}

export interface StoredImage {
  imageUrl: string;
  downloadUrl: string;
}

export async function storeImage(
  pathname: string,
  png: Buffer,
): Promise<StoredImage> {
  const token = imagesBlobToken();
  if (token) {
    // Without an explicit token, @vercel/blob prefers OIDC + BLOB_STORE_ID over
    // BLOB_READ_WRITE_TOKEN, which could send photos to another store.
    const blob = await put(pathname, png, {
      access: 'public',
      token,
      contentType: 'image/png',
    });
    return { imageUrl: blob.url, downloadUrl: blob.downloadUrl };
  }
  if (process.env.VERCEL) {
    throw new Error(
      'Vercel Blob store is not connected: BLOB_READ_WRITE_TOKEN is missing.',
    );
  }
  const filePath = join(UPLOADS_ROOT, pathname);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, png);
  const url = `/api/images/${pathname}`;
  return { imageUrl: url, downloadUrl: url };
}
