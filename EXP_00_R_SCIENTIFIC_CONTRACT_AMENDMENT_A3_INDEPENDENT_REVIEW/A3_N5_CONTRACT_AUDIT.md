# A3 N5 Contract Audit

## Verdict

**N5 CONTRACT: PASS.**

| Requirement | A3 evidence | Result |
|---|---|---|
| Two tiers/purposes | `N5.tiers`, N5 prose | PASS |
| First 12, determinant +1, row-major lexicographic order | explicit matrix list plus construction/selection | PASS |
| Once per transform; zero MC | explicit counts | PASS |
| Exact synthetic fixture and all-action training paths | machine fixture | PASS |
| V1 T/F hyperparameters; support 0.99 | explicit values | PASS |
| `x'=Qx`, `B'=QB`, standardizer/target transform, no reselection | transform block | PASS |
| Transform every training/query/path state | explicit booleans/rule | PASS |
| Support and both representations refit | explicit | PASS |
| Inverse registration before original target score | explicit | PASS |
| Weak ranks/Kendall tau-b/undefined cases | ranking block | PASS |
| Minimum over every representation/query/Q; `>=0.99` | explicit aggregation/operator | PASS |
| SYNTH population/stage/failure | ≥20, preauth, implementation failure | PASS |
| RUN fixed population/stage/abstention/failure | explicit before outcomes; invalid experiment | PASS |
| No P1–P3 stochastic role | deterministic validity-only | PASS |

Independent generation of all determinant-`+1` signed permutations and row-major sorting reproduces A3's listed twelve matrices exactly.
