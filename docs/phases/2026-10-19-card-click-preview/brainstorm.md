# Brainstorm — card-click-preview

_Entered 2026-10-19._

- **A. Wrap the whole card in a `<button>`** — rejected: the card's Download `<a>` would sit inside a button, which is invalid HTML.
- **B. Click handler on the card `div`, Download stops the click from bubbling** — chosen. The image `<button class="photo-open">` stays as the one keyboard stop; its click bubbles to the card. No extra tabindex/role on the card.
- **User choices (2026-10-19):** zoom-in cursor on the whole card; subtle hover border; plan approved.
