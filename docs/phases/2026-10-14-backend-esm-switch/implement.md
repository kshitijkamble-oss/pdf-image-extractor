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
- **Vercel preview of PR #11 still 500s, with a new error.** `ERR_REQUIRE_ESM` is gone. Runtime log: `Cannot find module 'pdfjs-dist/package.json'` from `/var/task/apps/backend/src/pdf/pdf-image-extractor.js`. Locally the lookup works (pdfjs-dist 6.3.289 has no `exports` map). So the file is missing from the Vercel function bundle: Vercel only ships files it traces from the code, and it did not trace this one. Same `require.resolve` existed before the switch, so this bug was hidden behind the first crash. The `standard_fonts` folder it points at is a runtime path, so it is not traced either.
- Vercel docs (https://vercel.com/docs/project-configuration/vercel-json): `functions.<pattern>.includeFiles` is a glob of extra files to put in a function. Not yet checked: which pattern names the auto-detected NestJS function.
- User chose option 1: make the font path lazy and fault-tolerant (task 3c). No `vercel.json`.
- Task 3c (mentee 7): `getStandardFontDataUrl()` looks the path up on first use, caches it, and on failure logs one warning and passes no `standardFontDataUrl`. Local build starts; upload 201. Typecheck clean; mentor re-ran it.
- Vercel preview after 3c (deployment `Fo1MHV7…`): runtime log shows "Nest application successfully started"; `GET /api/health` → 200 `{"status":"ok"}`. **The crash from #10 is fixed.**
- Still broken on the preview: `POST /api/pdf/upload` with a 1-image PDF → 500 `Internal server error`. The log page shows 3 warnings but would not list them in the browser, so the cause is not confirmed. Likely suspect, not verified: `UPLOADS_ROOT` is under `process.cwd()`, and a Vercel function's own folder is read-only (only `/tmp` can be written). Another: pdfjs's `.mjs` file missing from the bundle.
- `GET /` → `Cannot GET /`: this Vercel project serves only the NestJS backend, not the frontend.
- PR #11 was merged (2026-10-14 11:23 UTC) before commit 3ea6771 (task 3c) was pushed, so `main` got only the ESM switch and production still crashed. #10 auto-closed; reopened. Task 3c cherry-picked onto `fix/vercel-font-path-lazy` for a follow-up PR.
- Punted to new backlog items: upload storage on Vercel (b-20261014-009, #12) and frontend hosting (b-20261014-010, #13).
