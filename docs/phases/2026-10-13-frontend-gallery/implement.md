# Implement — frontend-gallery

_Reconstructed 2026-10-14 from the code in commit `226bf36`._

Page "PDF Photo Extractor" with a `.pdf` file input and a Submit button (disabled with "Extracting…" while loading). Posts to `/api/pdf/upload` and shows a grid of cards: image, page number, caption, and description when it differs from the caption. Errors show the server `message` or the status text. Vite proxies `/api` to localhost:3000 in dev.

**Files:**

- `apps/frontend/src/App.tsx`
- `apps/frontend/src/api.ts`
- `apps/frontend/src/main.tsx`
- `apps/frontend/src/App.css`
- `apps/frontend/src/index.css`
- `apps/frontend/index.html`
- `apps/frontend/vite.config.ts`
- `apps/frontend/.oxlintrc.json`
