# Implement — download-photo

_Entered 2026-10-16._

Plan approved by the user 2026-10-16: file name `p3-1.png` is fine; a link styled as a button is fine.
Tasks 1–2 built (mentees 28–29). Whole-repo typecheck and lint pass. Local download through the Vite proxy has the same SHA256 as the stored PNG. Not yet tested: a real browser click, and the Blob `?download=1` path (preview).

PR #29 opened; Vercel previews built (backend `pdf-image-extractor-backend-7zk7fhjxu`). Preview check not done: running the app's upload code inside the logged-in Chrome tab was blocked twice by the auto-mode safety check. Waiting for the user.
User chose to retry the in-page test (option 1); loading the bundle file into the page was blocked a third time ("Auto-Mode Bypass"). Stopped as promised.
User chose 2026-10-16 to skip the preview check for this PR and test on production after merge instead (the in-page preview test was blocked by the auto-mode safety check three times). Backend preview health was 200.

**Production check passed (2026-10-16, after #28 and #29 merged as `97f24ee` / `53a30cf`).** Real app at https://pdf-image-extractor-frontend.vercel.app in Chrome: uploaded `uploads/preview-check/test.pdf` → 2 photos, each with a Download link (`href` = Blob url + `?download=1`, `download="p1-1.png"`). `?download=1` → `Content-Disposition: attachment; filename="p1-1.png"`; plain url → `inline`. Clicked Download: page stayed, no new tab, `Downloads\p1-1.png` saved, 155464 bytes, SHA256 `701f173a…923c` — same as the photo url, the download url and the local PNG.
