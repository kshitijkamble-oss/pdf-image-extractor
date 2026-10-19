# Ideate — page-drop-zone

_Entered 2026-10-19._

**Problem.** After #44 the drop target is a ~530px box at the top. Once photos are on screen the box can be scrolled away, and a drop just beside it does nothing, so users have to aim.

**Success.** A PDF dropped anywhere in the window is selected; a full-screen overlay makes it obvious the page will take the drop. Everything else from #44 (non-PDF error, picker cleared, no auto-extract) keeps working.

**Out of scope.** Layout changes (user picked "whole page is drop zone", not the full-width or big-empty-state layouts).
