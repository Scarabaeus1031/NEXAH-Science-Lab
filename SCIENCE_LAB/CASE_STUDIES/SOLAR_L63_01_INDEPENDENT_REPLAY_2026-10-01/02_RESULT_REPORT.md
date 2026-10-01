# SOLAR-L63-01 — Result report

**Date:** `2026-10-01`
**Execution count:** `1 / 1`
**Decision:** `FAIL_BOUNDED`
**Validity:** `VALID_EXECUTION`

## Executive result

The preregistered package fails one of six gates and therefore cannot be
reported as `PASS_BOUNDED`. The exact reference-reproduction gate required 247
post-burn RK4 crossings; the frozen dependency-free implementation produced
249. No threshold or implementation was changed after observing the output.

The five remaining gates pass. The independent adaptive Dormand-Prince 5(4)
run with cubic-Hermite/bisection event location produced 240 valid post-burn
crossings, evenly split by direction. Its section distribution agrees with the
fresh RK4 reference within the frozen bounds, while the raw post-crossing width
collapses approximately linearly with observation spacing. The observed
section return order also exceeds the frozen permutation null.

The correct disposition is therefore:

```text
FROZEN OVERALL GATE       = FAIL_BOUNDED
INDEPENDENT METHOD CHECK = SUPPORTS SECTION RELATION WITHIN FROZEN BOUNDS
EXACT HISTORICAL REPLAY  = NOT REPRODUCED
CONE OBJECT              = NOT SUPPORTED
AUTOMATIC SUCCESSOR      = NONE
```

## Gate table

| Gate | Frozen criterion | Observed | Result |
|---|---|---:|---|
| G1 reference reproduction | exactly 247 RK4 crossings | 249 | `FAIL` |
| G2 independent event validity | >=200; both directions; max abs(x)<=1e-9 | 240; 120/120; `3.383e-11` | `PASS` |
| G3 cross-integrator agreement | count difference <=0.15; normalized y/z quantile RMSE <=0.20 | `0.0361`; `0.0782`; `0.0923` | `PASS` |
| G4 sampling-width scaling | exponent in `[0.80,1.20]` | `0.8978803970` | `PASS` |
| G5 raw-sampling control | coarse p95>=0.10; fine < half coarse | `0.7478`; `0.1217` | `PASS` |
| G6 return-order null | abs(observed correlation) > permutation p99 | `0.3495 > 0.1636` | `PASS` |

## Interpretation

The independent integration/event-location path supports the bounded
representation distinction that motivated this case: a raw corridor produced
by finite observation spacing is not the same object as the declared x=0
Poincare section. The raw width shrinks with sampling interval, whereas the
root-located section remains within numerical x=0 tolerance and retains a
non-random ordered return relation.

The exact 247-crossing historical reference count did not reproduce under the
new dependency-free RK4 implementation. In a chaotic system, small arithmetic
and implementation differences can alter long-horizon event counts; this is a
plausible explanation, not a post-hoc repair or a passed reproduction claim.
The discrepancy is retained as the typed residual that forces the overall
`FAIL_BOUNDED` status.

## Claim ceiling

This is one valid bounded numerical-method result for canonical Lorenz-63. It
does not establish an astronomical relation, Solar-System mechanism, physical
cone, new attractor, general theorem about chaos, predictive capability,
product capability or external scientific novelty.

## STOP return

The authorized cycle is consumed. No rerun, tolerance change, alternate
reference count, plot series or successor is authorized by this result. Any
future replication would require a new Human Owner decision and a new freeze.
