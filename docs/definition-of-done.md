# Definition of Done

One section per open backlog item, keyed by id. Acceptance criteria are the companion
file — [acceptance-criteria.md](acceptance-criteria.md).

**AC answers "did we build the right thing." DoD answers "is it shippable."**
An item is finished only when both pass.

## Universal gates

Every item below inherits these. Per-item sections list only what is *additional or
sharper* for that item.

- [ ] Its acceptance criteria are met.
- [ ] Backlog item flipped to `done` via `/backlog done <id>` with a one-line outcome note.
- [ ] Its arc is reconciled — no arc left open at `implement`.
- [ ] `docs/activity.md` entry if the work is notable (a decision, a milestone, external
      context). Routine slices do not need one.
- [ ] `pnpm lint` and `pnpm typecheck` pass.
- [ ] Any documented contract the change alters (ADR, rule) is updated in the same change.

---

<!-- items below this line -->
