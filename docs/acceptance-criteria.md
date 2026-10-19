# Acceptance criteria

One section per open backlog item, keyed by id. Definition of Done is the companion
file — [definition-of-done.md](definition-of-done.md).

**AC answers "did we build the right thing." DoD answers "is it shippable."**
An item is finished only when both pass.

## How to read this

- **Satisfies** — the behaviour this item must deliver, stated so a reviewer can check it.
- **Blocked by** — an unanswered `question` or unrun `spike`. A live blocker means the item
  cannot start, not that it ships with a caveat.

---

<!-- items below this line -->

## b-20261014-010 — vercel-frontend-hosting

**Satisfies**
- On the PR's Vercel preview, `GET /` shows the upload page (not `Cannot GET /`).
- From that page, uploading a PDF with an image shows the extracted image.
- `GET /api/health` still returns 200.
- No error for these requests in `vercel logs`.
- Local dev (`pnpm dev`) still works as before.

**Blocked by** — none.

## b-20261019-005 — upload-page-ux

**Satisfies**
- Title, hint, file picker, chosen file name and main button sit in one centered upload panel.
- Dropping a PDF on the panel selects it like the file picker does; the panel highlights during a file drag; a non-PDF drop shows "Please drop a PDF file." and keeps the current file; a PDF dropped outside the panel does not open in the tab.
- Button reads "Extract photos" (disabled with no file), "Extracting…" while working, disabled "Extracted ✓" after success, and "Extract photos" again after a new file or a failed extract.
- After success: "Found 1 photo in <name>" / "Found N photos in <name>" above the grid; an empty result shows the "No photos found … no embedded images" box and no grid.
- Photo grid, card click and preview pop-up still work.

**Blocked by** — none.


## b-20261019-006 — page-drop-zone

**Satisfies**
- Dropping a PDF on the upload panel, the photo grid or blank page space selects it; extraction does not start.
- A full-screen "Drop your PDF to select it" overlay shows during a file drag over the window and goes away on drop or when the drag leaves the window.
- Dragging non-file content (selected text) shows no overlay.
- #44 behaviour kept: non-PDF drop shows "Please drop a PDF file." and keeps the current file; a PDF drop empties the native picker; nothing opens in the tab.
- Photo grid, card click and preview pop-up still work.

**Blocked by** — none.
