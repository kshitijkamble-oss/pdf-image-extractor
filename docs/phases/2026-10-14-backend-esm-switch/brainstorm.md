# Brainstorm — backend-esm-switch

_Entered 2026-10-14._

1. **Switch backend to ESM** — chosen by the user. Supported path in the NestJS migration guide (https://docs.nestjs.com/migration-guide): `"type": "module"`, tsconfig `module`/`moduleResolution` `nodenext`, `resolvePackageJsonExports: true`, `target: ES2023`, `.js` endings on relative imports, `import.meta.dirname` instead of `__dirname`.
2. **Pin NestJS to v11 (CommonJS)** — smaller change, but holds the project on an old major. Rejected.
3. **Stay CommonJS on v12 and rely on `require(esm)`** — the guide says this works on Node 20.19+/22.12+. Vercel already runs Node 24.x and it still fails; the stack goes through Vercel's own loader (`/opt/rust/nodejs.js`). Inferred, not verified, that this loader does not support `require(esm)`. Rejected because it already fails in prod.
