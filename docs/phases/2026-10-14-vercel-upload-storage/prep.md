# Prep — vercel-upload-storage

_Entered 2026-10-14._

Plan from mentee 8 (planner), approved by the user on 2026-10-14. User answers: local dev writes to disk when no Blob credentials are set; mentor creates the store; a public store is fine.

1. **pdfjs worker** — `pdf/pdfjs-loader.ts`: `import('pdfjs-dist/legacy/build/pdf.worker.mjs')`, assign to `globalThis.pdfjsWorker` before pdfjs runs; typed without `any`.
2. **Storage module** — new `pdf/image-storage.ts`, `@vercel/blob@2.8.0` (exact). `storeImage(pathname, png): Promise<string>`; `usesBlobStorage()`. Blob: `put(pathname, png, { access: 'public', contentType: 'image/png' })` → `url`. Local: write under `UPLOADS_ROOT` → `/api/images/<pathname>`. **On Vercel (`process.env.VERCEL`) Blob is required**: if Blob credentials are missing, throw a clear "Blob store not connected" error instead of falling back to disk (mentor addition).
3. **Wire in** — `pdf-image-extractor.ts`: `.png().toBuffer()`, drop `mkdir`/`uploadsRoot`, one helper for the two duplicated save blocks; `pdf.service.ts` passes `imageUrl` through; `main.ts` calls `useStaticAssets` only when not using Blob.
4. **Blob-mode local run** — with pulled credentials, upload returns `*.public.blob.vercel-storage.com` URLs that load; nothing written to `uploads/`.

Mentor: (A) create a public Blob store, connect to `pdf-image-extractor` for Production and Preview, `vercel env pull`; (B) PR preview check; (C) backlog item for Blob cleanup.
