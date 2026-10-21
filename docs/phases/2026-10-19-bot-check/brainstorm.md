# Brainstorm — bot-check

_Entered 2026-10-19._

Candidates (checked against official docs on 2026-10-19):

1. **Cloudflare Turnstile** — chosen. Runs on any host; free plan has unlimited checks (20 widgets, 10 hostnames each); mostly invisible. Server check: `POST https://challenges.cloudflare.com/turnstile/v0/siteverify` with `secret` + `response`. Tokens last 300 s and are single-use; check `hostname` in the reply ourselves.
2. **Vercel BotID** — invisible, basic tier free. Rejected: docs only show same-project setups (Next.js/Nuxt/SvelteKit); ours is a Vite page whose `vercel.json` rewrites `/api/*` to a separate NestJS project. Not documented whether classification survives that rewrite.
3. **hCaptcha** — similar flow. Rejected: docs unclear on puzzles for free users, and ask for the visitor IP.

Scope note: protect both `/api/pdf/blob-token` and `/api/pdf/upload` (`apps/backend/src/pdf/pdf.controller.ts`), else bots use the unprotected one.

Sources: vercel.com/docs/botid/get-started, vercel.com/kb/guide/vercel-botid-vs-cloudflare-turnstile, developers.cloudflare.com/turnstile/get-started/server-side-validation/, developers.cloudflare.com/turnstile/plans/, docs.hcaptcha.com
