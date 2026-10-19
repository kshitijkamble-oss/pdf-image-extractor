# Prep — modern-look

_Entered 2026-10-19._

Plan by planner 1. Three builder tasks, in order. None of them changes handlers, state, effects, refs, the button label logic, or the class names the code uses (`photo-card`, `photo-open`, `download-button`, `photo-dialog*`, `drop-overlay`, `status`, `status.empty`, `error`, `page-number`, `caption`, `description`).

1. **Tokens + light/dark theme + base styles** (`index.css`, `App.css`). Tokens `--bg --surface --surface-muted --text --text-muted --border --accent --accent-hover --accent-soft --on-accent --danger --shadow --radius --radius-sm`; dark overrides with a lighter blue; `box-sizing`, `:focus-visible` ring; replace every hard-coded color; theme the dialog. No layout change, no JSX change.
2. **Header + upload area** (`App.tsx` JSX in the return, `App.css`). `<header className="app-header">` with h1 + tagline; `.upload-panel` card holding `.drop-area` (inline SVG icon, "Drop a PDF anywhere, or", `<label className="choose-button">` wrapping the visually hidden input — same ref/accept/onChange); `.file-row` with the file name or "No file chosen" and the Extract button (`primary-button`). Phone layout at ≤600px.
3. **Polish** (`App.css`, CSS only): status line, empty box, error, photo cards (shadow, hover lift, tidy thumbnails), Download buttons, dialog buttons, overlay; phone grid and dialog sizing.

Open questions — answered by the user 2026-10-19: "No file chosen" placeholder; no drop-area highlight; centered header. Answered by the mentor: no frontend tests exist, so none depends on the old text; no newer CSS; task 3 CSS only; exact blue left to the builder (lighter blue in dark mode).
