---
id: issue-before-work
scope: shared
title: File a GitHub issue with `gh` before starting app work, and link it from the backlog item
priority: must
appliesToKeywords:
  - implement
  - build
  - add feature
  - add endpoint
  - add page
  - add component
  - create feature
  - fix bug
  - fix the
  - refactor
  - migrate
  - migration
  - ship
  - rollout
  - integrate
  - wire up
  - hook up
created: 2026-10-14
---

**Why:** The local backlog (`docs/backlog.md`) only lives in this repo. A GitHub issue makes the work visible to anyone looking at the repo on GitHub, gives it a number that commits and PRs can point to, and keeps a public trail of why the work was done.

This sits next to **work-needs-plan**, it does not replace it. Decision: `docs/decisions/0001-github-issue-before-app-work.md`.

**Which work needs an issue:** work on the app (`apps/`, `packages/`). Workflow changes (`.claude/`, `docs/`, `CLAUDE.md`) do not — the Issues page is for the app. Give their backlog item `**gh-issue:** n/a`, and write an ADR if it is a process decision.

Before writing app code, check the backlog item for this work has a `**gh-issue:**` field with an issue URL. If not:

1. Check `gh` works: `gh auth status`. If `gh` is missing or not logged in, stop and ask the user to install it (`winget install --id GitHub.cli`) and run `gh auth login`. Do not start the work without the issue.
2. Show the user the title and body, then file it:
   `gh issue create --title "<statement>" --body "<what & why. Backlog: b-YYYYMMDD-NNN. Tag: <tag>>"`
   Pass both `--title` and `--body` so `gh` does not prompt. It prints the new issue's URL.
3. Write that URL into the backlog item's `**gh-issue:**` field.

Commits and PRs for the work mention the issue (`#<n>`). When the backlog item goes `done` or `dropped`, close the issue with a one-line comment: `gh issue close <n> --comment "<outcome>"` (add `--reason "not planned"` for `dropped`).

**Skip criteria:** same as **work-needs-plan** — typo fixes, one-line bug fixes, direct questions.
