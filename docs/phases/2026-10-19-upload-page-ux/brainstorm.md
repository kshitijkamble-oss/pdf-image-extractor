# Brainstorm — upload-page-ux

_Entered 2026-10-19._

All changes live in `apps/frontend/src/App.tsx` and `App.css`. No backend change.

## Drag-and-drop

- **A. Native HTML drag events** — cancel `dragover` and handle `drop` on the panel, read `dataTransfer.files`; also cancel file drops on `window` so a missed drop doesn't open the PDF in the tab. Use `dragenter`/`dragleave` for the "drag over" highlight (`dragstart`/`dragend` don't fire for OS files). Source: [MDN — File drag and drop](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop).
- **B. `react-dropzone`** — less hand-written code, but a new dependency for one drop zone.

**Chosen: A** (user, 2026-10-19). Small, no new package, MDN covers the edge cases.

Detail: a dropped file that isn't a PDF is rejected with the existing error line, since `accept=".pdf"` only filters the file dialog, not drops.

## When extraction starts

- **A. Wait for the button** (today's behaviour). **B. Extract on drop/pick.**

**Chosen: A** (user). Lets the user see the file name before extracting.

## Button text (#32)

| State | Text | Enabled |
|---|---|---|
| no file | Extract photos | no |
| file chosen | Extract photos | yes |
| extracting | Extracting… | no |
| done | Extracted ✓ | no |
| new file chosen | Extract photos | yes |

Alternatives turned down: "Extract another PDF" (opens the picker), hiding the button. **Chosen:** disabled "Extracted ✓" (user).

## Upload panel

One bordered, centered box at the top: title, hint ("Drop a PDF here or choose one"), file picker, chosen file name, button. The panel is the drop zone and highlights while a file is dragged over it.

## Status line

Above the grid after a successful extract: "Found N photo(s) in <file name>", or "No photos found in <file name>" when the list is empty. Hidden while extracting and on error. Today an empty result shows nothing at all.
