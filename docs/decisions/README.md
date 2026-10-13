# Decisions (ADRs)

One `.md` file per architectural / process decision that will stay load-bearing
past the current sprint. Filename: `NNNN-<slug>.md` where `NNNN` is a
zero-padded counter (`0001`, `0002`, …), assigned sequentially, never reused.

## When to write one

- We chose approach A over B/C and someone will ask "why not B?" in three
  months.
- We adopted a convention that isn't obvious from the code (e.g. "hooks
  written in fish, not bash").
- We *rejected* an approach and want to remember why (an ADR with
  `status: rejected` is valid and useful).

## When NOT to write one

- Backlog items are not decisions. Backlog is the queue; decisions are the
  answers.
- One-off implementation choices ("used `Set` instead of `Array` here") — those
  live in the code.
- Trivia. If it wouldn't come up in a design review, it's not a decision.

## Frontmatter contract

```yaml
---
id: 0001
slug: use-fish-for-hooks
title: Use fish (not bash) for .claude/hooks scripts
status: accepted        # proposed | accepted | rejected | superseded | deprecated
date: 2026-07-24
supersedes: []          # ids of ADRs this replaces
superseded-by:          # id of the ADR that replaces this (if status=superseded)
---
```

## Body sections (in order)

1. **Context** — the situation and forces that made a decision necessary.
2. **Decision** — what we chose. Imperative voice.
3. **Consequences** — good, bad, and neutral outcomes. Include the ones we
   accepted knowingly.
4. **Alternatives considered** — what else was on the table and why it lost.
   This is the section that pays for itself six months later.

Keep the whole file under ~80 lines. If it's longer, it's a design doc, not
an ADR.

## Lifecycle

- ADRs are immutable once `status: accepted`. Don't edit — supersede.
- To supersede: write a new ADR that sets `supersedes: [NNNN]`, and update the
  old ADR's `status: superseded` + `superseded-by: <new-id>`.
