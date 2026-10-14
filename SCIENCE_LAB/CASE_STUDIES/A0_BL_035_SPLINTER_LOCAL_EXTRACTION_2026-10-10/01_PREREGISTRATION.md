# A0-BL-035 — Frozen preregistration

Date: `2026-10-10`

Status: `DESIGN_FROZEN_BEFORE_EXECUTION`

## Primary question

For frozen histories `h`, test whether adding a local Splinter signature to
the address reduces ambiguity in the exact terminal class without reading the
class identifier:

```text
address(h)=address(h') and SPL_LOCAL_r(h)=SPL_LOCAL_r(h')
  implies class(h)=class(h') ?
```

Radii are fixed to `r in {0,1,2}`. The first radius satisfying the primary
rule is reported; no post-result feature selection is permitted.

## Exact extraction

The one-based address is `(event1.boundary_edge_index+1,
event2.boundary_edge_index+1)`. `SPL_LOCAL_r` contains the two edge profiles,
fresh-side choices, signed orientation tuple (`left=+1`, `base=0`,
`right=-1`), whether the second seam starts/ends at the first new vertex,
cyclic displacement modulo eight, and the radius-`r` boundary/Corner-Flag
words centered on both new vertices. Local words store profiles, symbolic
turn and only relative anchor markers; unrelated vertex names are discarded.

Models are frozen as:

- `M0`: address;
- `M1`: M0 plus edge profiles;
- `M2`: M1 plus fresh-side and orientation tuple;
- `M3_r`: M2 plus relation, displacement and local words;
- `M4`: full two-event history, positive ceiling only;
- `M5`: terminal hash oracle, mandatory leakage control and never a candidate.

For each model report signature count, cross-class collision pairs, impure
signature count, `H(C|M)`, maximum classes per signature and compression
ratio.

## Symmetry correction and controls

The open five-face baseline has a seven-edge boundary and no declared `C5`
automorphism. Therefore a `C5` control would be undefined and is not silently
claimed. The frozen controls are:

1. simultaneous cyclic reindexing of the seven- and eight-slot addresses must
   preserve every metric;
2. zero- versus one-based addresses must preserve every metric;
3. `J` reflects address order, reverses local words, swaps incoming/outgoing
   and left/right orientation, preserves base, and must satisfy `J^2=id`;
4. remove fresh-side orientation, displacement and Corner-Flag order in
   declared ablations;
5. deterministically permute candidate signatures within address cells;
6. prove `M5` is rejected as leakage.

Failure of `J` to induce an observed class map is a valid bounded negative
secondary result, not an invalid experiment.

## Decision rule

- `SPLINTER_SUFFICIENT_COMPRESSED`: an `M3_r` has zero cross-class collisions
  and fewer than 100 signatures, with all mandatory controls passing.
- `SPLINTER_PARTIAL`: no `M3_r` is sufficient, but at least one strictly
  lowers both `H(C|M)` and impure signatures relative to M0.
- `SPLINTER_NOT_IDENTIFIED`: M3 does not improve M0, or only M4/M5 is
  sufficient.
- `UNDEFINED_CONTRACT`: an extractor cannot be constructed uniquely.
- `INVALID_EXPERIMENT`: hash, count, replay, leakage, indexing, symmetry or
  verifier control fails.

## Claim ceiling

The Study tests finite bookkeeping on one frozen history set. It establishes
no physical corridor, energy, membrane, universal operator, C5 symmetry,
canonical A0 vocabulary, PENT-08, `1008` map or generalized family.
