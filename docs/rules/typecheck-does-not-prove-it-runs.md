---
id: typecheck-does-not-prove-it-runs
scope: tooling
title: After a module-system or build-config change, start the built app — a clean typecheck proves nothing about runtime
priority: should
appliesToKeywords:
  - esm
  - commonjs
  - es module
  - nodenext
  - moduleResolution
  - tsconfig
  - import()
  - build config
  - bundler
created: 2026-10-14
---

**Why:** Found 2026-10-14 switching `apps/backend` to ES modules (arc `docs/phases/2026-10-14-backend-esm-switch/`). Typecheck passed after every task, yet the first `node dist/main.js` crashed: a top-level `require.resolve` was left in `pdf-image-extractor.ts`. `@types/node` declares `require` as a global, so TypeScript is happy with it even in an ES module, where it does not exist. The planner's grep for `require(` also missed it, because `require.resolve` does not contain that text.

When a change touches how code is loaded — `"type"` in package.json, tsconfig `module` / `moduleResolution` / `target`, a bundler or build config, `require` ↔ `import` — the task is not done until:

1. Old build output is deleted and the app is rebuilt from scratch, so stale files cannot hide a failure.
2. The built app is started and reaches its "started" log line.
3. One real request runs every lazily loaded module (for this app: an upload, which loads pdfjs and sharp).

When searching for leftovers, search the bare identifier (`require`, `__dirname`, `__filename`, `module.exports`), not a call shape like `require(`.
