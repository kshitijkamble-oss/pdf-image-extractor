import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { IncomingHttpHeaders } from 'node:http';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const SITEVERIFY_TIMEOUT_MS = 5000;
const BLOB_TOKEN_PATH = '/blob-token';

interface SiteverifyResult {
  success: boolean;
  hostname?: string;
}

interface GuardRequest {
  body?: unknown;
  headers: IncomingHttpHeaders;
  url?: string;
}

function botCheckFailed(): HttpException {
  return new HttpException(
    {
      code: 'BOT_CHECK_FAILED',
      message: 'Bot check failed. Please reload the page and try again.',
    },
    HttpStatus.FORBIDDEN,
  );
}

function bodyType(body: unknown): unknown {
  return typeof body === 'object' && body !== null ? (body as { type?: unknown }).type : undefined;
}

function isBlobTokenRoute(url: string | undefined): boolean {
  const path = (url ?? '').split('?')[0].replace(/\/+$/, '');
  return path.endsWith(BLOB_TOKEN_PATH);
}

function parseSiteverify(data: unknown): SiteverifyResult | undefined {
  if (typeof data !== 'object' || data === null) return undefined;
  const { success, hostname } = data as { success?: unknown; hostname?: unknown };
  if (typeof success !== 'boolean') return undefined;
  return { success, hostname: typeof hostname === 'string' ? hostname : undefined };
}

async function verifyToken(secret: string, token: string): Promise<SiteverifyResult | undefined> {
  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    return parseSiteverify(await res.json());
  } catch {
    return undefined;
  }
}

function hostnameAllowed(hostname: string | undefined): boolean {
  const raw = process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  const allowed = (raw ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) {
    // Fail closed on Vercel; locally the hostname is whatever the dev server uses.
    return !process.env.VERCEL;
  }
  if (!hostname) return false;
  const host = hostname.toLowerCase();
  return allowed.some((entry) =>
    entry.startsWith('*.') ? host.endsWith(entry.slice(1)) : host === entry,
  );
}

@Injectable()
export class TurnstileGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<GuardRequest>();
    // On blob-token, only `blob.generate-presigned-url` issues a token. Other bodies are safe to skip:
    // `blob.upload-completed` is Vercel's signed callback (@vercel/blob checks the signature), and the
    // `{}` probe from isClientUploadConfigured() gets an error and issues no token.
    const onBlobToken = isBlobTokenRoute(req.url);
    if (onBlobToken && bodyType(req.body) !== 'blob.generate-presigned-url') return true;

    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      throw new HttpException(
        {
          code: 'TURNSTILE_NOT_CONFIGURED',
          message: 'Bot check is not configured: TURNSTILE_SECRET_KEY is missing.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    const header = req.headers['x-turnstile-token'];
    const token = Array.isArray(header) ? header[0] : header;
    if (!token) throw botCheckFailed();

    const result = await verifyToken(secret, token);
    if (!result?.success || !hostnameAllowed(result.hostname)) throw botCheckFailed();
    return true;
  }
}
