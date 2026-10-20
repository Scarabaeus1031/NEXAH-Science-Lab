# A0-BL-055 — Cross-Carrier Return Economy result

Date: `2026-10-18`  
Status: `CLOSED / OWNER_ACCEPTED_RETURN_GRAMMAR_PASS_ECONOMY_GENERALIZATION_FAIL_2026-10-18`

The frozen source lock passes `11/11`. Primary and Replay are byte-identical at
SHA-256 `a858f934b6ef18bfae116d20f36b98e34ccfedfb1d2692691df469cdecb9fa0f`.
Both independent structural verifier invocations pass `20/20`; all eight audit
gates pass.

## Registered result

`MIXED_RETURN_GRAMMAR_PASS_ECONOMY_GENERALIZATION_FAIL`

| Carrier | Sources | Raw fixed bits | Exact record bits | Saving | Exact Return | Economy advantage |
|---|---:|---:|---:|---:|---:|---|
| Q106/O16 P1 + residual | 106 | 7 | 7.000000 | 0 | `106/106` | no |
| Typed Seam C4 + residual | 140 | 8 | 7.535714 | 0.464286 | `140/140` | yes |
| Decimal paired view | 9,000 | 14 | 14.000000 | 0 | `9000/9000` | no |

All three carriers support the declared view/residual-or-joint-view/exact-
Return grammar. The preregistered economy threshold required positive saving
on at least two carriers; only one of three passes.

## Controls

- Q106's matched shuffled map has the same seven-bit cost while changing
  `100/106` assignments, so equal cost does not select a canonical map.
- Typed Seam's matched 106-address invalid glue returns only `106/140` and
  mixes 30 levels; the positive saving is tied to the typed seam plus residual.
- Each decimal deletion plus its removed digit costs 14 fixed-width bits, the
  same as the joint realized-image index and the optimal raw source ID; joint
  sufficiency is not compression.

## Interpretation

The cross-carrier result supports a reusable **Return grammar**, not a general
Return-economy law. Exact recoverability and bit saving are separate
properties. The Typed Seam advantage is carrier- and contract-specific; it
must not be generalized from the Q106 or decimal parity cases.

Not established: universal compression, carrier identity, canonical mapping,
physical information, Human utility, historical intent, novelty or
publication readiness. The Human Owner accepted this bounded mixed result on
`2026-10-18`; the cycle is closed.

