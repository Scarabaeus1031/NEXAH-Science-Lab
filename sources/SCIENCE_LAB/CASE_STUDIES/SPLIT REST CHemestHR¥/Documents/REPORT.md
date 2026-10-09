# ORION Architectural Seam — Minimal Synthetic Benchmark v1

**Date:** 2026-08-22  
**Status:** COMPUTATIONAL RESULT on synthetic data  
**Scope:** representation reconstruction only; no chemical or physical claim

## Question

Does a correctly assigned orientation key restore provenance lost by the projection
`q = s1 + s2` better than either incomplete map, a false key, or a random key?

## Declared architecture

- Ground truth: `(s1, s2)`, with each step in `{-1,+1}`.
- Map A retains `q` in `{-2,0,+2}`; at `q=0`, order is lost.
- Map B retains the orientation key `s1` but not `s2`.
- Seam decoder: `s1 = key`, `s2 = q - key`, rejecting impossible pairs.
- Binary path multiplicity is exactly `1:2:1`.

Twenty predeclared seeds × 20,000 cases were run at each key-flip noise level.
Invalid decodes count as full component error, so abstention is not rewarded.

## Primary result — zero noise

| Condition | Exact reconstruction | Component error | Invalid/abstention |
|---|---:|---:|---:|
| A alone | 0.750 | 0.250 | 0.000 |
| B alone | 0.499 | 0.250 | 0.000 |
| Correct coupling | 1.000 | 0.000 | 0.000 |
| False coupling | 0.000 | 1.000 | 0.501 |
| Random coupling | 0.499 | 0.501 | 0.250 |
| Missing key | 0.000 | 1.000 | 1.000 |

The predeclared success inequality holds at zero noise: correct coupling has lower
component error than A alone, B alone, false coupling, and random coupling.

## Stress result — 20% key flips

| Condition | Exact reconstruction | Component error | Invalid/abstention |
|---|---:|---:|---:|
| Correct coupling | 0.800 | 0.200 | 0.100 |
| False coupling | 0.200 | 0.800 | 0.401 |
| Random coupling | 0.499 | 0.501 | 0.251 |

## I–L–A–U ledger

- **I — Retained:** aggregate state `q`; first-step orientation in the keyed map.
- **L — Lost:** order/provenance of the two `q=0` paths in Map A.
- **A — Introduced:** fixed tie-breaks, decoder, invalid-state rule, noise model.
- **U — Unresolved:** transfer to non-synthetic data; usefulness under asymmetric
  class distributions; learned decoders; calibration of uncertainty.

## Verdict

The benchmark passes as a **formal proof-of-method**: when the ambiguity is exactly
the provenance removed by the projection, a correct side key restores it, while
false and random couplings do not. This is not yet evidence that a selected real
dataset contains such a seam or key.

## Falsification / next gate

The architecture fails to generalize if, on a predeclared external dataset, correct
coupling does not beat A alone, B alone, false coupling, and random coupling under
the same scoring and uncertainty rules. The next test should therefore use two
independently meaningful incomplete maps, not another synthetic encoding of the
same construction.
