# Prep — bot-check

_Entered 2026-10-19._

Plan by planner 1, approved by the user 2026-10-19.

- Token travels in header `x-turnstile-token` on both routes.
- `TurnstileGuard` (new, `apps/backend/src/pdf/turnstile.guard.ts`): allow `blob.upload-completed` bodies (signed by Vercel) and blob-token bodies that are not `blob.generate-presigned-url` (the `{}` probe in `isClientUploadConfigured`); otherwise require a valid token via siteverify + hostname in `TURNSTILE_ALLOWED_HOSTNAMES`.
- Missing `TURNSTILE_SECRET_KEY` → 503 `TURNSTILE_NOT_CONFIGURED` (fail closed). Bad/missing token → 403 `BOT_CHECK_FAILED`.
- `upload`: `@UseGuards(MultipartUploadGuard, TurnstileGuard)`. `extract` stays open.
- Frontend: `apps/frontend/src/turnstile.ts`, explicit render, managed mode, fresh token per request; `VITE_TURNSTILE_SITE_KEY`.
- Allowed hostnames: production + Vercel previews (Cloudflare subdomain behaviour to be checked before setting).

Tasks: 1 guard · 2 apply guard · 3 widget + token helper · 4 send token from api.ts · 5 docs. Mentor: A Cloudflare widget · B Vercel env · C preview check · D local test keys · E bookkeeping.
