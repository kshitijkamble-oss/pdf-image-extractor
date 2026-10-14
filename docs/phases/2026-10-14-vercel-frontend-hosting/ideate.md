# Ideate — vercel-frontend-hosting

_Entered 2026-10-14._

- **Problem:** the deployed app has no page. A person who opens the Vercel URL gets an error instead of the upload screen, so they cannot use the app at all. The backend works on Vercel; only the frontend is missing.
- **For whom:** anyone using the app in production. Locally nothing is wrong: Vite serves the page and proxies `/api` to the backend (`apps/frontend/vite.config.ts`).
- **Evidence (checked 2026-10-14, production `https://pdf-image-extractor-two.vercel.app`):** `GET /` returns 404 `Cannot GET /` (NestJS's not-found page); `GET /api/health` returns 200. The Vercel project deploys only `apps/backend`; `apps/frontend` is built nowhere.
- **Fact the fix must respect:** the frontend calls the API by a relative path, `fetch('/api/pdf/upload')` (`apps/frontend/src/api.ts:7`). It assumes the page and the API share one origin.
- **If we don't fix it:** the app is only usable by someone who clones the repo and runs it locally.
- **Success:** on the PR's Vercel preview, opening `/` shows the upload page; uploading a PDF with an image from that page shows the image; `/api/health` still returns 200; no error in `vercel logs` (rule `check-the-vercel-preview-before-merge`).