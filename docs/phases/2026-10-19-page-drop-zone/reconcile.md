# Reconcile — page-drop-zone

_Entered 2026-10-19._

**Followed the plan:** window listeners (not a wrapper), `pointer-events: none` overlay, drag counter kept, #44 drop rules unchanged; the user's answers shipped (ignore drags while the pop-up is open but still cancel the default, hint "anywhere", dark overlay). PR #47 (`0a77718`), closes #46.

**Diverted:** none. Optional task 2 (`relatedTarget === null` hardening) skipped: leaving the window already clears the overlay.

**Discovered:** about the test tool, not the app. CDP `dragCancel` sends the page no event, so the overlay looked "stuck" until the test simulated leaving the window instead. The headless viewport is 1258×802, so a test point at y=850 hit nothing — which also made one #44 check a false pass. Lesson: check that a test's coordinates land on the page (`elementFromPoint`) before trusting a "nothing happened" pass. Not made a rule.

**Not covered:** Esc-cancelling a real drag; one of 8 runs missed a drop on a photo card (not reproduced, cause unknown); the Vercel preview was built but not clicked. The branch policy blocked Claude's merge, so the user merged.

**Punted:** the user disliked the look → b-20261019-007 (#48).

**Definition of done:** whole-repo lint and typecheck passed; acceptance criteria for b-20261019-006 met in the local check (Esc-cancel untested); arc reconciled; backlog flipped to done; #46 closed by PR #47. No ADR or rule changed.
