---
id: check-the-vercel-preview-before-merge
scope: infra
title: Check the PR's Vercel preview before calling a backend change done — a clean local run does not prove the deploy runs
priority: must
appliesToKeywords:
  - vercel
  - deploy
  - deployment
  - preview
  - production
  - serverless
  - merge
  - pull request
  - require.resolve
  - process.cwd
created: 2026-10-14
---

**Why:** Found 2026-10-14 (#10, #12). The backend started and handled uploads locally, but on Vercel it crashed with `Cannot find module 'pdfjs-dist/package.json'`, then with a missing `pdf.worker.mjs`, then failed to `mkdir '/var/task/uploads'`. Vercel does not upload all of `node_modules`; it bundles only the files it can trace from the code. A path built at runtime is invisible to that trace. And the function's own folder cannot be written. None of this shows up on a dev machine.

For any change to `apps/backend` (or anything else Vercel deploys), before saying it is done or asking the user to merge:

1. Wait for the PR's Vercel preview: `gh pr checks <n> --watch`.
2. Hit the preview: `/api/health`, plus one real request that runs the changed code. The preview sits behind Vercel login, so use the logged-in Chrome tab, not `curl`.
3. Read that deployment's runtime logs: `vercel logs --project pdf-image-extractor-backend --scope team-tobu --branch <branch> --expand`.
4. Report what the preview did. If it fails, the PR is not ready, however clean the local run was.

Red flags in a diff: `require.resolve`, a file path built at runtime, a worker or asset loaded by path, and writes under `process.cwd()` or `__dirname`.
