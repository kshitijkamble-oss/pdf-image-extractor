# Brainstorm — modern-look

_Entered 2026-10-19._

Styles shown to the user 2026-10-19: clean & modern / minimal / bold & colorful. **Chosen: clean & modern.** Accent: **blue**. Theme: **follow the system** (light and dark). Header **centered**. Empty file row shows **"No file chosen"**. **No** extra drop-area highlight.

How: plain CSS, no framework or package. Colors and radii as custom-property tokens on `:root`, overridden under `@media (prefers-color-scheme: dark)`. The native file input stays in the page, visually hidden inside a `<label>` styled as the "Choose a PDF" button, so keyboard and screen readers still reach it (`:focus-within` for the focus ring). Inline SVG icon. Only widely supported CSS (custom properties, flex, grid, media queries) — no `color-mix()`, `:has()`, `light-dark()` or container queries.
