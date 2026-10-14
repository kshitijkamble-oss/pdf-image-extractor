---
id: pr-only-to-main
scope: shared
title: Never commit, push, or merge straight to `main` — every change reaches `main` through a pull request
priority: must
appliesToKeywords:
  - commit
  - push
  - merge
  - main
  - pull request
  - " pr"
  - branch
created: 2026-10-14
---

**Why:** A pull request is a checkpoint. It shows the change on GitHub before it lands, gives a place to review it, and links back to the issue (`#<n>`). A direct push to `main` skips all of that and leaves no record of why the change was made.

This covers everyone: the main session, every mentee, and the user's own changes made through Claude. It covers app work and workflow changes alike.

When a change is ready to land:

1. Make a branch off an up-to-date `main`: `git switch -c <type>/<short-slug>` (for example `feat/extract-pngs`, `docs/pr-only-rule`).
2. Commit on that branch. Never on `main`. If you find you are on `main` with changes, move them to a new branch before committing.
3. Push the branch: `git push -u origin <branch>`.
4. Open the PR: `gh pr create --base main --title "<statement>" --body "<what & why. Closes #<n>.>"`. Pass `--title` and `--body` so `gh` does not prompt. For workflow changes with no issue, leave out `Closes`.
5. Show the user the PR link and wait. Merge only when the user says to: `gh pr merge <n> --squash --delete-branch`.

Never `git push origin main`, never `git merge <branch>` into local `main` and push, never force-push `main`. The user's own "never commit or push unless I ask" still applies — this rule decides *where* the change goes, not *whether* to make it.

**Note:** `gh` is installed at `C:\Program Files\GitHub CLI\gh.exe` but may not be on PATH in this shell.
