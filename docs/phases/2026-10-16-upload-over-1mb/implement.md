# Implement — upload-over-1mb

_Entered 2026-10-16._

Tasks 1–4 built (mentees 19–22), committed `1ac15ea`, PR #26.

**Prep was wrong — stopped before the preview check.** Connecting the private store `pdf-image-extractor-pdfs` (`store_cgXsdS3m49WFT6Gk`) did not create a read-write token. Vercel added only OIDC-style vars: first unprefixed `BLOB_STORE_ID` + `BLOB_WEBHOOK_PUBLIC_KEY` (danger: `@vercel/blob` 2.8.0 prefers OIDC + `BLOB_STORE_ID` over `BLOB_READ_WRITE_TOKEN` when no token is passed — `dist/chunk-YYMLUMXS.js` 169–202 — so photo uploads would have gone to the private store); after the user reconnected with prefix `BLOB_PDF`: `BLOB_PDF_STORE_ID` + `BLOB_PDF_WEBHOOK_PUBLIC_KEY`. No `BLOB_PDF_READ_WRITE_TOKEN`, which `handleUpload` needs.

Vercel's newer path works with OIDC: `issueSignedToken` + `handleUploadPresigned` on the server, `uploadPresigned` in the browser (https://vercel.com/docs/vercel-blob/vercel-signed-urls). All three exist in 2.8.0's types; `get`/`del` accept `storeId`. Waiting for the user to choose.
User chose option A (presigned + OIDC) on 2026-10-16. Re-planning (mentee 23).
Plan A approved 2026-10-16: OIDC missing → clear 500; single PUT unless preview shows 20 MB fails; PDF store stays off in Development.
Option A built 2026-10-16 (mentees 24–26). Whole-repo typecheck, lint, build pass. Env vars now: `BLOB_PDF_STORE_ID`, `BLOB_PDF_WEBHOOK_PUBLIC_KEY` (no read-write token); photos pinned to `BLOB_READ_WRITE_TOKEN`. Open for preview: OIDC token reachable in Nest; signed scope vs random suffix; 20 MB single PUT.
