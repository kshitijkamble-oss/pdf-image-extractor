# Implement — page-drop-zone

_Entered 2026-10-19._

- Task 1 (builder 1): drag handling moved from the panel to four window listeners; full-screen `pointer-events: none` overlay; drags ignored while the preview pop-up is open (default still cancelled); hint text "anywhere". Typecheck + lint pass; diff re-checked by mentor.
- Task 2 (hardening): skipped — a drag leaving the window fires `dragleave` (relatedTarget null) and the counter clears the overlay, 0/5 stuck.
- Browser check (headless Chrome, DevTools Protocol): 26 checks. 7 of 8 runs all pass. One run missed the drop on a photo card (file not selected, later checks failed in a chain); not reproduced in 7 more runs, cause unknown.
- **Test-tool findings:** (1) CDP `Input.dispatchDragEvent` `dragCancel` sends the page no event, so "cancel" can't be tested this way; leaving the window is simulated by a `dragOver` outside the viewport. A real Esc-cancel was not tested. (2) The headless viewport is 1258×802, not the 1280×900 window size. The #44 check "PDF dropped outside the panel does not open in the tab" used (20, 880), off the page, so it was a false pass then; this arc's check drops on a point inside the window (checked with `elementFromPoint`) and passes.
