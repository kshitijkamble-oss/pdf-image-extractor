# Rules

One `.md` file per rule. Loaded on demand by `.claude/hooks/` — never all at
once. If a rule isn't earning its context slot, delete it.

## Frontmatter contract

```yaml
---
id: <slug>                    # required, unique, kebab-case
scope: shared                 # required: tooling | frontend | backend | shared | db | infra | testing
title: <one-line imperative>  # required, ≤100 chars, reads as an instruction
priority: should              # required: must | should | nice
appliesToKeywords: []         # optional; case-insensitive substring match against user prompt
appliesToPaths: []            # optional; glob patterns matched against edited/read files
supersedes: []                # optional; ids of older rules this replaces
created: YYYY-MM-DD           # required
---
```

Body: **Why** (constraint or incident that motivates the rule) + **How to apply**
(when/where it kicks in) + optional code example. Keep it under 40 lines. A rule
that needs 200 lines to explain is really a design doc.

## Loading rules

- **Session start** — hook loads titles + ids of every `priority: must` rule.
  Bodies are *not* loaded; they're pulled in on match.
- **User prompt** — hook greps the prompt against every rule's
  `appliesToKeywords`; matches inject the full body.
- **File touch** — when Claude opens/edits a file, rules whose `appliesToPaths`
  glob matches inject their body.

If a rule has no keywords and no paths and isn't `must`, it will effectively
never load. Either give it triggers, promote it to `must`, or delete it.

## Authoring

- `/rules new <slug>` copies `_template.md` and opens it.
- Prefer imperative titles: *"Use `pnpm`, not `npm`"* not *"Package manager"*.
- One rule = one behavior. Don't stuff five things into a "coding standards" rule.
- Rules override defaults, not each other. If two rules conflict, one is wrong —
  fix or `supersedes` it.
