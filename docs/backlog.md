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
- Body: 1–2 lines. If it needs more, it's a phase note, not a backlog item.

## Template

```md

## <slug>  <!-- id: b-YYYYMMDD-NNN -->
- **tag:** feature
- **status:** open
- **created:** YYYY-MM-DD
- **linked-phase:**

<1–2 line statement — what & why, not how>
```

---

<!-- items below this line -->
