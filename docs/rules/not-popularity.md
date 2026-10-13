---
id: not-popularity
scope: shared
title: Never pick a library / framework / approach based on popularity — weigh fit
priority: must
appliesToKeywords:
  - popular
  - "most used"
  - "everyone uses"
  - "widely adopted"
  - "industry standard"
  - "de facto"
  - "the standard"
  - stars
  - downloads
  - "most projects"
  - trending
created: 2026-07-24
---

**Why:** "N million weekly downloads" is not an argument. Popular tools solve popular problems, which are not always **our** problems. Defaulting to the majority choice without evaluating fit ships accidental complexity and reproduces mistakes at scale.

When choosing between libraries, frameworks, patterns, or approaches, weigh them on:

1. **Intent** — was this built to solve OUR problem, or is our problem a subset / superset of what it targets? A superset drags along complexity; a subset forces workarounds.
2. **Scope** — does the surface area match our need, or are we bringing in ten features to use one?
3. **Patterns and practices** — does it align with idiomatic patterns of our stack, or force us to fight our own conventions?
4. **API surface** — does it expose the concepts we care about, or hide them behind abstractions we'll fight later?
5. **Failure modes** — when it goes wrong, is the error legible? Can we reach in and fix it?
6. **Ownership & momentum** — is it maintained? By whom? What's the release cadence?

**Popularity belongs in this list only as a proxy for (6).** Never a top-order reason on its own.

**When recommending:** state the fit-based reason first; mention popularity only as supporting evidence for maintenance / community. Never lead with "X is the most popular."

**Contrarian check:** before locking in the popular default, spend 2 minutes on "what does a well-informed contrarian pick here, and why?" Even if the default wins, you'll know why. If it doesn't, you just dodged a bad choice.
