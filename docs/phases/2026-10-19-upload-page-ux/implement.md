# Implement — upload-page-ux

_Entered 2026-10-19._

- Task 1 (builder 1): upload panel + button text. Typecheck + lint pass; diff re-checked by mentor.
- Task 2 (builder 2): native drag-and-drop + window guard. Passed checks, but slipped an unrelated `showPhoto =(` spacing change; fixed in task 3.
- Task 3 (builder 3): `resultName` status line + `.status.empty` box.
- Browser check: the Chrome extension could not load any localhost page, so the mentor drove headless Chrome over the DevTools Protocol (scratchpad script, `Input.dispatchDragEvent` for drops). 25/26 checks passed.
- **Found in the browser check (prep gap):** the native file input keeps its old file after a drop. Its label shows the wrong name, and re-picking that same file fires no `change`, so the page ignores it. Prep question 5 saw the label lag but called it harmless. Fix (user-approved): clear the input when a file is dropped — task 5.
- Task 5 (builder 4): file input ref, cleared on a PDF drop. Browser re-check: 27/27 pass, including re-picking a file after a drop.
