# Implement — monorepo-setup

_Reconstructed 2026-10-14 from the code in commit `226bf36`._

Root scripts `build`, `dev`, `lint`, `typecheck` run `turbo run <task>`. In `turbo.json`, build, lint and typecheck depend on `^build`; `dev` is uncached and persistent. The workspace covers `apps/*` and `packages/*`. `.gitignore` ignores node_modules, dist, .turbo and uploads.

**Files:**

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `.gitignore`
