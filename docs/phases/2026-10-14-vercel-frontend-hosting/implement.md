# Implement — vercel-frontend-hosting

_Entered 2026-10-14._

- **Task 1** (mentee 13): `vercel.json` added as drafted. Local lint/typecheck/build pass; `pnpm dev` page and `/api/health` via proxy return 200. The mentee guessed the frontend was React Router — wrong: it read a stale, unrelated server on port 5173; `apps/frontend` is plain Vite + React. Slugs `vite`, `nestjs` (and `services`) confirmed in `vercel/vercel` `packages/frameworks/src/frameworks.ts`.
- **Task 2** skipped: local `vercel build` reads the current project settings (root `apps/backend`) and would not see the root `vercel.json`.
- **Task 3**: PR #20 opened. User OK'd the settings change.
- **Task 4**: `vercel project update --auto-detect root-directory --framework services --yes`; inspect shows Root Directory `.`, preset Services. PR #19 was merged (19:13:10 IST) right around the change; its production deploy is healthy (`/api/health` 200). Redeployed PR #20 preview `pdf-image-extractor-6mokw190i`: build green — turbo ran `frontend` and `backend` with `@repo/shared`, so risks 1–3 (install/workspace/slugs) are answered. **Runtime failed:** `/` shows the upload page, but every backend call is 500 `FUNCTION_INVOCATION_FAILED`. Log: `Failed to load the ES module: /var/task/main.js. Make sure to set \"type\": \"module\" in the nearest package.json` → `SyntaxError: Cannot use import statement outside a module`. Under Services the backend's `dist/main.js` lands at the function root without its `package.json` `type: module` marker. Not a guessable `vercel.json` tweak → back to prep.
- **Task 4a** settings reverted (root `apps/backend`, preset NestJS); production `/api/health` 200.
- **Task 4b** (mentee 14) research → prep revision 1.
- **Task 5** (mentee 15): backend service gets `entrypoint: src/main.ts` and `outputDirectory: .`.
- **Task 5a** local check: `vercel pull` (preview), local `.vercel/project.json` settings switched to Services (no remote change), `vercel build`. Log: `Using src/main.ts as the root entrypoint`. Function handler `apps/backend/src/main.mjs`; each module emitted as `.mjs`; `design:paramtypes` metadata kept; `pdf.worker.mjs` traced; `@nestjs/core` etc. in `filePathMap` under `apps/backend/node_modules`. `sharp` was the win32 build (local Windows) — only the preview can prove the Linux one. Local settings copy restored; `.vercel/output` and `.vercel/.env.preview.local` deleted.
- **Task 4c**: user OK'd; settings → Services; preview `pdf-image-extractor-mu8p6o9u8` (commit `d49b5fd`). ESM error gone, new crash on every request: `Cannot find module 'multer' Require stack: - /var/task/apps/backend/package.json`. The bundle turns our `multer` import into a CommonJS shim (`require_backend_multer`, seen in the local build), which the file tracer does not follow, so `multer` is not shipped. Settings reverted again; production `/api/health` 200. Second failure of this task → stop and ask the user.

### Option B

- **B1** (mentee 17): `apps/frontend/vercel.json` added, root `vercel.json` deleted. From a clean state, `cd ../.. && pnpm turbo run build --filter=frontend` builds `@repo/shared` then `frontend`; `pnpm dev` page and proxy 200.
- **B2**: `vercel project create pdf-image-extractor-web`; `project update --root-directory apps/frontend --framework vite`; `git connect` to the same repo. Backend project inspect identical before/after.
