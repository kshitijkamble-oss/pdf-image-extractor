---
name: decision
description: Author and manage ADRs (Architecture Decision Records) in docs/decisions/
---

# /decision

Decisions live in `docs/decisions/NNNN-<slug>.md`. See
`docs/decisions/README.md` for the frontmatter contract and when to write one.

## Subcommands

| Form                             | Behavior                                                    |
|----------------------------------|-------------------------------------------------------------|
| `/decision`                      | Same as `/decision list`.                                   |
| `/decision list [status]`        | Table: id, status, date, title. Filter by status if given.  |
| `/decision show <id-or-slug>`    | Print full ADR.                                             |
| `/decision new "<title>"`        | Assign next NNNN, copy `_template.md`, open for editing.    |
| `/decision supersede <old> <new-title>` | Create new ADR with `supersedes: [<old>]`; flip old ADR's `status` to `superseded` and set its `superseded-by`. |
| `/decision why <id>`             | Print just the **Context** and **Decision** sections.       |

## Id assignment

Grep existing filenames: `ls docs/decisions/[0-9]*.md | sed 's/-.*//' | sort -rn | head -1`.
Increment. Zero-pad to 4 digits. Never reuse an id, even for `rejected` ADRs.

**Accepted ADRs are immutable.** To change a decision, supersede it — do not
edit in place. One decision per ADR; if a file grows past ~80 lines, move the
exploration to `docs/phases/…/brainstorm.md` and keep the ADR tight.
