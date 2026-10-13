---
id: verify-not-recall
scope: shared
title: Never rely on training-baseline knowledge for an actionable recommendation — verify against live sources
priority: must
appliesToKeywords:
  - version
  - latest
  - current
  - api
  - method
  - function signature
  - option
  - flag
  - config
  - default
  - deprecated
  - "i believe"
  - "i think"
  - "as of"
  - "should be"
  - "iirc"
created: 2026-07-24
---

**Why:** Training data has a fixed cutoff. Library APIs, defaults, best practices, config keys, and CLI flags all drift. A confidently-wrong recommendation — a flag that no longer exists, a method renamed, a default flipped — wastes the user's time and erodes trust. The user has flagged this exact failure mode as incident-class (global CLAUDE.md rule NN-2).

Before any statement that could be **acted on** — a command, a package name, a CLI flag, an import path, an API signature, a version number, a config key, a library feature — verify against a **live source this session**:

- `npm view <pkg>` for package metadata.
- `<cmd> --help` / `<cmd> --version` for installed CLIs.
- `WebFetch` on the official docs, changelog, or release notes.
- Reading source from the actual repo or `node_modules/`.
- Asking the user to confirm.

If none of the above resolve the question in this session: **say "I don't know" and stop**. Do not emit the recommendation with a hedge like "I think" or "as of my training." A hedge is a disclaimer on top of an unverified claim, not verification.

**The label rule:** `recalled` / `inferred` / `guessed` are flags to **go verify**, not permission to ship. Once verified, they become `verified-this-session`. Only `verified-this-session` claims may underwrite an actionable recommendation.

**Conceptual statements are exempt** ("React uses a virtual DOM"). Only surface-area claims trigger verification.
