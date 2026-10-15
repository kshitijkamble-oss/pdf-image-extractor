---
topic: vercel-frontend-hosting
started: 2026-10-14
updated: 2026-10-14
backlog: b-20261014-010
status: done
---

# vercel-frontend-hosting

On Vercel, `GET /` returns `Cannot GET /`. The Vercel project `pdf-image-extractor` deploys only the NestJS backend, so the React app in `apps/frontend` is not hosted anywhere and users cannot reach the upload page. The frontend needs a home on Vercel and a way to reach the backend API. GitHub issue #13.