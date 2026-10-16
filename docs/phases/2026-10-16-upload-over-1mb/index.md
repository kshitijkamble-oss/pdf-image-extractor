---
topic: upload-over-1mb
started: 2026-10-16
updated: 2026-10-16
backlog: b-20261016-001
status: implement
---

# upload-over-1mb

On Vercel, `POST /api/pdf/upload` fails for any PDF over about 1 MB with `503 SERVICE_UNAVAILABLE` ("The deployment is currently unavailable"), and over 4.5 MB with `413 FUNCTION_PAYLOAD_TOO_LARGE`. The app promises 20 MB. The failing requests never reach the backend function: they leave no runtime logs. The same happens via the frontend's `/api` rewrite and directly on the backend domain. GitHub issue #24.
