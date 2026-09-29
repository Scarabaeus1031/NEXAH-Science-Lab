# NEXAH mod-6 prime-window state operator — final report

Date: 2026-09-28

## Status

`VALIDATED_STANDARD_MOD6_OCCUPANCY_OPERATOR`

The finite operator

\[
B_k=(\mathbf 1_{\mathbb P}(6k-1),\mathbf 1_{\mathbb P}(6k+1)),\qquad 1\le k\le100000,
\]

is a well-defined four-state description with states `11`, `10`, `01`, and `00`.

## Lock and reproducibility

- Preregistration SHA-256: `1aabd49df777351a7e0f260e765022800dcbc4efe07cfba9c945779d4dfab4b7`
- Primary scientific-result hash: `d6741bd785923548687c4540a8f535246555b07ba9ae13789c60dfde9cd083ea`
- Clean-replay scientific-result hash: `d6741bd785923548687c4540a8f535246555b07ba9ae13789c60dfde9cd083ea`
- Replay identical: **YES**

## Results

### T1 — frozen M-025 reproduction control

| State | Count |
|---|---:|
| `11` | 5,330 |
| `10` | 19,242 |
| `01` | 19,194 |
| `00` | 56,234 |

The counts reproduce the previously registered M-025 result exactly.

### T2 — first asymmetry

The first four windows are:

| k | pair | state |
|---:|---:|:---:|
| 1 | 5, 7 | `11` |
| 2 | 11, 13 | `11` |
| 3 | 17, 19 | `11` |
| 4 | 23, 25 | `10` |

Thus the initial three double-prime windows do not define a universal rule; the first non-`11` state occurs at `k=4`.

### T3 — transition counts

Rows are source states; columns are destination states.

| from \ to | `00` | `01` | `10` | `11` |
|---|---:|---:|---:|---:|
| `00` | 30,115 | 11,282 | 11,348 | 3,489 |
| `01` | 11,335 | 3,470 | 3,496 | 893 |
| `10` | 11,261 | 3,579 | 3,571 | 830 |
| `11` | 3,523 | 863 | 827 | 117 |

All four states and all sixteen transitions occur in the frozen range.

### T4 — singleton orientation

- left-only (`10`): 19,242
- right-only (`01`): 19,194
- normalized effect: 0.0012488292
- exact two-sided binomial p-value: 0.8105372257
- decision: `NO_MATERIAL_DIRECTIONAL_ASYMMETRY`

### T5 — matched lane-density alignment null

- observed `11`: 5,330
- expected under the preregistered blockwise independent-alignment null: 6,084.239
- relative difference: -0.123966
- z: -12.8944
- p-value: 4.83797685577e-38
- decision: `LANE_DEPENDENCE_DETECTED`

This is dependence relative to a local-density-preserving independence null. It is consistent with ordinary shared divisibility constraints in paired `6k±1` candidates. It is not evidence for a new prime law and does not prove or disprove an infinite twin-prime claim.

### T6 — prime-index parity

The lane/index-parity association has `phi=0.0097768`, `p=0.030288`, fails the frozen materiality threshold `|phi|>=0.05`, and is not stable across the ten registered blocks.

Decision: `NO_MATERIAL_ASSOCIATION`.

### T7 — prime-index primality

The lane/index-primality association has `phi=0.00355094`, `p=0.431397`, fails the frozen materiality threshold, and is not stable across the ten registered blocks.

Decision: `NO_MATERIAL_ASSOCIATION`.

## What this establishes

1. `6k-1` and `6k+1` define two candidate lanes, and their actual prime occupancy gives a reproducible four-state finite operator.
2. The initial `11,11,11,10` pattern and the full finite state/transition counts are computationally reproducible.
3. Left-only and right-only windows are balanced to the registered resolution.
4. Paired occupancy is not independent under the registered local-density null.
5. Prime value, one-based prime index, index parity, and whether that index is itself prime remain distinct namespaces.

## What this does not establish

It does not establish a prime generator, a privileged direction, a physical or resonance mechanism, a universal recurrence, an infinite twin-prime result, or predictive power beyond the tested finite range. The labels `bubble`, `boundary`, and `state operator` are representational language unless a separate mathematical contract supplies additional structure.

