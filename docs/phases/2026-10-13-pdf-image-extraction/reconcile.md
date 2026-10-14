# Reconcile — pdf-image-extraction

_Entered 2026-10-14._

**Plan vs. outcome:** cannot be compared — no plan was recorded before the work was built.

**Gaps found in the code (2026-10-14):**

- File type is never checked; only a missing file is rejected (pdf.controller.ts:29).
- A malformed PDF is not mapped to a client error and surfaces as 500 (pdf-image-extractor.ts:227).
- Upload folder is created before parsing and uploads are never cleaned up (pdf-image-extractor.ts:222).
- Hard-coded: `UPLOADS_ROOT` from cwd (pdf.service.ts:7), `MAX_FILE_SIZE_BYTES` (pdf.controller.ts:13), `MIN_IMAGE_DIMENSION_PX` (pdf-image-extractor.ts:18).
- `description` is a copy of `caption` (pdf.service.ts:19).
- `resolvePdfObject` never rejects or times out (pdf-image-extractor.ts:84-86).
- XObject and inline-image branches are duplicated (pdf-image-extractor.ts:248-276).
- Image bounding box is computed but dropped from the response (pdf.service.ts:15-20).
- Transform matrix starts at identity and ignores the page viewport (pdf-image-extractor.ts:234).
- No tests.

**Definition of done:**

- `pnpm lint` and `pnpm typecheck` pass (run 2026-10-14).
- No acceptance criteria were recorded for this work.
- No tests exist.

**Follow-ups:** the gaps above are not yet backlog items.
