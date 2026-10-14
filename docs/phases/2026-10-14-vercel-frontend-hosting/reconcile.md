# Reconcile — vercel-frontend-hosting

_Entered 2026-10-14._

**Outcome:** the app is live at **https://pdf-image-extractor-web.vercel.app**: `/` serves the upload page (200), `/api/health` through it returns `{"status":"ok"}`, backend `https://pdf-image-extractor-two.vercel.app/api/health` still 200. On the PR #20 preview an upload from the page returned 201 and both Blob images loaded. PR #20 merged (`18a3ffe`); #13 closed by it.

**Followed the plan:** "config only, no app code change" held for both A and B. Prep's timing guard for shared project settings worked: settings were switched only for the test windows and reverted after each failure; production stayed 200 throughout.

**Diverted, and why:**
- **A (Vercel Services) dropped after two failed previews.** Prep assumed a `nestjs` service builds like the plain NestJS preset. It does not: Services routes Node backends to `@vercel/backends`, which (1) shipped `dist/main.js` without its `"type": "module"` marker, then, after `outputDirectory: "."`, (2) bundled from source and turned our `multer` import into a CJS shim the tracer did not follow. The user chose B instead of a third fix, because each fix re-opened packaging risks already settled in #10/#12. Recorded as prep revision 1 and the brainstorm re-decision.
- **B (second project):** new project `pdf-image-extractor-web` (root `apps/frontend`, Vite) with `apps/frontend/vercel.json` (turbo `--filter=frontend` so `@repo/shared` builds first; `/api/*` external rewrite). Prep revision 2.
- PR #19 merged while PR #20 was open → task-board conflict, resolved by merging `main` (second time this pattern hit).
- A mentee guessed the frontend was React Router; it had read an unrelated stale server on port 5173. Caught by checking `apps/frontend` before acting.

**Lessons (rule candidates — raise with the user):**
- Switching a Vercel project to another builder (preset, Services) re-opens every packaging fix proven under the old one; treat it as a new deploy target, not a config tweak.
- Project-wide Vercel settings apply to production too: change them only for a bounded test window, and revert on failure before investigating.

**Punted / known:**
- Frontend previews call the **production** backend; previews' uploads land in the production Blob store (b-20261014-011 covers cleanup). One test upload is there.
- The backend's own URL still shows `Cannot GET /` — expected; the app's address is the frontend project.
- Task-board conflicts between parallel PRs (second occurrence): one board file per arc is still a candidate.

**Definition of done (universal gates):** acceptance criteria met (preview: page, upload, health, logs; local dev checked in B1); lint and typecheck pass; backlog flipped to done; arc reconciled; activity entry added; no ADR or rule changed.