# Prep — page-drop-zone

_Entered 2026-10-19._

Plan by planner 1.

**Choice:** window listeners, not a wrapper element — `<main>` is only as tall as its content, so blank space below it would not take a drop; the #44 window listeners already exist.

1. **Move drag handling to the window + overlay** (`App.tsx`, `App.css`). Drop the section's four drag handlers and `.upload-panel.dragging`. One `useEffect` registers window `dragenter`/`dragleave`/`dragover`/`drop` (file drags only, drag counter kept, cleaned up on unmount); drop applies the #44 rules (first file; PDF → clear picker + select; else "Please drop a PDF file."). `hasFiles` becomes module-level on `globalThis.DragEvent`. Overlay `<div className="drop-overlay" aria-hidden="true">` while dragging: `position: fixed; inset: 0`, dark translucent, white text, **`pointer-events: none`** so the overlay never becomes the drag target (no flicker, drops reach the page).
2. **Optional hardening** — only if "drag in and out of the window" leaves the overlay stuck: also treat `dragleave` with `relatedTarget === null` as leaving the window.

Browser checks: drop on blank space / panel / a photo card; non-PDF drop; drag in and out of the window repeatedly; text drag shows no overlay; picker reset after a drop.

## Open questions — answered by user 2026-10-19

1. Preview pop-up open → ignore the drag (no overlay, no file change), but still `preventDefault` so the PDF doesn't open in the tab.
2. Hint becomes "Drop a PDF anywhere or choose one".
3. Several files → first one (default, as #44).
4. Overlay: dark translucent with large white text (matches the dialog backdrop).
5. Overlay `aria-hidden` (default; it only shows during a mouse drag).
