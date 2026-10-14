# Backlog

Append-mostly. One `##` section per item. Managed via `/backlog` skill, but
hand-editing is fine and expected.

## Conventions

- **id:** `b-YYYYMMDD-NNN` — assigned on creation, never reused.
- **tag:** exactly one of `feature`, `bug`, `idea`, `brain-dump`, `tech-debt`,
  `question`, `spike`.
- **status:** `open`, `in-progress`, `done`, `dropped`. Default `open`.
- **created:** ISO date.
- **linked-phase:** path to `docs/phases/…` if an arc was started for it.
- **gh-issue:** URL of the GitHub issue filed with `gh issue create`, or
  `pending` if `gh` was not available. Work does not start while it is
  `pending` (rule `issue-before-work`). `n/a` for workflow items
  (`.claude/`, `docs/`) — only app work gets an issue.
- Body: 1–2 lines. If it needs more, it's a phase note, not a backlog item.

## Template

```md

## <slug>  <!-- id: b-YYYYMMDD-NNN -->
- **tag:** feature
- **status:** open
- **created:** YYYY-MM-DD
- **linked-phase:**
- **gh-issue:**

<1–2 line statement — what & why, not how>
```

---

<!-- items below this line -->

## issue-before-work  <!-- id: b-20261014-001 -->
- **tag:** feature
- **status:** in-progress
- **created:** 2026-10-14
- **linked-phase:**
- **gh-issue:** n/a
- **decision:** `docs/decisions/0001-github-issue-before-app-work.md`

Workflow change, so no issue (#2 was filed, then closed as not planned). File a GitHub issue with `gh` before any work starts, linked from its backlog item, so the work is visible on GitHub and commits/PRs can point to it.

