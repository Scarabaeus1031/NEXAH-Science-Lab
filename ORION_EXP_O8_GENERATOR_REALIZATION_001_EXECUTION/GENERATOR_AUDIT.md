# Generator audit

| Generator | F1 totality | F2 determinism | F3 involution | F4 information consistency |
|---|---|---|---|---|
| H6 | PASS | PASS | PASS | FAIL |
| R5 | PASS | PASS | PASS | FAIL |
| E23 | PASS | PASS | PASS | FAIL |

Each generator produced 54 F4 `DERIVED_TRANSPORT` failures among 108 positive
fixtures. In every one of the 162 mismatches, the direct and freshly
materialized representations contained identical typed-record multisets but
serialized their list elements in different orders.

Example: for the first H6 fixture, the direct list places block `[10,11]`
before `[2,3]` through lexicographic JSON-byte sorting, while fresh
materialization uses numeric tuple ordering and places `[2,3]` first. This is
an implementation canonicalization inconsistency, not information destruction
and not an observed algebraic generator relation. The frozen implementation
was not repaired.

