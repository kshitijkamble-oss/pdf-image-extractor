# Ideate — vercel-upload-storage

_Entered 2026-10-14._

- **Problem:** uploading a PDF on the deployed app fails, so the app's one feature does not work in production.
- **Evidence (`vercel logs`, preview of #11):** `ENOENT: no such file or directory, mkdir '/var/task/uploads'` (the 500), and `Setting up fake worker failed: "Cannot find module '.../pdfjs-dist/legacy/build/pdf.worker.mjs'"` (unhandled rejection, process exits 128).
- **Constraints (Vercel docs, verified 2026-10-14):** request and response bodies are capped at **4.5 MB** (`413 FUNCTION_PAYLOAD_TOO_LARGE`) — https://vercel.com/docs/functions/limitations. Functions bundle only traced files; extra files via `includeFiles`.
- **Success:** on the PR preview, uploading a PDF with an image returns 201 and the image displays; no error in `vercel logs`.
