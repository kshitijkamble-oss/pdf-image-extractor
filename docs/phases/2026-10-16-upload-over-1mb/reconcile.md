# Reconcile — upload-over-1mb

_Entered 2026-10-16._

**Followed the plan:** brainstorm option 2 (browser uploads straight to Blob) shipped, with every safety point from brainstorm: PDF only, 20 MB cap, short-lived token, private store, `%PDF-` check, delete after extraction. Multipart route kept for local dev, 410 on Vercel. PR #26 merged as `9d31b5e`; issue #24 closed.

**Diverted, justified in-note:** prep assumed a read-write token for the PDF store. Connecting the store gave only OIDC vars, so implement stopped and went back to prep. The user chose option A (`issueSignedToken` + `handleUploadPresigned` + `uploadPresigned`), which was re-planned and built. Photos were pinned to `BLOB_READ_WRITE_TOKEN` so they can't land in the private store.

**Checked:** preview deployment `pdf-image-extractor-backend-coo3y97v4`, 0.29–19 MB PDFs → photos, all rejection cases (see implement). Production after merge: `/api/health` 200 and old `/api/pdf/upload` 410, so production runs the new code. A full upload on production was **not** re-run; the success line in ideate says "on production", so this stays an open gap until a production upload is done.

**Worth a rule (not written yet):** a Vercel store connection can give OIDC vars instead of a token, and `@vercel/blob` then prefers OIDC + `BLOB_STORE_ID` when no token is passed. Candidate rule: always pass the store's token or `storeId` explicitly when a project has more than one Blob store.

**Punted:** PDFs orphaned when the tab closes before extract — already added to b-20261014-011.

**Definition of done:** no per-item gates; universal gates met (lint + typecheck passed in implement; arc reconciled here; backlog flipped to done). Open caveat: the production upload check above.
