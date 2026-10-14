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