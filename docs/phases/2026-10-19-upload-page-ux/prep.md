# Prep — upload-page-ux

_Entered 2026-10-19._

Plan by planner 1. Three builder tasks, in order (all edit `apps/frontend/src/App.tsx` + `App.css`). Each ends with `pnpm --filter frontend typecheck` and `lint` passing.

1. **Upload panel + button text.** `<section className="upload-panel">` holds title, hint, file input, chosen file name, button. New `done` state: true after a successful upload, reset in `handleFileChange` and on a new submit. Button: "Extracting…" / "Extracted ✓" / "Extract photos"; disabled with no file, while loading, or when done.
2. **Drag-and-drop.** `dragging` state; panel `onDragEnter`/`onDragLeave` (drag counter ref to stop child-element flicker) for the highlight, only when `dataTransfer.types` has "Files"; `onDragOver` + `onDrop` call `preventDefault`. `window` `dragover`/`drop` listeners in a `useEffect` stop a missed drop from opening the PDF. A PDF drop (type `application/pdf` or `.pdf` name) goes through `handleFileChange`; anything else shows the error line.
3. **Status line.** `<p className="status">` above the grid when `done && !loading && !error`, using a `resultName` saved on success. Empty result (backend returns `[]`, not an error): "No photos found in <name>. This PDF has no embedded images — try another PDF." in a soft grey box (`.status.empty`), no grid, button stays disabled "Extracted ✓"; a new file clears it.

## Open questions — all proposed answers approved by user 2026-10-19

1. Plural: "Found 1 photo" / "Found 12 photos".
2. Non-PDF drop: error "Please drop a PDF file.", keep the current file and photos.
3. Several files dropped: take the first.
4. Extract fails: button back to enabled "Extract photos", error shown.
5. Native file input left as is; dropped file name shown separately (the input's own label may lag after a drop).
6. Only file drags highlight the panel.
