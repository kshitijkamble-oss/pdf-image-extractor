# Prep — upload-over-1mb

_Entered 2026-10-16._

Plan from mentee 18 (planner), approved by the user 2026-10-16. B = builder, M = mentor.

1. B — `POST /api/pdf/blob-token`: `handleUpload` with the PDF store's token. PDF only, 20 MB, `validUntil` now + 10 min, random suffix, pathname forced to `pdf-uploads/*.pdf`. No token → 501 `CLIENT_UPLOAD_NOT_CONFIGURED`. New file `apps/backend/src/pdf/pdf-blob-storage.ts`.
2. B — `POST /api/pdf/extract` `{ pathname }`: validate pathname (regex, never a URL), `get(pathname, { access: 'private', token })`, size cap 20 MB, `%PDF-` check, extract, `del` in `finally`. 400 / 404 / 413 errors.
3. B — old multipart `POST /api/pdf/upload` returns 404/410 when `VERCEL` is set; unchanged locally.
4. B — frontend `uploadPdf`: `upload()` from `@vercel/blob/client` (private) → `/api/pdf/extract`; on 501 fall back to multipart.
5. M — create private Blob store, connect to `pdf-image-extractor-backend` as `BLOB_PDF_READ_WRITE_TOKEN` (Preview + Production).
6. M — preview check: 0.9/1.3/4/5.5/~19 MB → photos; 21 MB, fake PDF, URL pathname → rejected; old route 404/410 on Vercel; private store empty after.

User answers: keep multipart fallback for local dev; orphaned PDFs (tab closed before extract) accepted for now, noted on b-20261014-011; token lifetime 10 minutes.

No test framework in the repo, so checks are scripted runs, not unit tests.
