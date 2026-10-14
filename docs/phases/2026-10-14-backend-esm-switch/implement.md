# Implement — backend-esm-switch

_Entered 2026-10-14._

- Task 1 (mentee 3): ESM flip done. 11 relative import lines got `.js`, not 9 (the `import type` lines count too). Typecheck clean; mentor re-ran it.
- Task 3 (mentee 4): `new Function` helper gone; plain `import()` needed `as Promise<PdfJsModule>` because the `.mjs` subpath types have no `default`. Typecheck clean; mentor re-ran it.
- Task 4 (mentee 5), first run: build OK, dist is ESM, but startup crashed: `ReferenceError: require is not defined in ES module scope` at `pdf-image-extractor.js:9` — top-level `require.resolve('pdfjs-dist/package.json')` for `STANDARD_FONT_DATA_URL`.
- **Back to prep:** prep missed this. The planner grepped for `require(`, which does not match `require.resolve`. Typecheck passes over it because `@types/node` declares `require` as a global. Mentor re-grepped for `require|__dirname|__filename|module.exports|exports.`: this is the only hit. Added task 3b: use `createRequire(import.meta.url)`, as the NestJS migration guide says for code that still needs `require`.
- Task 3b (mentee 6): `const require = createRequire(import.meta.url)` added; built module imports cleanly. Typecheck clean; mentor re-ran it.
- Task 4 (mentee 5), rerun: fresh build starts ("Nest application successfully started"); upload of a 1-page PDF with a JPEG returned 201 with one image; the PNG URL served 200. pdfjs, sharp, and multer all ran.
- Task 2 skipped: `import { memoryStorage } from 'multer'` works under ESM at runtime.
- Mentor ran `pnpm -r lint` and `pnpm -r typecheck`: both clean.
- Still open: confirm on Vercel after merge.
