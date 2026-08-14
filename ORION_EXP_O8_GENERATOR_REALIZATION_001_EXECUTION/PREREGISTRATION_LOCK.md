# PREREGISTRATION LOCK — ORION O8 Generator Realization 001

## Immutable binding

- Experiment: `ORION_EXP_O8_GENERATOR_REALIZATION_001`
- Controlling preregistration: `ORION_O8_GENERATOR_REALIZATION_FEASIBILITY_PREREGISTRATION`
- Reviewed canonical SHA-256: `767c5cf968cc9800becf220580c3e688b20978d7679298564b2f682c78e9a903`
- Review state: `CRITICAL=0`, `MAJOR=0`, `MINOR=3`
- Lock timestamp UTC: `2026-08-10T20:43:54Z`
- RESULT KNOWN AT LOCK TIME: **NO**
- EXECUTED AT LOCK TIME: **NO**
- Prior execution package detected: **NO**

This file was created as the first artifact in this execution package. The
reviewed design hash was independently recomputed and matched before this file
or any experiment implementation was created.

## Frozen domain

```text
X_ORION = {0,...,9}^{Z_12}
          x Z_6
          x {FORWARD_23,REVERSE_32}
          x Z.
```

Authoritative fields are cyclic support `Z12`, twelve base-10 source digits,
phase `c`, ordered-relation orientation, and integer scale `u`. `G2`, `G3`,
`GR_struct`, exact `kappa`, weights, exact rational block means, and oriented
relation differences are reconstructed exactly from the authoritative record.

## Frozen generators

```text
g1 = H6:  i -> i+6 mod 12; a'(i+6)=a(i); c,q,u unchanged.
g2 = R5:  i -> 5-i mod 12; a'(5-i)=a(i); c -> -c mod 6; q,u unchanged.
g3 = E23: source,c,u unchanged; toggle FORWARD_23 <-> REVERSE_32;
          reverse ordered relation endpoints while retaining intrinsic types.
```

Transport of `kappa` is frozen as `K->{i+6:i in K}` for H6,
`K->{5-i:i in K}` for R5, and unchanged `K` with reversed endpoints for E23.

## Frozen tests

- F1: totality over every registered positive fixture and symbolic carrier.
- F2: identical input yields byte-identical output in fresh evaluations.
- F3: `T(T(x))=x` under canonical byte serialization.
- F4: no undeclared information loss or inconsistent reconstruction.
- F5: all three ordered pair compositions commute exactly.
- F6: every nonzero generator product has a nonidentity global signature.
- F7: exactly eight distinct global signature byte strings; all 28 pairs checked.
- F8: every generator composition remains in the registered schema.
- F9: direct, fresh, and stepwise transports agree exactly.

Canonical state order is `000,100,010,001,110,101,011,111`. Canonical
application order is H6, then R5, then E23 for asserted bits. Equality is byte
equality under sorted-key compact UTF-8 JSON with one trailing LF. Tolerance is
zero. No random seed exists because randomness is forbidden.

## Frozen negative fixtures

`N01` noncommutation; `N02` duplicate generators; `N03` nonempty identity
product; `N04` partial reciprocal; `N05` digit-parity projection; `N06` hidden
sorting loss; `N07` untyped G2/G3 swap; `N08` four-state phase-only image;
`N09` scale-reflection redundancy; `N10` unseeded stochastic permutation.
All ten must be rejected for the registered reason.

## Frozen acceptance rule

`OPERATIONAL_O8_REALIZED=YES` if and only if F1--F9, product redundancy,
information boundary, center/reference audit, and all ten negative controls
pass. A valid protocol with any feasibility failure returns `NO` and
`VALID_NEGATIVE_RESULT`. Protocol-integrity, negative-control, or replay
failure returns `INVALID_EXPERIMENT` and cannot support realization.

## Frozen information boundary

Experiment code may read only this lock, frozen preregistration contracts, and
registered fixtures. It may not read EXP-001 outputs, expected results,
scientific thresholds, null results, visual layouts, or external semantic
labels. `c_ref` remains an external evaluator interface and never becomes a
ninth operator state.

## Software/environment requirements

- Python `>=3.9`, standard library only;
- integer and `fractions.Fraction` arithmetic only;
- no network, random module, time-dependent logic, approximate comparison, or
  graph-isomorphism/best-alignment search;
- primary and replay run in separate directories from the same frozen source
  and copied frozen input contracts;
- primary generated outputs are forbidden inputs to replay;
- canonical result bytes are hashed with SHA-256.

## Immutability

After this timestamp no domain, generator, map, fixture, acceptance criterion,
serialization rule, transport rule, information boundary, or negative control
may change. Any such change invalidates this lock and requires a new reviewed
preregistration version.
