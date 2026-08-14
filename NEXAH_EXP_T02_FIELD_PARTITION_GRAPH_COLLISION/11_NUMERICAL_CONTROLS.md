# Numerical Controls

Primary: `n=201`, `h=0.02`, float64-equivalent Python binary64, derivative and
detector definitions in `02_FORMAL_PIPELINE.md`.

Small frozen sensitivity set:

1. grid resolutions `n=161` and `n=241` in addition to primary;
2. gradient threshold `0.016` and `0.024` in addition to `0.020`;
3. reverse seed enumeration before partitioning, then remap to canonical seed
   IDs, to test tie/order invariance;
4. exact serialized graph ordering check after reverse insertion.

This is not a parameter sweep. Sensitivity runs cannot replace the primary,
select a preferred threshold, or rescue a failed precondition. They report only:
candidate count/classes, matched seed coordinates, partition mismatch fractions,
binary edges, weighted boundary counts, and whether the primary qualitative
collision decisions persist.

Nearest-seed squared-distance ties within `1e-15` go to lexicographically smallest
canonical seed ID. Numeric certificate equality is fixed at `atol=rtol=1e-12`;
the derivative baseline threshold is `1e-10`. No tolerance may be estimated from
outputs.

