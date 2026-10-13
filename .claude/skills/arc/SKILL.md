---
name: arc
description: 6-phase arc driver — ideate, brainstorm, prep, align, implement, reconcile
---

# /arc

Drives non-trivial work through six phases. Each topic gets its own folder:

```
docs/phases/YYYY-MM-DD-<topic>/
  index.md         # metadata: backlog link, current phase, started/updated dates
  ideate.md
  brainstorm.md
  prep.md
  align.md
  implement.md
  reconcile.md
```

One file per phase. Files are created eagerly at `/arc start` as stubs
(`_(not yet entered)_`) so `ls` answers "which phases are done?" at a glance.

**Reconciliation caveat:** reconcile needs to read ideate + brainstorm + prep
side-by-side against implement outcomes. Use `/arc show` to `cat` the
phase files in canonical order — do not open them in file-tree order (that
alphabetizes; e.g. align comes before brainstorm), which will scramble the
narrative.

## Subcommands

| Form                              | Behavior                                                            |
|-----------------------------------|--------------------------------------------------------------------|
| `/arc start <topic> [from <id>]`  | Create the phase folder + stub files; optionally link a backlog id. |
| `/arc ideate`                     | Enter Ideate phase.                                                 |
| `/arc brainstorm`                 | Enter Brainstorm phase.                                             |
| `/arc prep`                       | Enter Prep phase.                                                   |
| `/arc align`                      | Enter Align phase.                                                  |
| `/arc implement`                  | Enter Implement phase.                                              |
| `/arc reconcile`                  | Enter Reconcile phase.                                              |
| `/arc show [topic]`               | `cat` all six phase files in canonical order.                      |
| `/arc status`                     | Print current topic + phase + last N notes.                        |

Never auto-advance phases. When one feels done, suggest the next in one short
sentence — the user drives the transition.

## The 6 phases

### 1. Ideate — bird's-eye
Elaborate the problem, not the solution. Ask *why*, *for whom*, *what does
success look like*, *what happens if we don't*. **Output:** a problem statement
tight enough that a stranger could restate it. No implementation talk.

### 2. Brainstorm — the how & the how-else
Now go deep. Alternatives, prior art, code references, sketches. Research the
forebears — what did they do and why. Deliberately surface the contrarian
option. **Output:** 2–4 candidate directions with trade-offs; one chosen with
a reason; concrete references (files, papers, libraries).

### 3. Prep — foundations & boundaries
Skeleton, not content. Test stubs, controller/service shells, swagger payloads
+ responses, DTO shapes, migration plan, feature flags. **Output:** the shape
of the implementation is fully visible; filling it in should feel mechanical.

### 4. Align — structural sanity check
Cheap (~10 min). Read the skeleton against ideate+brainstorm.
- Does every "how" from brainstorm have a home in prep?
- Are contracts tight enough that implementation is mechanical?
- Any boundary that will bite us? Any prep artifact we can't justify?
- Does every **acceptance criterion** for the linked backlog id have a home in
  prep? Read `docs/acceptance-criteria.md` for that id. A criterion with nowhere
  to land means prep isn't done. Behaviour tagged `@undefined` is never a
  criterion — do not let it become one here.

**Output:** either a green light, or a short list of prep patches. If the list
is long, prep isn't done — loop back, don't push through.

### 5. Implement — fill it in
Write code inside the boundaries prep drew. Tests pass. If you discover prep
was wrong, **stop and go back to prep** — do not silently redesign in-place.
Record the reversal in the phase note (this is what reconcile is looking for).

### 6. Reconcile — intent vs outcome
Read the phase note top-to-bottom. Compare shipped work against ideate +
brainstorm decisions.
- Where did we follow the plan?
- Where did we divert, and was the divert justified in-note?
- What did we discover that belongs in a rule?
- What did we punt? → new backlog items via `/backlog add`.
- Does the work clear every gate in `docs/definition-of-done.md` for the linked
  backlog id, universal gates included? An unmet gate blocks `/backlog done`.

**Output:** appended reconcile section + any new backlog/rule entries.

## Templates

**`index.md`** (one per folder, holds metadata read by /state):

```md
---
topic: <slug>
started: 2026-07-24
updated: 2026-07-24
backlog: b-YYYYMMDD-NNN
status: ideate   # ideate | brainstorm | prep | align | implement | reconcile | done
---

# <topic>

<one-paragraph problem statement — a stranger should be able to restate it>
```

**Each phase file** (`ideate.md`, `brainstorm.md`, …):

```md
# <Phase> — <topic>

_Entered YYYY-MM-DD._

<phase content — each phase's shape is described above>
```

New folder stubbed at `/arc start` contains all six phase files with
just the header + `_(not yet entered)_` so `ls` reflects true state as
phases are actually worked.

## Skip criteria

Skip the arc when the task is small enough that the ritual costs more than
it saves: typo fixes, one-line bug fixes, direct questions, obvious refactors
under ~50 lines. When in doubt, do a lightweight ideate (3–5 lines) and decide
from there.

## Vertical slicing (for product feature work)

Per rule [[vertical-slice-product-work]]: a single **feature** backlog item
typically spawns **multiple slice arcs** — one per thin end-to-end path.
Cross-link them in the backlog item's body under a `Slices:` section.

- Each slice's ideate/brainstorm can be brief (most decisions were made when
  the feature was scoped) but align/implement/reconcile is real per slice.
- Do NOT run a single feature-wide arc that spans "build all endpoints
  then all screens." That's horizontal — the rule catches this pattern.
- Architectural work (auth setup, ACC adapter interface, logging, deploy
  pipeline) is exempt — those run as their own non-slice arcs.
