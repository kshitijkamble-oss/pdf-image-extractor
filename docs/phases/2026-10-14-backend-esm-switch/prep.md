# Prep — backend-esm-switch

_Entered 2026-10-14._

Plan from mentee 2 (planner), approved by the user on 2026-10-14.

1. **ESM flip in one pass** — `apps/backend/package.json` gets `"type": "module"`; `apps/backend/tsconfig.json` gets `module`/`moduleResolution` `nodenext`, `resolvePackageJsonExports: true`, `target`/`lib` `ES2023`; `.js` on the 9 relative imports in `main.ts`, `app.module.ts`, `pdf/pdf.module.ts`, `pdf/pdf.controller.ts`, `pdf/pdf.service.ts`, `pdf/pdf-image-extractor.ts`. Check: `pnpm --filter backend typecheck`.
2. **multer import** — only if needed: `import multer from 'multer'` + `multer.memoryStorage()` in `pdf/pdf.controller.ts`.
3. **Drop the `new Function` import hack** in `pdf/pdfjs-loader.ts`; plain `import()`.
4. **Build and run** — delete `apps/backend/dist`, `pnpm --filter backend build`, `node dist/main.js`, then upload a small PDF to exercise multer, sharp, and pdfjs.

Boundaries: `@repo/shared` stays as is (types only, erased at build). No frontend changes. Vercel check happens after merge through a PR.

**Patch (2026-10-14, found in implement):** 3b. In `pdf/pdf-image-extractor.ts`, replace the top-level `require.resolve` with `createRequire(import.meta.url).resolve`. Prep missed it; see implement.md.
