# A4 Numerical and Boundary Audit

## Independently reproduced

- Seed dominance: six binary64 `0.1` contributions pass exact `2D3=G`; replacing one with `0.10000000000000002` fails; signed negatives remain; `G=0` and `G<0` fail; fewer than three eligible seeds invalidates; exact ties break by ascending seed ID.
- Monte Carlo: `k=4` passes and `k=5` fails; slots must be exactly 200, so 199/201 invalidates.
- Phase: `+π` normalizes to `-π`; both enter bin 0; internal-edge equality enters the higher bin.
- Quantiles: equality is right insertion; repeated cuts preserve empty intermediate bins.
- N4: full-training LOO excludes only the identical diagonal; recipient equality at a cutpoint enters the higher decile; deterministic merge is higher-first then lower.
- N5: Kendall exactly `.99` passes.
- P2: bootstrap lower endpoint exactly zero fails because the rule is strictly `>0`.
- Frozen support: distance exactly equal to threshold is supported (`<=`).
- Sensitivity registry contains exactly six axes/two values each.

## Blocking numerical encoding

A4 machine adds `seed_dominance.aggregate_identity_tolerance: 0.0`, while prose merely says “Aggregate identity” is a validity requirement. A2's accepted rule makes dominance arithmetic exact rational; A1's earlier identity check compared a primary float aggregate with tolerance `1e-12`. A4 does not type the two operands of its zero-tolerance identity.

If it means rational `G` compared with a separately reduced exact rational sum of the same stored row losses, equality is exact and no tolerance field is needed. If it means comparison with the primary float aggregate, zero tolerance can fail because reduction order/rounding differs. Two implementers can choose differently. This is a class-B encoding defect because the dominance estimand itself is already fixed; the machine field must be removed or precisely typed in a corrective contract.

**Numerical/boundary verdict: FAIL** due to that classification-blocking identity ambiguity, not due to the tested 50%/bin/null thresholds.

