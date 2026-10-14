# Reconcile — vercel-upload-storage

_Entered 2026-10-14._

**Outcome:** production `POST /api/pdf/upload` (1-image PDF) → 201 with a `public.blob.vercel-storage.com` URL that loads (200 `image/png`). Production logs: no ENOENT, no worker error. PR #17 merged; #12 closed.

**Followed the plan:** all four builder tasks and mentor steps A–C landed as prep described: worker preloaded via `globalThis.pdfjsWorker`; `image-storage.ts` with Blob on Vercel and disk locally; extractor encodes PNGs in memory; `main.ts` serves `uploads/` only in local mode. Frontend untouched, as the planner predicted.

**Diverted, and why:**
- Prep assumed connecting a store adds `BLOB_STORE_ID` (Vercel docs). It added only `BLOB_READ_WRITE_TOKEN`, so `usesBlobStorage()` checks that token. Found in step A, before task 2 was written.
- Task 4 ran as a mentor step, not a builder task, so no mentee had to read `.env.local`.
- PR #17 hit a conflict in `docs/task-board.md` after #15 merged; resolved by merging `main` into the branch (no code changed).

**Lessons:**
- The rules from the last arc held: the local run caught nothing new, and the preview check confirmed the worker is in the bundle. No new incident.
- `docs/task-board.md` is shared by every arc, so parallel PRs conflict there. Candidate fix: one board section file per arc. Not done; raise with the user.

**Punted:** Blob cleanup (b-20261014-011, #18). Uploads over 4.5 MB are refused by Vercel (out of scope; not filed). Known pdfjs warnings (`@napi-rs/canvas`, standard fonts) remain.

**Definition of done (universal gates):** lint and typecheck pass; backlog flipped to done; arc reconciled; activity entry added; no ADR or rule changed.
