# A2 R-01 Exact-Arithmetic Audit

## Verdict

**R-01 EXACT ARITHMETIC: PASS.**

A2 uniquely maps each finite binary64 per-row loss to its exact reduced integer ratio, uses exact signed rational arithmetic, ranks exact contributions with seed-ID tie-breaking, and decides without division or tolerance.

## Algebra

For carrier `c`, fixed row population size `N_c`, and seed partition `I_{c,s}`:

`sum_s g[c,s] = (1/N_c) * sum_i (q(loss0_i)-q(loss1_i))`.

This is the exact row-weighted decomposition of baseline-minus-augmented mean held-out log loss over the same frozen rows and predictions. Negative seed contributions remain signed. No per-seed refit occurs.

## Typed edges

| Case | A2 result |
|---|---|
| `G>0` and exact `2D3<=G` | PASS |
| `G>0` and exact `2D3>G` | FAIL_DOMINATED |
| `G<=0` | FAIL_AGGREGATE_NONPOSITIVE; no division |
| fewer than three eligible seeds | INVALID_EXPERIMENT |
| seed with zero rows | excluded and reported `NO_ELIGIBLE_ROWS` |
| rows but no endpoint variation | included |
| exact contribution ties | seed ID ascending |
| NaN/Inf | INVALID_EXPERIMENT |

## Independent deterministic fixtures

All inputs below are nonregistered binary64 toy values converted with exact rational semantics.

| Fixture | Exact boundary sign `2D3-G` | Result |
|---|---:|---|
| six binary64 `0.1` contributions | `0` | PASS |
| first contribution is next binary64 above `0.1` | `+1/2^56` | FAIL_DOMINATED |
| six `0.1` plus the smallest positive subnormal seventh contribution | negative | PASS; immediately below 50% |
| signed positive/negative contributions with positive `G` | exact signed values retained | deterministic PASS/FAIL by inequality |
| cancellation to exact `G=0` | n/a | FAIL_AGGREGATE_NONPOSITIVE |
| `G<0` | n/a | FAIL_AGGREGATE_NONPOSITIVE |
| six tied `0.2` contributions | `0` | PASS; order fixed by seed ID |
| two eligible seeds | n/a | INVALID_EXPERIMENT |

The rule permits no decimal reparse, approximate ratio, epsilon, or tolerance. Reproducibility is explicitly conditional on identical input binary64 bit patterns, which is the correct numerical boundary for this amendment.
