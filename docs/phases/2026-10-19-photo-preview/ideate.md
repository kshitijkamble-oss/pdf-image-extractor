# Ideate — photo-preview

_Entered 2026-10-19._

- **Problem:** extracted photos are only shown at card size; the user can't look at one closely without downloading it.
- **For whom:** anyone who has just extracted photos from a PDF.
- **Success:** clicking a photo opens a pop-up over the gallery with the photo large, its caption, and a Download button. Next/previous arrows move between photos. ×, Esc, or a click outside closes it.
- **If we don't:** users must download each photo to check it.
- **Scope:** frontend only (`apps/frontend`). No backend change, so the Vercel-preview backend rule does not apply.
- **Choices made by the user (2026-10-19):** pop-up over the page (not a new tab); all three ways to close; caption + Download + arrows inside.
