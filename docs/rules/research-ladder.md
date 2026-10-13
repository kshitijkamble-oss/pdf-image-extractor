---
id: research-ladder
scope: shared
title: Follow the research ladder — official docs first, node_modules last, and mean it
priority: must
appliesToKeywords:
  - how does
  - how do i
  - how to
  - look up
  - find out
  - research
  - documentation
  - docs
  - reference
  - learn about
  - nestjs
  - react-router
  - hey-api
  - vitest
  - yarn
  - turborepo
  - biome
  - cucumber
  - gherkin
created: 2026-07-24
---

**Why:** Third-party libraries treated as opaque become bugs that "work by accident." When a question needs an answer about how a tool behaves, there is a correct order of sources — going out of order (or guessing from training data) is how we ship confidently-wrong code.

For any question about how a library / framework / tool works, walk this ladder in order. Do **not** jump ahead:

1. **Official documentation** (vendor's docs site). Use `WebFetch` on the canonical URL.
2. **Repo README / wiki** (project's own source repository — GitHub, GitLab, Azure Repos). Use the appropriate CLI (`gh`, `az repos`) or `WebFetch`.
3. **Source code** referenced from the docs (linked issues, PRs, source excerpts in guides).
4. **`node_modules/<pkg>/**`** — **LAST resort, and I mean it**. Only when 1–3 don't answer, and you must state up front that you're falling through to node_modules and why.

**Never:**
- Answer from training-baseline knowledge without verifying against a live source.
- Skip the ladder because "I already know how this works." You know how it worked at your knowledge cutoff. That is not the same as how it works today.
- Cite "the docs say X" without actually fetching the docs this session.

**When the source disagrees with your recollection:** the source wins.
