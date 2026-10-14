# Brainstorm — vercel-upload-storage

_Entered 2026-10-14._

**Worker (no real choice):** pdfjs's fake worker first checks `globalThis.pdfjsWorker?.WorkerMessageHandler` (pdf.js `src/display/api.js`; same code in installed 6.3.289 at `legacy/build/pdf.mjs:22948`). Setting `globalThis.pdfjsWorker = await import('pdfjs-dist/legacy/build/pdf.worker.mjs')` in `pdfjs-loader.ts` makes pdfjs skip the path lookup, and a literal `import()` is traceable by Vercel.

**Storage (user decides):**
1. **Inline data URLs** — return each PNG as `data:image/png;base64,...` in `imageUrl`. No storage, no new service, no frontend change (frontend only does `<img src={photo.imageUrl}>`). Limit: the 4.5 MB response cap, and base64 adds ~33%, so a PDF with many or large images fails.
2. **Vercel Blob (public store)** — `put()` from `@vercel/blob` per image, return the blob URL (https://vercel.com/docs/vercel-blob). Images persist and the response stays small. Needs a Blob store created and connected to the project, a new dependency, a local-dev story (`vercel env pull`, or keep disk locally), and images pile up unless cleaned.
3. **`/tmp` on the function** — writable, but files are not shared between instances, so the image link can 404. Rejected.

Not in scope either way: uploads over 4.5 MB are refused by Vercel before our code runs.

**Chosen (user, 2026-10-14): option 2, Vercel Blob (public store).** Pin `@vercel/blob@2.8.0` (2026-08-10); 2.8.2 was published the same day and 2.8.1 eight days earlier, too new to trust. SDK facts (https://vercel.com/docs/vercel-blob/using-blob-sdk): `put(pathname, body, { access, addRandomSuffix, contentType, token })` returns `{ url, downloadUrl, pathname, ... }`; credentials resolve explicit `token` → OIDC (`VERCEL_OIDC_TOKEN` + `BLOB_STORE_ID`, set automatically when a store is connected) → `BLOB_READ_WRITE_TOKEN` → error. Local dev: `vercel env pull`.
