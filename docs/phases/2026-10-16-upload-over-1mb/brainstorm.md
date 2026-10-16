# Brainstorm — upload-over-1mb

_Entered 2026-10-16._

1. **Find and fix the ~1 MB cause** in how Vercel runs the NestJS backend. Cause unknown, not in the docs. Even if fixed, the hard 4.5 MB function body limit stays, so the 20 MB promise stays broken.
2. **Client upload to Vercel Blob (chosen by user, 2026-10-16).** The browser gets a short-lived token from the backend (`handleUpload` from `@vercel/blob/client`), uploads the PDF straight to Blob, then sends the backend only the blob's URL/pathname. Vercel's own recommended way past the body limit. Fixes both the 1 MB and 4.5 MB failures.

Safety, because the app has no login (login is b-20261016-002, #25, deferred):
- Token: `allowedContentTypes: ['application/pdf']`, `maximumSizeInBytes` 20 MB, short `validUntil` (default 1 h).
- PDFs go to a **private** store, separate from the public images store.
- Backend checks the file really is a PDF (content type is client-declared).
- Backend deletes the PDF after extraction.

Note from the docs: `handleUpload` needs `BLOB_READ_WRITE_TOKEN` (not OIDC) to generate client tokens.

References: https://vercel.com/docs/vercel-blob/client-upload · https://vercel.com/docs/vercel-blob/security · https://vercel.com/docs/vercel-blob/using-blob-sdk · https://vercel.com/docs/functions/limitations
