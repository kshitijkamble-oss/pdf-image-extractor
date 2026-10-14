# Brainstorm — vercel-frontend-hosting

_Entered 2026-10-14._

## Where we start (checked 2026-10-14)

- Vercel project `pdf-image-extractor`: **Root Directory `apps/backend`**, **Framework Preset NestJS** (`vercel project inspect`). So Vercel only ever sees the backend folder.
- No `vercel.json` anywhere in the repo.
- Frontend calls `fetch('/api/pdf/upload')`; backend uses `app.setGlobalPrefix('api')` (`apps/backend/src/main.ts`). Both assume one origin.

## Candidate directions

### A. One project, Vercel Services (frontend + backend side by side)
A root `vercel.json` with a `services` key: `frontend` (root `apps/frontend/`) and `backend` (root `apps/backend/`), plus top-level rewrites `/api/(.*)` → backend, `/(.*)` → frontend.
- **For:** one domain, so the relative `/api` call and the backend's `api` prefix keep working unchanged ("The service receives the original request path. `GET /api/users` reaches `my_backend` as `/api/users`"). Front and back deploy together, so each PR preview tests both (rule `check-the-vercel-preview-before-merge`). Vercel's own guide recommends this case: "When you want them on a single domain, deployed together, and able to call each other without CORS, use Services."
- **Against:** Services is **Beta**. The project's Root Directory must move to the repo root and the Framework Preset to "Services" (a dashboard/CLI setting change). Vercel's examples don't show NestJS + Vite together, and the backend depends on the workspace package `@repo/shared`, so the build may need tuning.

### B. Second Vercel project for the frontend, proxy `/api` to the backend
New project, root `apps/frontend`, Vite preset, with `apps/frontend/vercel.json` rewriting `/api/:path*` to `https://pdf-image-extractor-two.vercel.app/api/:path*`.
- **For:** no Beta feature; frontend code unchanged; backend project untouched.
- **Against:** two projects to manage. A frontend preview proxies to the **production** backend, not the PR's backend, so one preview can't test a change that touches both. Rewrite caching rules for external origins apply.

### C. Second project, frontend calls the backend's full URL (CORS)
Frontend reads the API address from `VITE_API_URL`; backend turns on CORS.
- **Against:** code changes on both sides, a cross-origin setup to keep right, same preview problem as B. No gain over B here.

### D. Contrarian: the backend serves the built frontend
NestJS serves `apps/frontend/dist` as static files (like it serves `uploads/` locally).
- **For:** no new Vercel features or projects.
- **Against:** every page and JS/CSS file goes through the backend function instead of Vercel's CDN; the frontend build has to be packed into the backend function (the same kind of bundling problem as the pdfjs worker in #12); mixes two apps into one.

## References
- https://vercel.com/docs/services · https://vercel.com/docs/services/routing · https://vercel.com/docs/services/config-reference
- https://vercel.com/kb/guide/structure-your-application
- https://vercel.com/docs/routing/rewrites (external rewrites, option B)
- https://vercel.com/docs/frameworks/backend/nestjs

## Chosen

**A — Vercel Services**, chosen by the user 2026-10-14. Reason: one domain keeps the relative `/api` call working with no code change, and front + back deploy together so a PR preview tests the whole app. Accepted risk: Services is Beta. Fallback if Services can't build this monorepo: B.
## Re-decision — 2026-10-14

**Switched to B**, chosen by the user after A failed twice on the preview (see implement.md tasks 4, 4c). Reason: under Services the backend is packed by a different builder (`@vercel/backends`), so every packaging fix from #10/#12 has to be re-proven and new gaps keep appearing (ESM marker, then `multer`). B leaves the proven backend project untouched.

B facts (checked 2026-10-14):
- Monorepo docs (https://vercel.com/docs/monorepos): one Vercel project per app directory, each with its own Root Directory; every commit deploys each connected project; unchanged projects are skipped automatically (pnpm workspaces).
- External rewrites (https://vercel.com/docs/routing/rewrites): `{ "source": "/api/:path*", "destination": "https://api.example.com/:path*" }` in the frontend project's `vercel.json`. New projects honor upstream cache headers by default.
- CLI 63.1.2 has `vercel project create <name>`, `vercel project update --root-directory --framework`, `vercel git connect --project`, `vercel link --project`.
- Known trade-off: the frontend's previews call the **production** backend. "Related Projects" could point previews at backend previews, but the backend previews sit behind Vercel login, so it is not used here.