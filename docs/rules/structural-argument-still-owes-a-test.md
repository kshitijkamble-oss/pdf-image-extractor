---
id: structural-argument-still-owes-a-test
scope: testing
title: A correctness argument made in the type system or the data shape still owes a test at the boundary
priority: should
appliesToKeywords:
  - true by construction
  - by construction
  - structural
  - unrepresentable
  - cannot happen
  - type-safe
  - invariant
  - guaranteed by
  - "the schema already"
  - "the type already"
  - controller
  - query param
  - parseQuery
  - parseOrThrow
  - typebox
  - optional
created: 2026-09-02
---

**Why:** "the types make this impossible" is an argument about *representable states*, not
about *what the running system does with a real request*. Three instances, two of them in
one arc (`b-20260818-015`):

1. **A criterion covered only by a required field.** The screen's defining rule — only
   completed, graded reviews appear — had no test: every fixture row satisfied it and the
   response schema made an ungraded row unrepresentable. But a required field turns a bad row
   into a **throw**, not an exclusion, and says nothing to the adapter that will replace the
   fixture. Caught at align.
2. **A seam tested one layer below where it exists.** Every test called the service directly,
   so the controller never ran. `Type.Optional(...)` handed to a root-position validator is
   *not* "this value may be undefined" — `Optional` is a property modifier — and the screen's
   own first request (no dates set) answered **400**. 589 tests and a clean typecheck passed
   over it. Caught only by an HTTP probe.
3. **`heavily-componentized-frontend`'s duplicate Show MDL** is the same shape: the assertion
   "a Show MDL control exists and works" is true of either control when two are on screen.

The pattern: a proof is offered in one medium (types, data shape, a single-element query) for
a claim that lives in another (behaviour at a boundary, under a real input).

Reach for the check whenever you catch yourself writing *true by construction*, *the schema
already guarantees*, *unrepresentable*, or *that cannot happen*. The structural argument is
usually right and worth keeping — it is not a reason to skip the test, it is a reason the test
will be short. Ask two questions:

- **Where does this actually get decided?** Test at that layer. Query parsing exists only at
  the controller, so a repo-wide habit of testing services and skipping controllers leaves it
  permanently uncovered. Validation, guards, and defaulting all live at boundaries a service
  spec never crosses.
- **What would a wrong input do?** If the answer is "throw" or "500" where it should be
  "excluded" or "400", the structure is not doing the job the criterion describes.

Corollary of `tests-land-with-the-code` (`must`), which says *when* tests are written; this
says *where*, and warns about the specific reason people believe they already have coverage.
