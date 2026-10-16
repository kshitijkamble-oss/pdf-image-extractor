# Prep — download-button-alignment

_Entered 2026-10-16._

Plan from planner 1, patched by the mentor, approved by the user 2026-10-16:

1. `builder 1` — `apps/frontend/src/App.css` only: `.photo-card` → `display: flex; flex-direction: column; align-items: flex-start` (flex-start so images and text keep their own width instead of stretching); `.download-button` → `margin-top: auto` (replaces `8px`; the `<p>` before it always gives ~1em gap); `.photo-card p + p { margin-top: 0 }` to keep the collapsed 1em gap between texts. Checks: `pnpm typecheck`, `pnpm lint`.
2. Mentor — visual check in the browser (buttons aligned bottom-left per row, spacing and photo sizes unchanged), then PR closing #33.
