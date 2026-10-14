# Implement — pdf-image-extraction

_Reconstructed 2026-10-14 from the code in commit `226bf36`._

`POST /api/pdf/upload` takes a multipart field `file` (kept in memory, max 20 MB). pdfjs walks each page's operator list, tracks the transform matrix, and saves XObject and inline images as PNGs with sharp at `uploads/<uuid>/p<page>-<n>.png`. Images under 50 px, with no pixel data, or of an unsupported kind are skipped. Returns `ExtractedPhoto[]`; a missing file gives 400 `No file uploaded`. pdfjs is loaded through a dynamic import because it is ESM-only.

**Files:**

- `apps/backend/src/pdf/pdf.controller.ts`
- `apps/backend/src/pdf/pdf.service.ts`
- `apps/backend/src/pdf/pdf.module.ts`
- `apps/backend/src/pdf/pdf-image-extractor.ts`
- `apps/backend/src/pdf/pdfjs-loader.ts`
