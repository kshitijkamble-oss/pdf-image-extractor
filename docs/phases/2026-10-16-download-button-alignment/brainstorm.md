# Brainstorm — download-button-alignment

_Entered 2026-10-16._

**Code today:** `apps/frontend/src/App.tsx` — each `.photo-card` holds the image, page number, optional caption and description, then the `.download-button` link. `apps/frontend/src/App.css` — `.photo-grid` is a CSS grid; `.photo-card` is a plain block, so the button just follows the text.

**Fact (MDN `align-items`):** grid items with no set height stretch to the row's height by default. So the cards in one row are already the same height; only the button inside does not sit at the bottom.

**Options:**
1. **Card as a flex column, button pushed down with `margin-top: auto`** (MDN box alignment in flexbox: an `auto` margin takes all the free space). Needs `align-self: flex-start` on the button, or the flex column would stretch it to full width. Small CSS-only change.
2. **Card as a grid with a last row for the button** (`grid-template-rows: auto 1fr auto`-style). Works, but needs the middle content wrapped or rows counted; more fiddly with the optional caption/description.
3. **Fixed image/text heights** so every card is the same inside. Contrarian: cheap, but crops or clips content and breaks on long captions.

**Chosen: option 1.** Smallest change, CSS only, keeps the card's content as is. Watch: in a flex column, the `<p>` margins no longer collapse into each other, so spacing between texts may grow a little; check it looks the same.

**Docs used:** MDN "Box alignment in flexbox" (auto margins), MDN `align-items` (grid default stretch).
