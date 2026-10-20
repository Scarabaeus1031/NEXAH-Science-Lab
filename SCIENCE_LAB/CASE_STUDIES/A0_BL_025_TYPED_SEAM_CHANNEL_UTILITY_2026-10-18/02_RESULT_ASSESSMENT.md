# A0-BL-025 — Typed seam/channel utility result

Date: `2026-10-18`  
Status: `RESULT_READY / EXECUTION_STOPPED / AWAITING_OWNER_DISPOSITION`

## Registered result

`PASS_BOUNDED_TYPED_SEAM_ADVANTAGE`

The locked Primary and Replay are byte-identical at result SHA-256
`156392b5710c7f5a323b58ffa402fd0f2da6135f5a612ccd0ee9ac8e2e9043fc`.
The independent verifier passes `20/20` checks.

## Comparison

| Condition | Addresses | Exact source Return | Mixed-level classes | Mean address bits |
|---|---:|---:|---:|---:|
| `C0` disjoint | 140 | 140/140 | 0 | 8.000000 |
| `C1` apex only | 136 | 140/140 | 0 | 8.107143 |
| `C2` seam without residual | 106 | 106/140 | 0 | 7.000000 |
| `C3` reversed-level arbitrary glue | 106 | 106/140 | 30 | 7.000000 |
| `C4` typed seam + residual | 106 | 140/140 | 0 | 7.535714 |

The `C4` record therefore uses `0.464286` fewer mean bits than the fixed
eight-bit raw address while still reconstructing all 140 labelled source
incidences. The saving is conditional on the quotient address being known;
it is not a general compression theorem.

## Gates

- `H-U1` compatible-boundary advantage: **PASS**;
- `H-U2` typed Return advantage: **PASS**;
- `H-U3` designed zipper transition: **PASS**, 60 directed transitions with
  exact inverse;
- `H-U4` quotient/unfolded multi-ledger: **PASS**;
- declared rotation and reflection preserve equivalence: **PASS**;
- matched arbitrary gluing: **negative control works**, with 30 mixed-level
  classes.

## Interpretation

For this one finite SCC-003 carrier, the useful object is not the quotient
alone. The useful record is:

```text
quotient address + conditional source-incidence residual.
```

Removing the residual loses 34 of 140 source distinctions. Keeping only a
matched number of arbitrary pairings is also insufficient because the frozen
negative control mixes Pascal levels. The declared typed seam retains the
level, source-incidence Return, `D5` action and local inverse crossing while
using less mean address information than the raw fixed-width address.

## Claim boundary

Not established:

- physical flow, stability or energy transport;
- historical `+/-2,+/-3` zipper coordinates;
- a Riemann or critical-line mapping;
- Human usability;
- universal Grid-Fold-Channel architecture;
- advantage on a second non-isomorphic scientific carrier;
- publication readiness.

The result is ready for Human Owner acceptance, revision or rejection. No
successor is activated by the result itself.
