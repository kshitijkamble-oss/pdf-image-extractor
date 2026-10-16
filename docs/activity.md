# Activity log

Append at the **top**. One line per notable event: decisions, milestones,
external context, session outcomes. **Not** per-commit — git log covers
that; this file is for the events git can't see.

Format:

```
- YYYY-MM-DD — <one-line description, links welcome>
```

<!-- entries below -->

- 2026-10-16 — Download button per photo live on production (#27, PR #29): saves the stored PNG byte-for-byte via Blob's `downloadUrl`. Preview check skipped (auto mode blocked the in-page test); checked on production instead.
- 2026-10-16 — PDFs up to 20 MB upload on Vercel (#24, PR #26): browser uploads straight to a private Blob store with presigned URLs (OIDC), since connecting the store gave no read-write token. Checked on preview up to 19 MB; full production upload not re-run. Arc reconciled.
- 2026-10-14 — Frontend live at https://pdf-image-extractor-web.vercel.app (#13, PR #20): new Vercel project `pdf-image-extractor-web` proxies `/api` to the backend project. Vercel Services tried first, failed twice on preview (backend packaging), dropped. Still open: Blob cleanup (#18).
- 2026-10-14 — Uploads work on Vercel (#12, PR #17): images stored in a public Vercel Blob store `pdf-image-extractor-images`, pdfjs worker preloaded. Added three rules from the #10 reconcile (PR #16). Still open: frontend hosting (#13), Blob cleanup (#18).
- 2026-10-14 — Fixed the Vercel crash (#10): backend switched to ES modules (PR #11) and pdfjs font path made lazy (PR #14). Production health check returns 200. Uploads (#12) and frontend hosting (#13) still broken on Vercel. Installed Vercel CLI 63.1.2 and logged in.
- 2026-10-14 — Backfilled records for the app work in `226bf36`: backlog `b-20261014-002`…`007`, six arcs in `docs/phases/2026-10-13-*` (status done, marked reconstructed), and GitHub issues #3–#8 (filed and closed as completed). Reconstructed from the code; original plans and reasons were never recorded.
- 2026-10-14 — ADR [0001](decisions/0001-github-issue-before-app-work.md) accepted: GitHub issue before app work, none for workflow changes. Test issue #1 and workflow issue #2 filed and closed as not planned.
- 2026-10-14 — Installed GitHub CLI (`gh` 2.102.0) and logged in as `kshitijkamble-oss`.
- 2026-10-13 — First commit `226bf36`: PDF image extractor (NestJS backend, React frontend, shared types) plus the Claude workflow setup, all in one commit.
