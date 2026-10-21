---
topic: bot-check
started: 2026-10-19
updated: 2026-10-19
backlog: b-20261019-008
status: implement
---

# bot-check

The app has no login, so a script can call the backend and fill Vercel Blob storage with uploads. Only a human using the page should be able to upload. Add a Cloudflare Turnstile check that the backend verifies before it gives out an upload token (`/api/pdf/blob-token`) or takes an upload (`/api/pdf/upload`). Captcha only, no rate limit. Issue #50.
