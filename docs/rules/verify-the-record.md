---
id: verify-the-record
scope: shared
title: Check a claim in our own notes against the artifact before trusting it — and against committed state before writing it
priority: must
appliesToKeywords:
  - reconcile
  - "phase note"
  - "activity log"
  - "outcome"
  - "backlog done"
  - "already done"
  - "we already"
  - "was added"
  - "was fixed"
  - "shipped"
  - "landed"
  - "verified"
  - "mutation-check"
  - "state.md"
created: 2026-08-26
---

**Why:** this repo's memory is `docs/` — phase notes, activity entries, backlog
outcomes. The next reader treats those as facts, so a confident sentence about
work that did not actually land is worse than no sentence: it stops anyone
looking. Three instances now, all the same shape — a claim stated in a note and
believed until someone tried to use it:

1. `b-20260826-001`'s reconcile said charts "will not draw" under jsdom. They
   throw and take the page mount down. Found when someone went to document it.
2. That arc's own mutation check caught a test passing for the wrong reason.
3. Its outcome note and activity entry both recorded 3 render tests on
   `landing.tsx`, suite 69 → 72, mutation-checked. **No `.spec.tsx` existed in
   any commit** — `git show 8da6f8c --stat` shows the config and setup file
   landed without it, and the config as committed could not have resolved
   `~/…` anyway, so those tests could never have run from a clean checkout.

**Reading.** Before building on any claim in `docs/` — a note, an outcome, a
`STATE.md` line, "we already added X" — check the thing itself: does the file
exist, does the test run, does `git log` show it. `docs/STATE.md` is generated
and routinely a day or more stale; it is a pointer, never evidence.

**Writing.** An outcome note, activity entry, or `/backlog done` describes
**committed** state, not your working tree. Before writing one, run
`git status --short` and confirm every artifact you are about to claim is
actually staged or committed. "It passes locally" and "it is in the repo" are
different claims — do not write the second having verified only the first.

**Correcting.** When you find a note that is wrong, **append a dated
amendment** — do not silently rewrite it. The history of what we believed is
itself worth keeping (precedent: the amendment at the foot of
`docs/phases/2026-08-26-webapp-render-testing/implement.md`).
