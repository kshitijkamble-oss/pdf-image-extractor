# Implement — caption-detection

_Reconstructed 2026-10-14 from the code in commit `226bf36`._

Text items are grouped into lines (2 pt y tolerance). For each image, the nearest horizontally overlapping line within 40 pt below the image is picked, then above. Lines starting with figure / fig. / photo / image / plate are preferred. No match gives an empty caption.

**Files:**

- `apps/backend/src/pdf/caption.util.ts`
- `apps/backend/src/pdf/pdf-image-extractor.ts (lines 151-204)`
