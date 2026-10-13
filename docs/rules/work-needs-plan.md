---
id: work-needs-plan
scope: shared
title: Never start feature / bug / refactor work without an open backlog item AND an active arc
priority: must
appliesToKeywords:
  - implement
  - build
  - add feature
  - add endpoint
  - add page
  - add component
  - create feature
  - fix bug
  - fix the
  - refactor
  - migrate
  - migration
  - ship
  - rollout
  - integrate
  - wire up
  - hook up
created: 2026-07-24
---

**Why:** Work without a backlog trail is unrecoverable. Six weeks in, when a reviewer or new teammate asks "why did we do it this way?", the answer is silence — no ideation, no alternatives considered, no decision recorded. The user has flagged this as incident-class ("disastrous"). The cost of the ritual (5 minutes) is nothing next to the cost of not being able to reconstruct intent.

Before writing code for anything larger than a typo, a one-line bug fix, or a direct question, verify both are true:

1. There is a **backlog item** (`b-YYYYMMDD-NNN`) for this work. If not: `/backlog add <tag> <one-line statement>` first.
2. There is an **active arc phase folder** (`docs/phases/<date>-<topic>/` with `index.md` status ≠ `done`). If not: `/arc start <topic> from <backlog-id>` first.

If either is missing, **stop and set it up before writing code**. Even for a "small change" the client will not remember why we made it.

**Skip criteria:** typo fixes, one-line bug fixes, direct questions, obvious refactors under ~50 lines with no design decision. When in doubt: spend 5 lines in `/arc ideate`, decide, then proceed.

**Nudge:** the `UserPromptSubmit` hook detects implementation-flavored prompts. If no active arc exists AND the prompt does not reference a backlog id, it injects a reminder. The nudge is dismissable — the user is the arbiter of "trivial." But the rule stands: if you proceed and the work turns out non-trivial, you owe the backlog + arc entries retroactively before the session ends.
