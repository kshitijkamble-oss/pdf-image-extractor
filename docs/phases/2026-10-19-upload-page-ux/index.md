---
topic: upload-page-ux
started: 2026-10-19
updated: 2026-10-19
backlog: b-20261019-005
status: implement
---

# upload-page-ux

The upload page is loose: the title, file picker and Submit button sit in a plain row with no hint of what to do, a PDF can only be picked through the file dialog, nothing says how many photos were found, and the button still says "Submit" after extracting (#32). Group the controls into one clear upload panel, allow drag-and-drop, show a result status line, and fix the button text. Frontend only. Issue #44.
