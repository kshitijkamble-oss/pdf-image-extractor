# PDF Image Extractor

Upload a PDF, get back the photos inside it, and download each one.

## Live app

https://pdf-image-extractor-frontend.vercel.app

Uploads need to pass a Cloudflare Turnstile bot check. PDFs can be up to 20 MB.

## Run it on your computer

You need a recent Node LTS and pnpm. The repo pins pnpm 11.23.0.

```
pnpm install
pnpm dev
```

`pnpm dev` starts the React frontend (Vite) and the NestJS backend together. The backend listens on port 3000, or on `PORT` if you set it. Vite sends calls to `/api` to the backend. Open the address that Vite prints.

Other commands: `pnpm build`, `pnpm lint`, `pnpm typecheck`.

When the `VERCEL` setting is not present (and no `BLOB_READ_WRITE_TOKEN` is set), the backend saves extracted images in an `uploads` folder on your computer.

## Settings

Only the names are listed here. Never commit real values.

Frontend: copy `apps/frontend/.env.example` to `apps/frontend/.env.local`.

- `VITE_TURNSTILE_SITE_KEY`

Backend:

- `TURNSTILE_SECRET_KEY`
- `TURNSTILE_ALLOWED_HOSTNAMES`
- `BLOB_READ_WRITE_TOKEN`
- `BLOB_PDF_STORE_ID`
- `BLOB_PDF_WEBHOOK_PUBLIC_KEY`

If `TURNSTILE_SECRET_KEY` is missing, the backend does not skip the bot check. It rejects uploads with a 503 error saying the bot check is not configured. So set it, even when running locally.

## What is in the repo

- `apps/frontend` - the website (React and Vite).
- `apps/backend` - the API (NestJS) that finds and extracts the images.
- `packages/shared` - types used by both apps.
- `docs/` - backlog, task board, decisions, and phase notes.
- `.claude/` - the Claude Code agent setup.

## Hosting

There are two Vercel projects, one for the frontend and one for the backend. The frontend forwards `/api` calls to the backend (see `apps/frontend/vercel.json`).

## About

This is a learning project for trying out Claude Code subagents.
