# Ideate — backend-esm-switch

_Entered 2026-10-14._

- **Problem:** every request to the deployed app fails with `500 FUNCTION_INVOCATION_FAILED`. Builds say "Ready", so the failure only shows at runtime.
- **Evidence:** Vercel runtime logs (16:17–16:25): `Error [ERR_REQUIRE_ESM]: require() of ES Module .../@nestjs/core/index.js from /var/task/apps/backend/src/main.js not supported.`
- **Cause:** `apps/backend/tsconfig.json` has `"module": "CommonJS"`; installed `@nestjs/core@12.1.0` has `"type": "module"`.
- **Success:** the deployed site loads, and the backend starts locally (`pnpm --filter backend build` + `start`) with no module errors.
