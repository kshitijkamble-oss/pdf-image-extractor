# docs/

Single source of truth for everything Claude and humans need to reason about
this project. `CLAUDE.md` at the repo root is intentionally lean — context is
loaded on demand via skills and hooks, not by dumping everything into one
always-on file.

## Layout

| Path              | Purpose                                                                       |
|-------------------|-------------------------------------------------------------------------------|
| `STATE.md`        | Generated snapshot: active arcs, in-progress backlog, recent decisions.       |
| `backlog.md`      | Every backlog item — ideas, bugs, features, brain-dumps.                      |
| `acceptance-criteria.md` | Per-item AC, keyed by backlog id.                                      |
| `definition-of-done.md`  | Per-item DoD, keyed by backlog id, over a set of universal gates.        |
| `activity.md`     | Append-at-top log of notable events (decisions, milestones, external context).|
| `decisions/`      | ADRs — one `NNNN-<slug>.md` per architectural/process decision.               |
| `rules/`          | One `.md` per rule, with frontmatter. Loaded by hooks on match.               |
| `phases/`         | Arc phase notes: `YYYY-MM-DD-<topic>/` folder per topic, file per phase.       |
| `sessions/`       | Optional session summaries when a session produced non-obvious work.          |

## Hooks and scripts

`.claude/settings.json` wires three hooks, all Node scripts (no extra installs):

| Hook               | Script                                   | Does                                              |
|--------------------|------------------------------------------|---------------------------------------------------|
| `SessionStart`     | `.claude/hooks/session-start.mjs`        | Lists `must` rule titles and open backlog items.  |
| `UserPromptSubmit` | `.claude/hooks/user-prompt-submit.mjs`   | Injects matching rule bodies; backlog/plan nudges.|
| `Stop`             | `.claude/hooks/stop.mjs`                 | Regenerates `docs/STATE.md`.                      |

Scripts you can run by hand:

```
node .claude/scripts/refresh-state.mjs
node .claude/scripts/arc-start.mjs <topic-slug> [<backlog-id>]
```

## Why this shape

- **CLAUDE.md lean:** always-on context is expensive and drifts. Cold rules
  are worse than no rules — you stop trusting them. Load on demand instead.
- **Rules per file with frontmatter:** filterable, greppable, individually
  editable, cheap to author.
- **Backlog is one file, not a folder:** a backlog is a list, not a
  filesystem. Optimizing for ctrl-F over ls.
- **Phase note per topic, folder with file per phase:** each folder holds
  supporting artifacts (sample payloads, diagrams, references) as first-class
  siblings of the phase notes. `/arc show` cats the phase files in
  canonical order to keep reconciliation cheap.
