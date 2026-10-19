# Align — modern-look

_Entered 2026-10-19._

- Every acceptance criterion for b-20261019-007 lands in a task: theme → 1; header, drop area, file row, keyboard access, phone row → 2; cards, buttons, status, dialog, overlay, phone grid → 3; "behaviour still works" → each task's do-not list plus the browser check.
- Risk: task 2 moves the file input into a `<label>`; the drop code clears it through `fileInputRef`, so the ref must stay on the input.
- Risk: the headless check script finds elements by class (`.upload-panel button`, `.file-name`, `.upload-hint`); the mentor updates the script, not the app, where markup changes.

**Green light.**
