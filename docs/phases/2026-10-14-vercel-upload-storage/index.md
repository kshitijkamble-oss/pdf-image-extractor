---
topic: vercel-upload-storage
started: 2026-10-14
updated: 2026-10-14
backlog: b-20261014-009
status: done
---

# vercel-upload-storage

On Vercel, `POST /api/pdf/upload` returns 500. Two causes, both from `vercel logs`: the backend writes extracted images to `/var/task/uploads`, which a Vercel function cannot write; and pdfjs loads its worker (`pdf.worker.mjs`) by a runtime path that Vercel's bundle leaves out, which crashes the process. The app needs a way to return extracted images that works on serverless, and the worker must be in the bundle. GitHub issue #12.
