import {
  BadRequestException,
  Body,
  CanActivate,
  Controller,
  Injectable,
  UseGuards,
  NotFoundException,
  PayloadTooLargeException,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { handleUploadPresigned, type HandleUploadPresignedBody } from '@vercel/blob/client';
import type { IncomingMessage } from 'node:http';
import { memoryStorage } from 'multer';
import type { ExtractedPhoto } from '@repo/shared';
import {
  MAX_PDF_BYTES,
  PdfBlobError,
  blobApi,
  isClientUploadConfigured,
  isValidPdfPathname,
  pdfCredentials,
  pdfWebhookPublicKey,
  resolveOidcToken,
} from './pdf-blob-storage.js';
import { PdfService } from './pdf.service.js';
import { TurnstileGuard } from './turnstile.guard.js';

function assertClientUploadConfigured(): void {
  if (!isClientUploadConfigured()) {
    throw new HttpException(
      {
        code: 'CLIENT_UPLOAD_NOT_CONFIGURED',
        message: 'PDF Blob store is not connected: BLOB_PDF_STORE_ID or BLOB_PDF_WEBHOOK_PUBLIC_KEY is missing.',
      },
      HttpStatus.NOT_IMPLEMENTED,
    );
  }
}

// Vercel cannot carry large request bodies to the function; clients use blob-token + extract there.
// A guard runs before interceptors, so multer never buffers the body.
@Injectable()
class MultipartUploadGuard implements CanActivate {
  canActivate(): boolean {
    if (process.env.VERCEL) {
      throw new HttpException(
        {
          code: 'MULTIPART_UPLOAD_DISABLED',
          message: 'Multipart upload is disabled here. Use client upload (blob-token + extract).',
        },
        HttpStatus.GONE,
      );
    }
    return true;
  }
}

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('blob-token')
  @UseGuards(TurnstileGuard)
  @HttpCode(HttpStatus.OK)
  async blobToken(
    @Req() req: IncomingMessage,
    @Body() body: HandleUploadPresignedBody,
  ): Promise<unknown> {
    assertClientUploadConfigured();
    const credentials = pdfCredentials(resolveOidcToken(req));
    try {
      return await handleUploadPresigned({
        request: req,
        body,
        webhookPublicKey: pdfWebhookPublicKey(),
        getSignedToken: async (pathname) => {
          if (!isValidPdfPathname(pathname)) {
            throw new Error('Invalid upload pathname');
          }
          const validUntil = Date.now() + 10 * 60 * 1000;
          const token = await blobApi.issueSignedToken({
            pathname,
            operations: ['put'],
            allowedContentTypes: ['application/pdf'],
            maximumSizeInBytes: MAX_PDF_BYTES,
            validUntil,
            ...credentials,
          });
          return {
            token,
            urlOptions: {
              allowedContentTypes: ['application/pdf'],
              maximumSizeInBytes: MAX_PDF_BYTES,
              validUntil,
              addRandomSuffix: true,
            },
          };
        },
      });
    } catch (err) {
      throw new BadRequestException(
        err instanceof Error ? err.message : 'Could not create upload token',
      );
    }
  }

  @Post('extract')
  @HttpCode(HttpStatus.OK)
  async extract(
    @Req() req: IncomingMessage,
    @Body() body: unknown,
  ): Promise<ExtractedPhoto[]> {
    assertClientUploadConfigured();
    const pathname =
      typeof body === 'object' && body !== null
        ? (body as { pathname?: unknown }).pathname
        : undefined;
    if (typeof pathname !== 'string' || !isValidPdfPathname(pathname)) {
      throw new BadRequestException('Invalid pathname');
    }
    try {
      return await this.pdfService.extractFromBlob(pathname, resolveOidcToken(req));
    } catch (err) {
      if (err instanceof PdfBlobError) {
        if (err.kind === 'not-found') throw new NotFoundException(err.message);
        if (err.kind === 'too-large') throw new PayloadTooLargeException(err.message);
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Post('upload')
  @UseGuards(MultipartUploadGuard, TurnstileGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_PDF_BYTES },
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
