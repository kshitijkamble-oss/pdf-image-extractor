# Acceptance criteria

One section per open backlog item, keyed by id. Definition of Done is the companion
file — [definition-of-done.md](definition-of-done.md).

**AC answers "did we build the right thing." DoD answers "is it shippable."**
An item is finished only when both pass.

## How to read this

- **Satisfies** — the behaviour this item must deliver, stated so a reviewer can check it.
- **Blocked by** — an unanswered `question` or unrun `spike`. A live blocker means the item
  cannot start, not that it ships with a caveat.

---

<!-- items below this line -->

## b-20261014-010 — vercel-frontend-hosting

**Satisfies**
- On the PR's Vercel preview, `GET /` shows the upload page (not `Cannot GET /`).
- From that page, uploading a PDF with an image shows the extracted image.
- `GET /api/health` still returns 200.
- No error for these requests in `vercel logs`.
- Local dev (`pnpm dev`) still works as before.

**Blocked by** — none.