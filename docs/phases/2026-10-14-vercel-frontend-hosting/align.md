# Align — vercel-frontend-hosting

_Entered 2026-10-14._

**Green light**, plan OK'd by the user 2026-10-14.

- Brainstorm's "how" (Services, `/api` → backend, rest → frontend, no code change) lands in the `vercel.json` skeleton and tasks 1, 4.
- Acceptance criteria (`docs/acceptance-criteria.md`, b-20261014-010): `/` page, upload shows image, `/api/health` 200, clean logs → task 6; local `pnpm dev` → task 1.
- Boundary that can bite: shared project settings vs. `main` without `vercel.json` (window between tasks 4 and 7). Handled by holding merges and a rollback.
- Unknowns are build-time only (risks 1–7 in prep); the preview answers them, task 5 absorbs fixes.
**Align for option B** (2026-10-14): green light, plan OK'd by the user. Acceptance criteria map: `/` page, upload, `/api/health`, logs → B4; local dev → B1. User OK'd: project name `pdf-image-extractor-web`, creating + Git-connecting it after B1, and one test upload into the live Blob store.
