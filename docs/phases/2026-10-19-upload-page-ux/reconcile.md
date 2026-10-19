# Reconcile — upload-page-ux

_Entered 2026-10-19._

**Followed the plan:** all brainstorm choices shipped as chosen: native drag events (no library), extract only on the button, disabled "Extracted ✓", one upload panel, status line, grey "No photos found" box for an empty result. The planner's six proposed answers shipped as approved. PR #45 (`91ed814`), closes #44 and #32.

**Diverted:** builder 2 slipped an unrelated spacing change (`showPhoto =(`); caught in the mentor's diff read, fixed by builder 3. Lint passed with it — there is no formatter in the frontend.

**Discovered:** the browser check found a prep gap. A dropped file does not reach the native file input, so the input kept its old file: wrong label, and re-picking that file fired no `change`. Prep question 5 had seen the label lag and called it harmless. Fixed in task 5 (clear the input on a PDF drop). Lesson: when two inputs feed one state (picker + drop), check each input's own state too, not only the app's. Not made a rule. Also: the Claude in Chrome extension could not load localhost or vercel.app ("Permission denied … on this domain"), so the mentor drove headless Chrome over the DevTools Protocol from a scratchpad script (`Input.dispatchDragEvent` for real file drops) — 27/27 checks.

**Not covered:** the Vercel frontend preview built but was not clicked (behind Vercel login; extension blocked); real mouse drags were simulated, not done by hand; no automated tests in the repo (b-20261019-003).

**Punted:** user asked for the whole page to be the drop zone → b-20261019-006 (#46).

**Definition of done:** whole-repo lint and typecheck passed; acceptance criteria for b-20261019-005 met in the local check; arc reconciled; backlog flipped to done; #44 and #32 closed by PR #45. No ADR or rule changed.
