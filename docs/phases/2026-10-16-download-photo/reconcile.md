# Reconcile — download-photo

_Entered 2026-10-16._

**Followed the plan:** all three prep tasks shipped as written. The backend returns `put()`'s `downloadUrl` beside `imageUrl`; the frontend uses a plain `<a download>` link, so the stored PNG is saved byte-for-byte (same SHA256 locally and on production). File name `p1-1.png`, as the user approved.

**Diverted:** task 3 was meant to be a preview check before merge (rule `check-the-vercel-preview-before-merge`). The frontend preview proxies `/api` to the production backend, so the only way to test the new backend on preview was to run the app's upload code by hand inside the logged-in Chrome tab. The auto-mode safety check blocked that three times. The user chose to merge and test on production instead. Production check passed (see implement).

**Discovered:** a preview check that depends on injecting code into a page is fragile under auto mode. Worth fixing at the root: point the frontend preview's `/api` at the backend preview of the same branch, so the real app can be tested on preview. Not a rule yet; added as a backlog idea.

**Not covered:** colours are still converted to RGB (CMYK/ICC not kept) — out of scope by the user's choice of option 1.

**Definition of done:** universal gates met — whole-repo lint and typecheck passed, arc reconciled, backlog flipped to done. Issue #27 closed by PR #29.
