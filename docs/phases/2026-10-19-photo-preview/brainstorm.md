# Brainstorm — photo-preview

_Entered 2026-10-19._ By planner 1 (photo-preview).

- **A. Native `<dialog>` + `showModal()`** — chosen. Esc, inert background, focus into dialog and dialog role come from the browser (checked on MDN `<dialog>` page, 2026-10-19). Click outside is not built in: close when `event.target === event.currentTarget` on a padding-free dialog with an inner wrapper. Needs a ref + `useEffect`; the `open` attribute alone opens it non-modal (MDN).
- **B. Hand-made fixed overlay** — full control, but Esc, focus trap and ARIA all by hand.
- **C. Library (Radix, react-modal)** — rejected: a dependency for one small pop-up.
- `closedby="any"` (built-in light dismiss) not used: MDN gives no support data for it.
- Not on MDN, to check in browser: backdrop click target; where focus goes on close.

**User decisions (2026-10-19):** arrows stop at the ends (disabled); Left/Right keys work; show caption + page number (not description).
