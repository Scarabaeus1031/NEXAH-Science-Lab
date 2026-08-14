# Generator audit

| Generator | F1 | F2 | F3 | F4 | Raw-order diagnostic | Canonical mismatches |
|---|---|---|---|---|---:|---:|
| H6 | PASS | PASS | PASS | PASS | 54 | 0 |
| R5 | PASS | PASS | PASS | PASS | 54 | 0 |
| E23 | PASS | PASS | PASS | PASS | 54 | 0 |

Raw list-order differences remained visible as diagnostics. Semantic typed
canonical equality eliminated them without changing any record content.

