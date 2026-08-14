# A5X Independent Semantic Mutation Report

| Mutation | Detection |
|---|---|
| parity raw mismatch | detected |
| analytic access/import | detected for exact encoded tokens |
| train fit from TEST | detected |
| identical representation families | detected |
| arbitrary support seed keys | **missed** |
| N1 forward map | **missed by semantic validator** |
| N2 unit | detected |
| N3 same-seed/binding/clockwise | detected |
| N4 distance | **missed** |
| RNG namespace/serialization | detected |
| RNG bits/fresh-stream fields | **missed** |
| row order | detected |
| action order | **missed** |
| N5 count/aggregation | **missed** |
| N5 raw matrix/transform omission | **missed** |
| null transformation/statistic identity | **missed** |
| seed-dominance omission | **missed** |
| sensitivity ID/path/value/config | detected |
| sensitivity invalid support/provenance | **missed** |
| P1/P2/P3 producer Booleans | **missed** |
| P4 report-only registry | **missed by semantic validator** |
| P5 variant/interval fields | **missed** |
| classifier precedence | detected |
| invalidity precedence | detected |
| Lorenz ceiling | detected |

Root hashing detects byte changes, but semantic validation must independently establish accepted meaning. Multiple material mutations/omissions survive the semantic layer. **Semantic mutation validation: FAIL.**

