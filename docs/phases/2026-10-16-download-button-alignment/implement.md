# Implement — download-button-alignment

_Entered 2026-10-16._

Task 1 built by builder 1 (App.css only, exactly as in prep). Whole-repo typecheck + lint pass (re-run by the mentor).

**Local visual check (mentor, Chrome, 2026-10-16):** uploaded `uploads/preview-check/test.pdf` → 2 cards. Made card 1's caption longer in the page only, to force different heights. Before the fix (old CSS forced back on): button bottoms 650 vs 578 px. After: both 636 px, both 9 px from the card's left edge. Text gap page-number → caption 16 px before and after; images 210 px wide before and after. The tallest card is ~14 px shorter, because the space above the button is now just the `<p>` margin (no extra 8 px + line box). Not checked: a narrow window, a real PDF with mixed captions.
