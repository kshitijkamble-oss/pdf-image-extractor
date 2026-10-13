---
id: renaming-a-path-drops-its-tooling-rules
scope: tooling
title: Move a path's tooling config in the same change that moves the path
priority: must
appliesToKeywords:
  - rename
  - move
  - "git mv"
  - "move the folder"
  - "move the directory"
  - relocate
  - restructure
  - "generated code"
  - codegen
  - "api-client"
  - biome
  - ls-lint
  - tsconfig
  - gitignore
created: 2026-09-17
---

**Why:** Found 2026-09-17 freezing `apps/webapp/app/api-client` as `app/api-client-legacy`. `biome.json` excludes `!**/app/api-client`; the copy under a new name matched nothing, so the next `biome check --write` reformatted 26 files of generated code. Nothing failed — lint passed, tests passed — the tree just quietly stopped being the bytes the generator produced. A path in a config file is a string match, not a reference: renaming the directory does not carry it, and nothing warns you.

Before moving or renaming any directory, grep the repo for its path and move every match in the same commit. The usual holders: `biome.json` (`files.includes`), `.ls-lint.yml`, `tsconfig*.json` (`paths`, `include`, `exclude`), `.gitignore`, `vitest`/`vite` configs, CI globs, and any codegen config's `output`.

The same string-matching hazard applies in reverse when you do the rename with `sed`: a repo-wide substitution on a path fragment hits **configuration as readily as imports**. The same 2026-09-17 change rewrote `openapi-ts.config.ts`'s `output: 'app/api-client'`, so codegen then wrote the new client into the frozen folder and destroyed it. Exclude config files from the substitution, or list the files to rewrite explicitly.

After any such rename, re-run the tools whose rules you just moved and check they still cover the new path — generated code being reformatted is the symptom you will not otherwise see.
