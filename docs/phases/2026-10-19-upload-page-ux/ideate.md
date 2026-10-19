# Ideate — upload-page-ux

_Entered 2026-10-19._

**Problem.** Someone opening the page sees a title, a bare file picker and a "Submit" button in a loose stack. Nothing tells them what the page wants, they can only pick a PDF through the file dialog, and after extracting nothing says how many photos were found. The button then flips back to "Submit" (#32), so it looks like nothing happened, or like pressing it again would do something new.

**For whom.** Anyone using the app to pull photos out of a PDF, usually for the first time.

**Success looks like.**
- The page reads as one clear step: "drop or pick a PDF, then extract."
- A PDF can be dropped onto the page as well as picked.
- After extracting, a line says what came out ("Found 12 photos in report.pdf" / "No photos found").
- The button text matches the state before, during and after extraction.

**If we don't.** The app works, but feels unfinished, and first-time users have to guess.

**Out of scope.** Colors/theme, mobile layout, the photo grid and preview pop-up (#38 and others).
