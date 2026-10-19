# Brainstorm — page-drop-zone

_Entered 2026-10-19._

Options shown to the user 2026-10-19: (1) whole page is the drop zone + full-screen overlay, layout unchanged; (2) full-width header bar layout; (3) both; (4) big empty-state drop area that shrinks after extracting. **Chosen: 1** (user).

How (for the planner to firm up): move the drag handling from the panel `<section>` to the window — the `window` `dragover`/`drop` listeners from #44 already exist and only call `preventDefault`. Keep the drag counter and the "only file drags" check. Overlay: a fixed, full-viewport element shown while dragging, text "Drop your PDF to select it". The panel's own highlight goes away (the overlay replaces it).
