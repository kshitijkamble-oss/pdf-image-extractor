# Prep — download-photo

_Entered 2026-10-16._

Plan from mentee 27 (planner). B = builder, M = mentor. Waiting for user OK.

1. B — add required `downloadUrl: string` to `ExtractedPhoto` (packages/shared). `storeImage` returns `{ imageUrl, downloadUrl }`: Blob → `put()`'s `url` + `downloadUrl` (`?download=1`, Content-Disposition attachment); local → both `/api/images/<id>/<name>.png`. Carry through `pdf-image-extractor.ts` and `pdf.service.ts` (both upload paths go through `extract()`).
2. B — frontend: `<a className="download-button" href={photo.downloadUrl} download={fileName}>Download</a>` per `.photo-card`. A plain link: no fetch, no re-encode. Locally same-origin via Vite proxy, so `download` works (MDN); on Vercel the header forces the save.
3. M — Vercel preview check: click Download → file saved, not opened; `content-disposition: attachment`; hash matches the stored PNG.

Verified this session: `@vercel/blob` installed types have `downloadUrl: string` on the put result (`dist/create-folder-BM6BTlko.d.ts:166`). Not verified: the exact file name Vercel puts in the header (task 3 will show).
