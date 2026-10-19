# Backlog

Append-mostly. One `##` section per item. Managed via `/backlog` skill, but
hand-editing is fine and expected.

## Conventions

- **id:** `b-YYYYMMDD-NNN` — assigned on creation, never reused.
- **tag:** exactly one of `feature`, `bug`, `idea`, `brain-dump`, `tech-debt`,
  `question`, `spike`.
- **status:** `open`, `in-progress`, `done`, `dropped`. Default `open`.
- **created:** ISO date.
- **linked-phase:** path to `docs/phases/…` if an arc was started for it.
- **gh-issue:** URL of the GitHub issue filed with `gh issue create`, or
  `pending` if `gh` was not available. Work does not start while it is
  `pending` (rule `issue-before-work`). `n/a` for workflow items
  (`.claude/`, `docs/`) — only app work gets an issue.
- Body: 1–2 lines. If it needs more, it's a phase note, not a backlog item.

## Template

```md

## <slug>  <!-- id: b-YYYYMMDD-NNN -->
- **tag:** feature
- **status:** open
- **created:** YYYY-MM-DD
- **linked-phase:**
- **gh-issue:**

<1–2 line statement — what & why, not how>
```

---

<!-- items below this line -->

## issue-before-work  <!-- id: b-20261014-001 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:**
- **gh-issue:** n/a
- **decision:** `docs/decisions/0001-github-issue-before-app-work.md`

Workflow change, so no issue (#2 was filed, then closed as not planned). File a GitHub issue with `gh` before any work starts, linked from its backlog item, so the work is visible on GitHub and commits/PRs can point to it.

**Outcome:** rule, ADR 0001, hook and /backlog changes landed in fa44e6f.

## monorepo-setup  <!-- id: b-20261014-002 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-13-monorepo-setup/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/3

Monorepo setup with pnpm workspaces and turbo. Backfilled: built before tracking started, landed in `226bf36` on 2026-10-13.

## shared-api-contract  <!-- id: b-20261014-003 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-13-shared-api-contract/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/4

Shared API types package (@repo/shared). Backfilled: built before tracking started, landed in `226bf36` on 2026-10-13.

## backend-skeleton  <!-- id: b-20261014-004 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-13-backend-skeleton/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/5

NestJS backend skeleton with health check and image serving. Backfilled: built before tracking started, landed in `226bf36` on 2026-10-13.

## pdf-image-extraction  <!-- id: b-20261014-005 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-13-pdf-image-extraction/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/6

PDF upload endpoint that extracts embedded images. Backfilled: built before tracking started, landed in `226bf36` on 2026-10-13.

## caption-detection  <!-- id: b-20261014-006 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-13-caption-detection/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/7

Detect a caption for each extracted image. Backfilled: built before tracking started, landed in `226bf36` on 2026-10-13.

## frontend-gallery  <!-- id: b-20261014-007 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-13-frontend-gallery/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/8

Frontend page to upload a PDF and show extracted photos. Backfilled: built before tracking started, landed in `226bf36` on 2026-10-13.

## backend-esm-switch  <!-- id: b-20261014-008 -->
- **tag:** bug
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-14-backend-esm-switch/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/10

Backend crashes on Vercel with `ERR_REQUIRE_ESM`: it is built as CommonJS but NestJS 12 ships as ESM only. Switch `apps/backend` to ES modules. **Outcome:** done 2026-10-14 via PR #11 (ESM switch) and PR #14 (lazy pdfjs font path); production health check returns 200.

## vercel-upload-storage  <!-- id: b-20261014-009 -->
- **tag:** bug
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-14-vercel-upload-storage/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/12

Uploads return 500 on Vercel. Likely because images are saved to a local `uploads/` folder, which a Vercel function cannot write to or share. Decide where extracted images are stored. **Outcome:** done 2026-10-14 via PR #17: images go to a public Vercel Blob store on Vercel (disk locally), and the pdfjs worker is preloaded so Vercel bundles it. Production upload returns 201 and the image loads.

## vercel-frontend-hosting  <!-- id: b-20261014-010 -->
- **tag:** bug
- **status:** done
- **created:** 2026-10-14
- **linked-phase:** docs/phases/2026-10-14-vercel-frontend-hosting/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/13

`/` on Vercel returns `Cannot GET /`: only the backend is deployed. Decide how `apps/frontend` is hosted and how it reaches the API. **Outcome:** done 2026-10-14 via PR #20: second Vercel project `pdf-image-extractor-web` (root `apps/frontend`) proxies `/api/*` to the backend; live at https://pdf-image-extractor-web.vercel.app. Vercel Services was tried first and dropped.

## vercel-blob-cleanup  <!-- id: b-20261014-011 -->
- **tag:** tech-debt
- **status:** open
- **created:** 2026-10-14
- **linked-phase:**
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/18

Extracted images in the Vercel Blob store are never deleted, so storage grows with every upload. Decide when and how old images are removed. Also: since b-20261016-001, uploaded PDFs left in the private PDF store when the browser closes before `/api/pdf/extract` runs.

## rename-vercel-projects  <!-- id: b-20261015-012 -->
- **tag:** tech-debt
- **status:** in-progress
- **created:** 2026-10-15
- **linked-phase:**
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/22

Vercel project names didn't say which is frontend and which is backend. Renamed to `pdf-image-extractor-frontend` / `pdf-image-extractor-backend` with matching `.vercel.app` domains; frontend's `/api` rewrite now targets the backend's new domain. Old domains (`-web`, `-two`) still attached.

## upload-over-1mb-fails  <!-- id: b-20261016-001 -->
- **tag:** bug
- **status:** done
- **created:** 2026-10-16
- **linked-phase:** docs/phases/2026-10-16-upload-over-1mb/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/24

PDF uploads over ~1 MB fail on Vercel with 503 (over 4.5 MB with 413), though the app allows 20 MB. Fix by uploading from the browser straight to a private Blob store (PDF-only, 20 MB, short-lived tokens), checking it is a PDF, and deleting it after extraction.

**Outcome:** done 2026-10-16 via PR #26: browser uploads PDFs straight to a private Blob store with presigned URLs (OIDC). 0.29–19 MB checked on preview; a full upload on production not re-run yet.

## user-login  <!-- id: b-20261016-002 -->
- **tag:** feature
- **status:** open
- **created:** 2026-10-16
- **linked-phase:**
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/25

The app has no login, so anyone can upload or get an upload token. Add login when the app is shared beyond the owner or storage costs grow.

## download-photo  <!-- id: b-20261016-003 -->
- **tag:** feature
- **status:** done
- **created:** 2026-10-16
- **linked-phase:** docs/phases/2026-10-16-download-photo/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/27

Users can see the extracted photos but can't download them. Add a Download button per photo that saves the stored PNG as-is (full size, lossless) — the user chose this over pulling the original bytes out of the PDF.

**Outcome:** done 2026-10-16 via PR #29: Download link per photo using Blob's `downloadUrl`; on production the saved file matches the stored PNG byte-for-byte. Preview check skipped by the user's choice; tested on production instead.

## frontend-preview-uses-backend-preview  <!-- id: b-20261016-004 -->
- **tag:** idea
- **status:** open
- **created:** 2026-10-16
- **linked-phase:**
- **gh-issue:**

The frontend preview's `/api` goes to the production backend, so a PR's backend change can't be tested through the real app on preview. Point it at the same branch's backend preview. Found in download-photo, where the workaround was blocked by auto mode.

## button-text-after-extract  <!-- id: b-20261016-005 -->
- **tag:** feature
- **status:** open
- **created:** 2026-10-16
- **linked-phase:**
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/32

After a successful upload and extraction, the main button goes back to "Submit". Its text should match the new state, so the user knows the job is done and what pressing it again will do.

## download-button-alignment  <!-- id: b-20261016-006 -->
- **tag:** bug
- **status:** done
- **created:** 2026-10-16
- **linked-phase:** docs/phases/2026-10-16-download-button-alignment/
- **gh-issue:** https://github.com/kshitijkamble-oss/pdf-image-extractor/issues/33

The Download button under each photo is not lined up well. It sits right after the photo and description, so buttons land at different heights across cards. Agree the target look before building.

**Outcome:** done 2026-10-16 via PR #35: card is a flex column and the button uses `margin-top: auto`, so buttons in a row line up bottom-left. Checked locally in Chrome (650/578 → 636/636 px); new CSS live on production.
