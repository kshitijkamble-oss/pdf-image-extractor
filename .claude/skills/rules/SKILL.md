---
name: rules
description: List, inspect, author, and check rules in docs/rules/
---

# /rules

Rules live as one `.md` per file in `docs/rules/`, each with frontmatter. See
`docs/rules/README.md` for the frontmatter contract and loading semantics.

## Subcommands

| Form                                          | Behavior                                                    |
|-----------------------------------------------|-------------------------------------------------------------|
| `/rules`                                      | Same as `/rules list`.                                      |
| `/rules list [scope]`                         | Table: id, scope, priority, title. Filter by scope if given.|
| `/rules show <id>`                            | Print full rule (frontmatter + body).                       |
| `/rules new <slug>`                           | Copy `_template.md` → `<slug>.md`; prompt for fields.       |
| `/rules check <text-or-path>`                 | Show which rules would match. Debugs hook behavior.         |
| `/rules why <id>`                             | Print just the **Why** paragraph.                           |
| `/rules promote <id>`                         | Set `priority: must`.                                       |
| `/rules retire <id> <reason>`                 | Set `status: deprecated`, add a retirement note in the body.|
| `/rules supersede <old-id> <new-slug>`        | Create a new rule that `supersedes: [old-id]`; mark old as deprecated. |

For everything else (add keyword, add path, demote, tweak wording), edit the
rule file directly. The skill's job is state transitions and lookup, not
line-editing convenience.

## Authoring flow

1. `/rules new <slug>` — copies template.
2. Fill frontmatter. `priority: must` only if violating it would cause real
   harm; otherwise `should`.
3. `appliesToKeywords`: verbs and nouns the user or code would actually use.
   Not synonyms of the rule title.
4. `appliesToPaths` (optional): globs, not regex. Rooted at repo.
5. Body: **Why** paragraph + imperative content. Trim aggressively.

## Matching semantics (what the hooks do)

- **Prompt keywords:** case-insensitive substring match. A rule matches if
  ANY of its `appliesToKeywords` appears in the prompt.
- **File paths:** rule matches if ANY glob in `appliesToPaths` matches a file
  Claude reads or edits this turn.
- **Priority `must`:** titles + ids pre-loaded at session start. Bodies still
  only inject on match. Use `must` sparingly.
