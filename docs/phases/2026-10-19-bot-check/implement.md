# Implement — bot-check

_Entered 2026-10-19._

## Tasks
1. `TurnstileGuard` (builder 1). One fix round: the `blob.upload-completed` skip applied on every route, so a JSON POST to `/upload` could skip the check. Now both skips apply only on blob-token. Checked in @vercel/blob 2.8.0 that `handleUploadPresigned` issues something only for `blob.generate-presigned-url`; other types throw "Invalid event type".
2. Guard on `blob-token` and `upload` (builder 2). Local: `{}` probe 501, no token 403, test token passes, upload 403 → 201 with token, no secret 503.
3. `turnstile.ts` widget helper (builder 3): explicit render, `appearance: 'interaction-only'`, new widget per call, 60 s timeout. Added `vite-env.d.ts`, `apps/frontend/.env.example`, `!.env.example` in root `.gitignore`.
4. `api.ts` sends `x-turnstile-token` (builder 4). @vercel/blob `headers` reach only the handleUploadUrl POST, not the Blob PUT.
5. Docs: this file (no env-var doc in the repo; STATE.md is generated).

## Env vars
| Name | Project | Value |
|------|---------|-------|
| `VITE_TURNSTILE_SITE_KEY` | frontend (build time) | Turnstile site key; local test key `1x00000000000000000000AA` |
| `TURNSTILE_SECRET_KEY` | backend | Turnstile secret; local test secret `1x0000000000000000000000000000000AA`. Missing → 503 `TURNSTILE_NOT_CONFIGURED` |
| `TURNSTILE_ALLOWED_HOSTNAMES` | backend | comma list, `*.x` suffix match. Unset → skipped locally, rejected on Vercel |

Test keys: https://developers.cloudflare.com/turnstile/troubleshooting/testing/
6. Clear message when the presigned-URL request fails (builder 5): matches the exact `Vercel Blob: Failed to retrieve the presigned URL` text, because `@vercel/blob/client` does not export `BlobError`.

## Checks
- Local browser check (headless Chrome over CDP, test keys, multipart path because Blob env is not set locally): 5/5. The Turnstile script loads, the upload carries `x-turnstile-token`, the `{}` probe carries none, the page shows "Found 2 photos in test.pdf", and no widget container is left behind.
- Not yet run: client-upload (Blob) path end to end, a real (non-test) Turnstile key, Vercel preview.
