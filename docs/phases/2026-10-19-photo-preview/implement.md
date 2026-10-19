# Implement — photo-preview

_Entered 2026-10-19._

Tasks 1+2 of the plan merged into one builder task (user answered the arrow/key/text questions up front). Built by builder 1 (photo-preview): `App.tsx` + `App.css` only, as in prep. Frontend typecheck + lint pass (re-run by the mentor). No change from prep.

**Local browser check (mentor, Chrome, 2026-10-19)** with `uploads/preview-check/test.pdf` (2 photos):
- Card layout unchanged (image 211×140 in card).
- Click on photo → dialog open, `:modal`, focus on ×. Previous disabled on photo 1, Next disabled on photo 2.
- ArrowRight ×2 → Page 2 (stops); ArrowLeft ×2 → Page 1 (stops).
- Esc closes; focus returns to the clicked photo's button (not stated on MDN — now seen in Chrome).
- Click on the large photo and on the caption → stays open. Click on the dark area → closes (backdrop click is reported on the `<dialog>`, seen in Chrome).
- × closes. Download link in pop-up has `download="p2-1.png"` for photo 2.
- Photo shows at its own size (300×200), capped at 90vw × 70vh; small photos are not stretched up.
- Not checked: narrow window; actual file save from the pop-up's Download (same link markup as the card, which was checked byte-for-byte in download-photo); other browsers; stale pop-up on new file (can't happen by hand — the page behind is inert while the pop-up is open).
