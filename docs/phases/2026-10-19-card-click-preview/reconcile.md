# Reconcile — card-click-preview

_Entered 2026-10-19._

**Followed the plan:** brainstorm option B shipped as chosen: click handler on the card `div`, the card's Download `<a>` calls `stopPropagation` (no `preventDefault`), image `<button>` kept as the one keyboard stop. User's choices (zoom-in cursor, hover border) shipped. PR #42 (`9ba8c26`).

**Diverted:** none in design. Builder 1 set `.photo-open` to `cursor: inherit` instead of dropping its cursor line, because a `<button>` does not take its parent's cursor by default.

**Discovered:** a scripted browser check that closes a React-controlled `<dialog>` with `dialog.close()` gives flaky results; use the app's own × / Esc. Not a rule. On the dark theme the #888 hover border is dimmer than the #ccc default, so hover dims the card (same as the Download button). Left as is.

**Not covered:** no automated tests (tracked in b-20261019-003); a real file save from the card's Download was not repeated (save blocked in the test, code path unchanged); the Vercel frontend preview was built but not clicked.

**Definition of done:** whole-repo lint and typecheck passed; no acceptance criteria recorded for b-20261019-004; arc reconciled; backlog flipped to done; issue #41 closed by PR #42. No ADR or rule changed.
