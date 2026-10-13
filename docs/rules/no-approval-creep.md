---
id: no-approval-creep
scope: shared
title: An approval / exception in one context does NOT extend to other contexts — re-ask each time
priority: must
appliesToKeywords:
  - "just this"
  - "just here"
  - "just for"
  - "only this"
  - "only for"
  - "fine to skip"
  - "can skip"
  - "we can skip"
  - "skip the test"
  - "skip tests"
  - "just once"
  - exception
  - one-off
  - "for now"
  - temporarily
  - "similar to"
  - "same as"
  - "like we did"
  - "we already"
  - "you already"
  - "as before"
created: 2026-07-24
---

**Why:** Claude has a strong tendency to over-generalize approvals. The user grants an exception once for a specific case — "skip the test for this migration script" — and Claude silently applies it to every subsequent similar case, treating the one-off as a new default. The user flagged this explicitly: **"CLAUDE tends to do this all the time, will get approval for something some place and then assume user has approved all similar situations after that."** Incident-class.

When the user approves a deviation, exception, workaround, or shortcut:

- **The scope is exactly what was asked.** Not the pattern, not the category — the specific instance.
- Do **not** silently apply the approval to another file, another endpoint, another test, another migration, another anything — even if it looks structurally identical.
- If the same situation arises again, **ask again**. Yes, this feels repetitive. That's the point: the second question is where the user gets to say "actually, generalize this" or "no, still just that one."
- When about to apply a previously-granted exception to a new case, phrase it as a question: *"You said X was fine for Y — should I do the same for Z?"* Do not phrase it as an announcement.

**"Similar" means:** any of — same file pattern, same test type, same code style, same layer, same operation. If you find yourself thinking "this is basically the same," this rule is firing.

**Corollary:** approvals decay. An approval from last session is not an approval for this session unless it was recorded as a decision or a rule. If it wasn't durable enough to write down, it wasn't durable enough to reuse.
