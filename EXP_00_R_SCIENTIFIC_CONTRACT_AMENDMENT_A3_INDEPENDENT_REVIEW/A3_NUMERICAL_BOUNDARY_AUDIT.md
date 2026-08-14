# A3 Numerical and Boundary Audit

## Seed dominance

**Exact dominance arithmetic: PASS.** For fixed carrier rows,

`sum_s g_s = (1/N) * sum_i [q(loss0_i)-q(loss1_i)]`,

so signed row-weighted contributions exactly decompose baseline-minus-augmented mean log loss over the same stored binary64 per-row losses. Exact rational ranking and `2D3<=G` require no division or tolerance.

| Fixture | Result |
|---|---|
| six equal binary64 `0.1` contributions | exact equality; PASS |
| one top contribution one ULP larger | `2D3>G`; FAIL_DOMINATED |
| six `0.1` plus smallest positive subnormal seventh contribution | `2D3<G`; PASS |
| signed cancellation with positive residual | exact deterministic comparison |
| `G=0` or `G<0` | FAIL_AGGREGATE_NONPOSITIVE without division |
| tied contributions | seed ID ascending |
| fewer than three eligible seeds | INVALID_EXPERIMENT |
| zero-row seed | excluded/reported |
| nonvarying endpoint seed with rows | included |

## Phase/quantile boundaries

Phase `+PI/-PI`, internal-edge equality, wraparound, right insertion, repeated cutpoints, first/last bins, and empty phase-bin search are exact and passed independent fixtures.

## Boundary verdict

The arithmetic and bin-closure algorithms pass. The complete numerical/boundary contract fails because the N4 support-distance values supplied to the quantile algorithm are not defined. Exact binning of an undefined metric is not a complete boundary rule.
