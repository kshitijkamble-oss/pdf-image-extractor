# Reconcile — caption-detection

_Entered 2026-10-14._

**Plan vs. outcome:** cannot be compared — no plan was recorded before the work was built.

**Gaps found in the code (2026-10-14):**

- Thresholds and prefixes are hard-coded (caption.util.ts:13-14, pdf-image-extractor.ts:22).
- A match below always wins over a closer match above (caption.util.ts:69-72).
- No tests for this pure function.

**Definition of done:**

- `pnpm lint` and `pnpm typecheck` pass (run 2026-10-14).
- No acceptance criteria were recorded for this work.
- No tests exist.

**Follow-ups:** the gaps above are not yet backlog items.
