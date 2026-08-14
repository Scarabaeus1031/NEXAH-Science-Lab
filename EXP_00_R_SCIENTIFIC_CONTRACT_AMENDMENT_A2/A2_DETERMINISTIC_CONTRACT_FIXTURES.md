# A2 Deterministic Contract Fixtures

All fixtures are metadata/arithmetic only and use no registered Rössler information.

## Seed dominance

| Fixture | Expected result |
|---|---|
| six identical stored binary64 contributions `0.1` | exact `2D3=G`; PASS |
| first contribution next binary64 above `0.1`, other five `0.1` | exact `2D3>G`; FAIL_DOMINATED |
| `G=0` | FAIL_AGGREGATE_NONPOSITIVE |
| `G<0` | FAIL_AGGREGATE_NONPOSITIVE |
| positive and negative contributions with G>0 | retain signs; exact comparison |
| fewer than three eligible seeds | INVALID_EXPERIMENT |
| NaN/Inf input | INVALID_EXPERIMENT |
| exact tied contributions | seed ID ascending |

## Null worlds

| Fixture | Expected result |
|---|---|
| N1 refit changes null field path support | original row stays; diagnostic score required; missing score invalidates replicate |
| N1 null top action differs | select corresponding stored all-action outcome; no simulation |
| N2 donor top action differs | observed carrier action/outcome stays fixed |
| N3 no different-seed donor | INVALID_REPLICATE → INVALID_EXPERIMENT |
| N4 subgroup total <10 | null construction undefined → INVALID_EXPERIMENT |
| N4_T and N4_F strata differ | retain two subworlds; P1 must pass both; P3 uses matching carrier |
| null rank missing on one fixed row | no row deletion/retry; invalid experiment |
| null regression has one endpoint class | invalid replicate/experiment |
| null population attempt uses intersection | contract violation |

## Monte Carlo

- `k=3`: p≈0.0199005, pass.
- `k=4`: p≈0.0248756, pass.
- `k=5`: p≈0.0298507, fail.

## N5 machine equivalence

Validator requires both tiers, 12/determinant/order, T/F V1 parameters, support quantile 0.99, B/target/refit/inverse-registration/ranking/population/tau/failure/count rules.

## Static mutation fixtures

The contract validator must reject missing N1 population, missing N5 support quantile, 199 null repetitions, missing exact dominance comparison, and a mutated N4 prose heading.
