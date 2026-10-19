# Implement — card-click-preview

_Entered 2026-10-19._

Task 1 (builder 1): App.tsx + App.css in one call.

- Done as planned. One small addition by builder 1: `.photo-open` got `cursor: inherit`, because a `<button>` does not take the card's cursor on its own.
- Browser check (mentor, local Chrome): every part of the card opens the right photo; the card's Download (mouse and Enter) does not open the pop-up; keyboard open, arrows and Esc still work.
- A first scripted check gave mixed results because the script closed the dialog behind React's back; re-done with real clicks and the × / Esc controls.
- Noticed: on the dark theme the hover colour #888 is darker than the normal #ccc border, so hover dims the border instead of brightening it (same as the Download button already does).
