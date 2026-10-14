# Implement — vercel-frontend-hosting

_Entered 2026-10-14._

- **Task 1** (mentee 13): `vercel.json` added as drafted. Local lint/typecheck/build pass; `pnpm dev` page and `/api/health` via proxy return 200. The mentee guessed the frontend was React Router — wrong: it read a stale, unrelated server on port 5173; `apps/frontend` is plain Vite + React. Slugs `vite`, `nestjs` (and `services`) confirmed in `vercel/vercel` `packages/frameworks/src/frameworks.ts`.
- **Task 2** skipped: local `vercel build` reads the current project settings (root `apps/backend`) and would not see the root `vercel.json`.
