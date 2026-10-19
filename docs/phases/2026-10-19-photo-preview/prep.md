# Prep — photo-preview

_Entered 2026-10-19._

- State: `openIndex: number | null` in `App` (index, not object). Cleared in `handleFileChange`.
- Card `<img>` wrapped in `<button type="button" className="photo-open">`.
- One `<dialog className="photo-dialog">` with ref; `useEffect` calls `showModal()` / `close()`; `onClose` → `setOpenIndex(null)`.
- Inside: × (`aria-label="Close"`), large image (viewport-sized max), caption + page number, reused Download link, Previous / Next buttons (`aria-label`s, disabled at ends), Left/Right keys.
- Files: `apps/frontend/src/App.tsx`, `App.css`. Card layout and card Download link unchanged.
