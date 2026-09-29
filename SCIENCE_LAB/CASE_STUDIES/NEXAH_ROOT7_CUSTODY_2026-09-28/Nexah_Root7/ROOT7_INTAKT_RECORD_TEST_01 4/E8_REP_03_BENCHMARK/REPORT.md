# E8-REP-03 — Final Test Report

Date: 2026-09-21  
Decision: **PASS**

## Finding

The standard 240-root E8 coordinate model passes the full representation chain:

`E8 (8D) → H4 ∪ φH4 (4D) → Coxeter plane (2D)`.

The 4D projection contains two 120-root shells with radii `0.743496068920` and `1.203001910015`. Their ratio is `1.618033988749895`, differing from φ by `+2.220e-16`. Scaling the smaller shell by φ reproduces the larger point set with maximum nearest-point error `2.233e-15`.

Both shells match the canonical 600-cell H4 Gram histogram, contain an H4 simple-root Gram matrix, and pass all 14,400 root-reflection checks.

The 2D Coxeter projection produces eight rings of thirty points and four φ-scaled radius pairs. The Coxeter operator has exact order 30.

## Assertion register

| Assertion | Layer | Status |
| --- | --- | --- |
| `E8_ROOT_COUNT` | 8D | **PASS** |
| `E8_UNIQUE_ROOTS` | 8D | **PASS** |
| `E8_ROOT_NORM_SQUARED` | 8D | **PASS** |
| `E8_EDGE_COUNT` | 8D | **PASS** |
| `E8_VERTEX_DEGREE` | 8D | **PASS** |
| `COXETER_EXACT_ORDER` | operator | **PASS** |
| `COXETER_EXPONENTS` | operator | **PASS** |
| `COXETER_ORBITS` | operator | **PASS** |
| `COXETER_2D_RINGS` | 2D | **PASS** |
| `COXETER_PHI_RING_PAIRS` | 2D | **PASS** |
| `H4_TWO_SHELLS` | 4D | **PASS** |
| `H4_RADIUS_RATIO_PHI` | 4D | **PASS** |
| `H4_DIRECT_SET_EQUALITY` | 4D | **PASS** |
| `H4_CANONICAL_GRAM` | 4D | **PASS** |
| `H4_SIMPLE_ROOT_GRAM` | 4D | **PASS** |
| `H4_REFLECTION_CLOSURE` | 4D | **PASS** |
| `H4_SUBSPACE_INVARIANCE` | 4D | **PASS** |
| `NEG_GENERIC_REJECTED` | negative | **PASS** |
| `NEG_MODULAR_REJECTED` | negative | **PASS** |

## Negative controls

- The seeded generic 8D→2D projection produces `120` radius clusters with multiplicity pattern `[(2, 120)]`, not eight rings of thirty.
- The modular maps `i → 37i mod N` have operator orders `None, 4, 78, 460` for `N = 37, 137, 237, 11357`; none has 240 nodes or the E8/H4 metric and reflection structure.

## Interpretation

This is a calibration benchmark, not a novelty claim about E8. Its contribution to NEXAH is methodological: it gives a positive control where representation changes are genuine and invariants survive, plus negative controls where visual similarity does not establish identity.

## Boundary

`H4 ∪ φH4` is a union of two scaled root sets in the same four-dimensional projection space, not an orthogonal direct sum. The Möbius-Harmonic modular graphs remain a different object class unless a future test supplies a structure-preserving map and passes the same invariant gates.
