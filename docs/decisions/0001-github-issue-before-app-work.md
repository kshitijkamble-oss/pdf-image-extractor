---
id: 0001
slug: github-issue-before-app-work
title: File a GitHub issue with `gh` before any app work; workflow changes stay local
status: accepted
date: 2026-10-14
supersedes: []
superseded-by:
---

## Context

Work was tracked only in the local backlog (`docs/backlog.md`). That trail is
invisible on GitHub, and commits and PRs had no issue number to point to. We
wanted every piece of work to have a GitHub issue first, filed with the `gh` CLI.

Trying it on the rule change itself (issue #2) showed the problem: the repo's
Issues page is read as "what is happening with the PDF image extractor". Changes
to our own Claude workflow (rules, hooks, skills) are noise there.

## Decision

- Work on the app (`apps/`, `packages/`) needs a GitHub issue before it starts,
  filed with `gh issue create` and linked in the backlog item's `gh-issue` field.
- Workflow changes (`.claude/`, `docs/`, `CLAUDE.md`) need only the local backlog
  item, with `gh-issue: n/a`. Process decisions also get an ADR here.
- GitHub issues sit next to the local backlog; they do not replace it.
- Enforced by rule `docs/rules/issue-before-work.md` (must) plus a reminder in
  `.claude/hooks/user-prompt-submit.mjs`. No hard block.

## Consequences

- App work is visible on GitHub, and commits and PRs can reference `#<n>`.
- The Issues page stays focused on the app.
- Two places to keep in sync (backlog item and issue); `/backlog` does both.
- The hook cannot tell app work from workflow work, so it may remind about an
  issue for a workflow change. The reminder can be ignored for those.

## Alternatives considered

- **Issues replace the backlog** — would throw away the local backlog and its
  link to arcs, which the rest of the workflow is built on.
- **Issues for all work, workflow included** — tried with issue #2; it clutters
  the Issues page with things app readers do not care about.
- **Hard block via a PreToolUse hook** — stricter, but more moving parts than a
  learning project needs.
