# Reconcile — backend-esm-switch

_Entered 2026-10-14._

**Outcome:** production `GET /api/health` returns 200 after PR #11 (ESM switch) and PR #14 (lazy font path). #10 closed.

**Followed the plan:** the chosen brainstorm option (switch to ESM per the NestJS migration guide) shipped as designed: `"type": "module"`, tsconfig `nodenext`, `.js` endings, `new Function` workaround removed. `@repo/shared` left alone, as prep said. Task 2 (multer) was skipped because the named import works at runtime.

**Diverted, and why (all recorded in implement.md):**
- Task 3b: prep missed a top-level `require.resolve`. The planner grepped for `require(`; typecheck passed because `@types/node` declares `require` globally. Found only by running the build.
- Task 3c: on Vercel the bundle leaves out `pdfjs-dist/package.json`, so the import-time lookup crashed startup. The bug predates the switch; the first crash hid it. User chose a lazy, fault-tolerant lookup over `vercel.json` `includeFiles`.
- PR #11 was merged before task 3c was pushed to its branch, so `main` got half the fix and #10 auto-closed while production was still down. Reopened #10 and landed 3c in PR #14.

**Lessons (candidates for rules, not yet written):**
- A clean typecheck does not prove an ESM switch runs; only starting the built app does.
- A clean local run does not prove a Vercel deploy runs: Vercel only bundles files it can trace, so any path built at runtime (`require.resolve`, pdfjs worker) can be missing. Check the PR preview before merging.
- Do not push new commits to a PR the user may already be merging; open a new PR, or say clearly that the PR changed.

**Punted:** upload storage and the missing pdfjs worker on Vercel (b-20261014-009, #12; log evidence in the issue); frontend not served on Vercel (b-20261014-010, #13).

**Definition of done (universal gates):** no item-specific AC/DoD exists for b-20261014-008. Lint and typecheck passed. Backlog flipped to done. Arc reconciled. Activity entry added. No ADR or rule changed.
