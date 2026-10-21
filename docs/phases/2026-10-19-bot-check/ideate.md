# Ideate — bot-check

_Entered 2026-10-19._

- **Problem:** no login, so anyone, including a bot, can call the upload routes and fill Blob storage (costs, abuse).
- **For whom:** the owner, who pays for storage.
- **Success:** a request to `/api/pdf/blob-token` or `/api/pdf/upload` with no valid human check gets rejected by the server. A real user on the page uploads as before, usually without seeing a puzzle.
- **Out of scope:** rate limiting, login (b-20261016-002).
- **If we don't:** storage can be filled by scripts at no cost to them.
