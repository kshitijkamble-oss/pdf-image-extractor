# Align — upload-page-ux

_Entered 2026-10-19._

- Every brainstorm "how" has a task: panel + button text → task 1; native drag-and-drop + window guard → task 2; status line + empty result → task 3.
- Acceptance criteria for b-20261019-005 written to `docs/acceptance-criteria.md` (none existed); each lands in a task.
- Boundaries: frontend only (`App.tsx`, `App.css`), no new packages, grid/preview untouched.
- Risk noted: `dragleave` flicker over child elements — task 2 carries the fix hint.

**Green light.**
