# A1 Deterministic Adversarial Fixtures

No registered data or experiment code was used. These fixtures test only contract logic.

| # | Fixture | Expected/observed contract result | Review |
|---:|---|---|---|
| 1 | All N5 transforms complete with tau=1 | PASS | coherent |
| 2 | One N5-SYNTH transform tau=0.98 | IMPLEMENTATION_FAILURE | coherent |
| 3 | One N5-RUN transform tau=0.98 | INVALID EXPERIMENT | coherent |
| 4 | Both rank vectors constant/equal; one-only constant | tau=1; tau=0 | explicit |
| 5 | Transformed support loses one fixed query | tier failure; row not dropped | coherent |
| 6 | Twenty seed contributions `+0.01` | G≈0.20, top3/G≈0.15, PASS | coherent |
| 7 | Three `+0.10`, seventeen `+0.001` | ratio≈0.946, FAIL_DOMINATED | coherent |
| 8 | Ten `+0.05`, ten `-0.024` | G≈0.26, ratio≈0.577, FAIL | conservative cancellation behavior |
| 9 | Contributions `+0.10,-0.10` | G=0, FAIL_AGGREGATE_NONPOSITIVE | coherent |
| 9a | Six equal contributions `0.1` | mathematical ratio=0.5 must pass; float64 ratio=`0.5000000000000001` fails | **blocking inconsistency** |
| 10 | P1 pass / P2 fail / P3 pass | proposition failure | coherent |
| 11 | P1 pass / P2 pass / P3 fail | proposition failure | coherent |
| 12 | P1–P3 pass / N5-RUN fail | INVALID EXPERIMENT | coherent |
| 13a | Monte Carlo k=3 | p≈0.0199005, PASS | correct |
| 13b | Monte Carlo k=4 | p≈0.0248756, PASS | correct boundary |
| 13c | Monte Carlo k=5 | p≈0.0298507, FAIL | correct |
| 14 | Trajectory P3 passes, learned-field P3 fails | P3 false | coherent |
| 15 | One required null statistic missing/nonfinite | INVALID EXPERIMENT | coherent |
| 16 | N2 permuted ranking changes F top action | A1 does not say whether outcome row remains fixed | **blocking ambiguity** |
| 17 | N1 refit changes learned-field path support | A1 does not define row membership | **blocking ambiguity** |

The fixture set supports N5 and Monte Carlo acceptance, but falsifies complete executability of B and C.
