# Validation Rules

| Rule | Deterministic requirement |
|---|---|
| V1 | Every edge has typed source/target, operator, status, evidence, and provenance |
| V2 | `VERIFIED` requires at least one `VERIFIED` technical evidence reference; audit alone is insufficient |
| V3 | Computational `VERIFIED` requires an implementation reference; human interpretation cannot be computationally verified |
| V4 | Every preservation/loss/introduction assertion names an object and evidence IDs |
| V5 | `task_relevance.state=DEFINED` requires task ID, source, owner, adequacy criterion, and decision consequence |
| V6 | Every artifact uses `provenance_status=KNOWN` with locator or explicitly `UNKNOWN` |
| V7 | `EXACT` preservation and invertibility claims require verified evidence |
| V8 | Collision claims require distinct source refs and a target equivalence criterion |
| V9 | Negative results retain original claim, disposition, evidence, and reopening condition |
| V10 | `SYMBOLIC` content status cannot justify `VERIFIED` |

These rules are deliberately minimal. A valid record may still be scientifically wrong; validation establishes completeness and internal consistency, not truth.

