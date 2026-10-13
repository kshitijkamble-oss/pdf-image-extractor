---
name: state
description: Show or regenerate docs/STATE.md (the "where are we right now" snapshot) and append to the activity log
---

# /state

Answers "what's happening on this project right now?" in one file:
`docs/STATE.md`. Regenerated from backlog + phase notes + decisions +
activity — never hand-edited.

## Subcommands

| Form                              | Behavior                                                    |
|-----------------------------------|-------------------------------------------------------------|
| `/state`                          | Print current `docs/STATE.md`.                              |
| `/state refresh`                  | Run `node .claude/scripts/refresh-state.mjs` to regenerate.     |
| `/state log <line>`               | Prepend a new dated entry to `docs/activity.md`, then `refresh`. |
| `/state stale`                    | Warn if STATE.md is older than the newest source file.      |

## When to refresh

- **Automatic:** the `Stop` hook (`.claude/hooks/stop.mjs`) regenerates
  STATE.md at the end of every turn, so it rarely goes stale on its own.
- After merging work that changes backlog status, a phase's status, or adds
  a decision.
- Before starting a session, so you're reading a fresh snapshot.
- Cheap enough that you can `refresh` liberally.

The auto-refresh only regenerates STATE from its sources — it does **not** write
activity entries. Notable events (decisions, milestones, external context) still
have to be logged into `docs/activity.md` by hand or via `/state log`.

## Activity log rules

- **Newest at the top.** The refresh script and `/state log` both assume it.
- **One line per event.** If it needs more, it's a decision (write an ADR) or
  a phase note (start an arc).
- **Not for commits.** `git log` is the commit stream. Activity is for events
  git can't see: decisions accepted, milestones hit, incidents, external
  context ("customer flagged latency issue in the ingest pipeline"), etc.
- **Don't delete entries.** If wrong, add a correcting entry. History is
  cheap; rewriting it is expensive to trust.

**Never hand-edit STATE.md.** If it's wrong, the fix is in the source
(backlog status, phase `index.md` status, missing activity entry) — then
`refresh`.
