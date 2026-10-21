# Reconcile — github-readme

_Entered 2026-10-21._

**Followed the plan:** all four tasks done as planned (one builder task, three mentor tasks).

**Diverted:** none in the work. The planner was unsure which live URL was the frontend and how a missing Turnstile secret behaves; the mentor settled the first with curl and the builder settled the second by reading the guard. Found on the way: the GitHub homepage field pointed at the backend (`-two`, 404 at `/`); fixed.

**Process slip:** a `sed` used to fill this item's `linked-phase` also hit seven other items with an empty field. Caught in the diff and redone. Lesson: anchor edits to the item, not to a pattern that repeats across the file.

**Punted:** no Node version is pinned anywhere (README says "a recent Node LTS"). Not worth a backlog item yet.

**Definition of done:** universal gates met — README matches the asks in ideate; `pnpm lint` and `pnpm typecheck` pass on main after merge; backlog done; activity entry added; no ADR or rule changed.
