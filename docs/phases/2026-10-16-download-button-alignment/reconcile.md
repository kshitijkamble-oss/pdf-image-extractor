# Reconcile — download-button-alignment

_Entered 2026-10-16._

**Followed the plan:** brainstorm option 1 shipped as chosen (card as flex column, button `margin-top: auto`), CSS only, one builder task. Production serves the new CSS after PR #35 (`2720b2e`).

**Diverted:** the planner's plan was patched by the mentor before the user's OK: `align-items: flex-start` on the card instead of `align-self` on the button, because a flex column would have stretched the photos; and the "keep 8px above the button" step was dropped, because the `<p>` before the button already gives ~1em. Small side effect, noted in implement: the tallest card is ~14 px shorter.

**Discovered:** the test PDF gives two cards with the same content, so it can't show this bug by itself; the check made one caption longer in the page only. Not a rule.

**Not covered:** a narrow window and a real PDF with mixed captions were not checked.

**Definition of done:** whole-repo lint and typecheck passed; no acceptance criteria recorded for b-20261016-006; arc reconciled; backlog flipped to done; issue #33 closed by PR #35. No ADR or rule changed.
