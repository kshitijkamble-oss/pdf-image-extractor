---
topic: backend-esm-switch
started: 2026-10-14
updated: 2026-10-14
backlog: b-20261014-008
status: done
---

# backend-esm-switch

The live site (https://pdf-image-extractor-two.vercel.app) returns 500 on every request. The backend is compiled as CommonJS, but NestJS 12 ships as ESM only, and on Vercel the `require()` of `@nestjs/core` throws `ERR_REQUIRE_ESM`. Switch `apps/backend` to ES modules so it starts on Vercel. GitHub issue #10.
