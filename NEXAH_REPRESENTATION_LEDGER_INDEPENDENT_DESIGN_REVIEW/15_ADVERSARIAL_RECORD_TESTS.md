# Adversarial Record Tests

These are design inspections, not executed validator tests.

| Defect | Schema/rules result | Verdict |
|---|---|---|
| `VERIFIED` computational edge, empty implementation refs | conditional `minItems` rejects | `CAUGHT` |
| preservation object omitted | required field rejects | `CAUGHT` |
| task `DEFINED` without owner | `oneOf` rejects | `CAUGHT` |
| `content_status: SYMBOLIC` with `VERIFIED` | conditional rejects | `CAUGHT` |
| symbolic visual mislabeled `TECHNICAL/DATA` | no evidence-content eligibility field | `NOT_CAUGHT` |
| many-to-one operator labeled `EXACTLY_INVERTIBLE` with any evidence string | no collision/invertibility cross-rule | `NOT_CAUGHT` |
| negative claim erased by replacing record with empty array | no revision/non-deletion rule | `NOT_CAUGHT` |
| `NOT_QUANTIFIED` replaced by fabricated numeric value | number is syntactically accepted | `NOT_CAUGHT` |
| dangling evidence ID | schema cannot resolve | `NOT_CAUGHT` |
| duplicate evidence IDs with conflicting scopes | no uniqueness rule | `NOT_CAUGHT` |
| composite pipeline represented as one named operator | accepted | `NOT_CAUGHT` |

The schema catches important omissions but not the most consequential semantic/status manipulations. Overall: `ADVERSARIAL_BAD_RECORDS_CAUGHT = PARTIAL`.

