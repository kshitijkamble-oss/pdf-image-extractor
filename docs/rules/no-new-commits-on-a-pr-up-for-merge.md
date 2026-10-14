---
id: no-new-commits-on-a-pr-up-for-merge
scope: shared
title: Never push more commits to a PR you have handed to the user to merge — open a new PR instead
priority: must
appliesToKeywords:
  - push
  - pull request
  - merge
  - follow-up
  - another commit
  - add to the pr
created: 2026-10-14
---

**Why:** Found 2026-10-14. PR #11 was shown to the user as ready, and then a second commit with the rest of the fix was pushed to its branch. The user merged #11 before that push landed. So `main` got half the fix, production stayed down, and `Closes #10` closed the issue anyway. It took a reopen and a second PR (#14) to recover.

Once a PR has been shown to the user as ready to merge, its branch is frozen:

- Do not push to it. Put new work on a new branch made from the latest `main`, and open a new PR.
- If the open PR really must change (for example, it is broken and must not be merged as it stands), tell the user **before** pushing: say the PR is changing, and that they should not merge it until you say so.
- After any merge, check what actually landed (`gh pr view <n> --json mergeCommit`, `git log origin/main`) before saying the work is in `main`.
