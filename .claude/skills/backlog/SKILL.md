---
name: backlog
description: Capture, list, and manage backlog items in docs/backlog.md
---

# /backlog

Single source of truth: `docs/backlog.md`. This skill formalizes the ritual —
hand-editing the file is still allowed and expected.

## Subcommands

| Form                              | Behavior                                                       |
|-----------------------------------|----------------------------------------------------------------|
| `/backlog`                        | Same as `/backlog list open`.                                  |
| `/backlog add <tag> <statement>`  | Append a new item. Assigns next `id`. Confirm before writing.  |
| `/backlog list [status]`          | Print id, tag, status, slug, 1-line statement (no bodies).     |
| `/backlog show <id-or-slug>`      | Print full item.                                               |
| `/backlog done <id>`              | Flip to `done`. Add a one-line outcome note.                   |
| `/backlog drop <id> <reason>`     | Flip to `dropped` with the reason inline.                      |

To flip status to `in-progress`, edit the item directly — that's what
`/arc start` is for, and it's a one-field change.

## Id assignment

`b-YYYYMMDD-NNN` where `NNN` is the next zero-padded counter for that date.
Compute by grepping existing ids in `docs/backlog.md` — don't guess.

## Suggest-on-keyword (passive mode)

When NOT invoked via `/backlog`, watch for phrases that smell like backlog
material:

- **feature / idea:** "we should", "it'd be nice if", "what if we", "someday", "eventually"
- **bug:** "this is broken", "there's a bug", "regression", "broken in prod"
- **tech-debt:** "this is hacky", "clean this up later", "todo", "fixme"
- **brain-dump / spike:** "half-formed thought", "just thinking out loud", "quick spike"
- **question:** "not sure how", "we haven't decided", "open question"

When one hits, **suggest once** — a single line: *"Sounds like a backlog item —
want me to `/backlog add <tag> …`?"* Do not auto-write. Do not repeat within
the same turn.

## Item format (canonical)

```md
## <slug>  <!-- id: b-YYYYMMDD-NNN -->
- **tag:** feature
- **status:** open
- **created:** 2026-07-24
- **linked-phase:**

<1–2 line statement>
```

If the statement is longer than 2 lines, propose starting an arc phase
note instead of a bloated backlog entry.
