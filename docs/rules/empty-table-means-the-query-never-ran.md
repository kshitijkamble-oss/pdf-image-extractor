---
id: empty-table-means-the-query-never-ran
scope: testing
title: A query that has only ever run against an empty table has not been tested at all
priority: must
appliesToKeywords:
  - repository
  - query
  - queryBuilder
  - createQueryBuilder
  - findOne
  - typeorm
  - entity
  - seed
  - fixture
  - e2e
  - "real data"
  - naming strategy
appliesToPaths:
  - "apps/api/src/**"
  - "packages/backend/database/**"
created: 2026-09-16
---

**Why:** found at implement of `b-20260902-010`. `mdlDatabaseConfig` set no
`namingStrategy`, while the generated MDL entities are camelCase over snake_case
columns — so TypeORM emitted `"row"."packageId"` against a column named
`package_id` and **every MDL query failed**. `GET /v1/my-team-performance-mdl`
had shipped two days earlier carrying the identical fault and had never returned
a row. Its unit tests were green, its typecheck was clean, its reconcile said
"verified against real dev Postgres data." None of that was false — it was
answering a different question. The table was empty, so the query planner never
reached a column name, so nothing failed.

An empty table turns a broken query into a passing test. Row count zero is
indistinguishable from "works, no matches," and every layer above — mocks,
mappers, DTOs, the emitted spec — keeps agreeing with itself.

Before calling any data-reading endpoint done, run it against **at least one real
row**. `SELECT count(*)` on every table the query touches is the cheapest possible
check and it is not optional: a zero means the assertion "this works" is unfounded,
whatever the suite says. If the table cannot be populated yet, say so in the arc
note and in the acceptance criteria — "proven against real data" and "proven
against an empty table" are different claims, and only one of them is evidence.

Mocked repository tests do not substitute. They assert the code calls the ORM the
way the author expected, which is exactly the assumption that was wrong here.

**Example:**

```sh
docker exec mdl-postgres psql -U mdl -d mdl -t -A -c \
  'select count(*) from "MasterDataListRow";'
# 0  -> the mapper has never mapped a real row. Do not claim it works.
```
