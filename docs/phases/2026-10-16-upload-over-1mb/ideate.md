# Ideate — upload-over-1mb

_Entered 2026-10-16._

- **Problem:** a user picks a normal 1.31 MB PDF and gets a raw Vercel error page. Most real PDFs with photos are over 1 MB, so the app is unusable for its main job.
- **Evidence (2026-10-16):** random-filled PDFs via `pdf-image-extractor-web` and `pdf-image-extractor-backend` — 0.29 MB and 0.9 MB → 201; 1.3, 2, 4 MB → 503 `SERVICE_UNAVAILABLE`; 5.5 MB → 413. `vercel logs --json` shows only the successful requests. Vercel status page: no incidents. Not `DEPLOYMENT_PAUSED` (small uploads work).
- **Unknown:** why the cut-off is ~1 MB. Vercel's Functions limits page documents 4.5 MB with a 413, not 1 MB with a 503.
- **Success:** a PDF up to 20 MB uploads and its photos come back, on production.
