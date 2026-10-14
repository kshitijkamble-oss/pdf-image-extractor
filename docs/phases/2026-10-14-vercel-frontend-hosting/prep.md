# Prep — vercel-frontend-hosting

_Entered 2026-10-14._

Plan by `mentee 12` (planner); build facts re-checked by the mentor against `package.json`, `turbo.json`, `pnpm-workspace.yaml`. **Config only, no app code change**: the backend already serves `/api/...` (its own `api` prefix), the frontend calls `/api/...` by a relative path, and the frontend has no client-side routing, so no SPA fallback.

## Skeleton — draft `vercel.json` (repo root)

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "frontend": { "root": "apps/frontend", "framework": "vite" },
    "backend":  { "root": "apps/backend",  "framework": "nestjs" }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": { "service": "backend" } },
    { "source": "/(.*)", "destination": { "service": "frontend" } }
  ]
}
```

`/api/` comes first (first match wins). No build keys at the top level (not allowed with `services`). Commands, `outputDirectory` and `entrypoint` are left out on purpose, so the first preview shows what auto-detect does.

## Settings change (mentor, needs user OK at the time)

Root Directory `apps/backend` → repo root; Framework Preset `NestJS` → `Services`. These settings are shared by production and previews. `main` has no `vercel.json`, so **from the change until the PR is merged, a production deploy would likely fail** — no other merges to `main` in that window. Rollback: set both back and redeploy.

## Tasks

1. **[builder]** Add `vercel.json` as drafted. Check: valid JSON; `pnpm lint`, `pnpm typecheck`, `pnpm build` pass; `pnpm dev` still serves the page and `/api/health`.
2. **[mentor, optional]** Try `vercel build` locally to catch config errors early. Skip if the CLI can't do it without the new settings.
3. **[mentor]** Push the branch, open the PR. Ask the user to OK the settings change.
4. **[mentor]** Change the two settings, redeploy the PR preview, read the build log. If it fails and the fix is more than a small `vercel.json` edit, revert the settings.
5. **[builder, only if 4 failed]** Fix `vercel.json` from the build log (likely: per-service `installCommand`/`buildCommand` such as `pnpm turbo run build --filter=<app>...` so `@repo/shared` is built first, `outputDirectory: dist`, backend `entrypoint`).
6. **[mentor]** Preview check (rule `check-the-vercel-preview-before-merge`): `/` shows upload page; upload from the page shows the Blob image; `/api/health` 200; `vercel logs` clean.
7. **[user merges, mentor checks]** After the user merges, check production `/` and `/api/health`; then reconcile.

## Risks the preview must answer

1. Does a service with `root: apps/<app>` install the pnpm workspace and link `@repo/shared`?
2. Is `@repo/shared` built before each app builds?
3. Are the slugs `vite` / `nestjs` accepted; is Vite's `dist` picked up?
4. Does the backend see `/api/health` (not `/api/api/health`)?
5. Do `sharp` and `pdfjs-dist` still work in the backend function (real upload)?
6. Is `BLOB_READ_WRITE_TOKEN` passed to the backend service?
7. Services is Beta: behaviour may differ from the docs. Fallback: option B.
## Prep revision 1 — 2026-10-14 (after task 4 failed)

**What prep got wrong:** it assumed the `nestjs` service builds the way the plain NestJS preset does. It does not. Research by `mentee 14` (local Vercel CLI 63.1.2 builder source; the mentor re-read `@vercel/backends/dist/index.mjs` ~1736–1770):
- Plain preset → `@vercel/nestjs` → `@vercel/node` compiles `src/main.ts`. Works.
- Services → every Node backend goes to `@vercel/backends`. After `nest build` it finds `dist/main.js` and copies `dist/**` to the function root, so `/var/task/main.js` has no `package.json` with `"type": "module"` next to it → loaded as CommonJS → crash.
- When the service's `outputDirectory` resolves to the service folder itself, that "use built output" step is skipped and the builder bundles from source (rolldown), picking ESM from `"type": "module"` and writing `.mjs`, which always loads as ESM.

**Revised skeleton** — backend service only:

```json
"backend": { "root": "apps/backend", "framework": "nestjs", "entrypoint": "src/main.ts", "outputDirectory": "." }
```

Confidence: medium-high from source, not yet seen on a deploy. Vercel's servers may run a newer builder.

**New risks:**
8. The backend is now bundled by rolldown, not traced by `@vercel/node`. The #10/#12 fixes (pdfjs worker preload, lazy font path, `sharp` native binary) were proven under the old packaging and must be re-proven with a real upload.
9. Decorator metadata: rolldown uses `tsconfig` (`experimentalDecorators`, `emitDecoratorMetadata`); if it is lost, Nest dependency injection fails at startup.

**Fallbacks if A fails:** R1 — write `dist/package.json` `{"type":"module"}` at build (risk: `@nestjs/core` may not resolve from the function root under pnpm); then option B from brainstorm.
## Prep revision 2 — option B (2026-10-14)

Plan by `mentee 16` (planner); the `@repo/shared` claim re-checked by the mentor (`packages/shared/package.json` points `main`/`types` at `dist/`; the frontend imports types from it, so `tsc -b` needs it built first).

**Skeleton — `apps/frontend/vercel.json`** (new); root `vercel.json` (Services) deleted:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=frontend",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://pdf-image-extractor-two.vercel.app/api/:path*" }
  ]
}
```

No SPA catch-all (one page; it would swallow `/api`). No cache headers unless the preview shows a need.

**New Vercel project:** `pdf-image-extractor-web`, team `team-tobu`, Root Directory `apps/frontend`, preset Vite, Git-connected to the same repo. Backend project unchanged.

**Tasks**
1. [builder] Add `apps/frontend/vercel.json`, delete root `vercel.json`. Check: JSON parses; lint, typecheck, root build pass; the exact `buildCommand` run from `apps/frontend` builds `dist/index.html`; `pnpm dev` + proxy still work.
2. [mentor, user OK] Create the project, set root + preset, connect Git. Backend `vercel project inspect` unchanged before/after.
3. [mentor] Push; wait for the frontend preview build.
4. [mentor] Preview check: `/` page; `/api/health` via frontend URL 200; upload from page shows image; logs clean in both projects; production backend `/api/health` 200.
5. [builder, only if 4 fails] Fix repo config; repeat 3–4.
6. [builder] Docs: record the two-project setup; nothing still says Services is current.
7. [mentor] Final check on the last commit; user merges; check the frontend project's production URL.

**Risks:** `@repo/shared` build on Vercel; multipart POST through the rewrite; CDN caching of `/api`; body size / timeouts over two hops; frontend previews behind Vercel login; **preview uploads go to the production backend and production Blob store**; both projects build on each push.