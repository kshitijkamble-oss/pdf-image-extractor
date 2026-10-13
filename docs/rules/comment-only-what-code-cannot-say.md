---
id: comment-only-what-code-cannot-say
scope: shared
title: Default to no comment — write one only for what the code cannot say itself
priority: should
appliesToPaths:
  - "apps/**/*.ts"
  - "apps/**/*.tsx"
  - "packages/**/*.ts"
  - "packages/**/*.tsx"
appliesToKeywords:
  - comment
  - comments
  - jsdoc
  - docstring
  - "document the code"
  - "add a note"
created: 2026-09-15
---

**Why:** a comment that restates the code is a second copy of the same fact, and
the two drift apart the first time someone edits one of them. The stale copy then
outranks the code in a reader's head, which is worse than having said nothing.
`low-cognitive-complexity` already covers the other half: a block that needs a
comment to be *followable* wants extracting, not annotating. What is left for a
comment is the small set of things the code genuinely cannot carry — reasons,
constraints, and pointers out of the file.

Default to no comment. Write one only when the code cannot say it itself:

- why a workaround is there, and what breaks without it
- an invariant a reader would not guess from the types or names
- why the obvious approach was rejected
- a link to the spec, issue, ADR, or `docs/phases/` folder that holds the reasoning

Never restate what the code already says, and never narrate the edit itself
("added X", "moved from Y") — that belongs in the commit message and the arc.

**Comments other rules require — not optional, do not strip them:**

- `// Mirrors <UnionName> in apps/api/...` on a hand-copied typebox union in
  `packages/shared/schemas/src/` — it is the only marker tying the two tables
  together (`schema-mirror-must-move-together`).
- A comment on a refusal's status code when it is not the obvious one, e.g. 400
  rather than 404, naming the reason — without it the next reader "fixes" it
  (`a-refusal-message-is-a-claim`).

**Long reasoning does not go in a comment.** If the why runs past a couple of
lines, write it in `docs/decisions/` or the arc phase folder and leave a one-line
link.
