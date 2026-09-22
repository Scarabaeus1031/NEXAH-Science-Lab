# Repair R1 — Carrier and Pair Semantics

Date: `2026-09-22`

Status: `REPAIR_R1_COMPLETE / PHASE_A_LATER_EXECUTED_PASS`

## Repair authority

This record repairs the open intake created on 2026-09-22. The original
provenance remains an open, unexecuted draft; no earlier result is rewritten
because no source binding or numerical execution occurred.

## Corrections

| Original draft issue | Repair R1 decision |
|---|---|
| `X(t)` implied ordered dynamics | replaced by unordered `X^(m)`, model/conformer index only |
| world/body naming | `SOURCE_FRAME3N`, `CENTERED3N`, `BODY_FRAME3N`, `FRAME_RESIDUAL` |
| implicit physical motion recovery | limited to source-file frame reconstruction |
| Kabsch representative | declared gauge/frame choice; reference frozen before results |
| quaternion representation | records `u ~ -u`, convention, degeneracy and `SO(3)` metric gates |
| Hopf view | noninvertible unless the lost `S1` fiber is retained as residual |
| FEATURE8 last pair | accessibility/hydropathy coupling prohibited |
| AXIS08 pair | `UNRESOLVED`, blocked by `NATURAL_PAIR_GATE` |
| eight features and E8 | explicitly non-identical; protein–E8 map absent |
| Mod-7/11 primary test | moved to optional sidecar on hold |
| 76 protein residues vs CRT77 | protein does not fill the complete 77-address fixture |
| analysis sequence | split into Phases A–D; only Phase A may be prepared next |

## Executable-language removals

For 1XQQ, the following are prohibited: temporal path length, turn angle
between submitted models, transition speed, earlier/later semantics, events
between `m` and `m+1`, model order as time and folding-trajectory claims.

## Pair decision

```text
AXIS08_PAIR_STATUS = UNRESOLVED
NATURAL_PAIR_GATE = REQUIRED
```

Allowed terminal gate states:

```text
PASS_NATURAL_PAIR_DECLARED_BEFORE_RESULTS
STOP_NO_NATURAL_PAIR
CALIBRATION_PAIR_ONLY_NOT_BIOLOGICAL
```

No natural biological pair is declared by this repair.

## Phase disposition

```text
PHASE_A = FRAME_FIDELITY_CONFIRMED
PHASE_B = HOLD
PHASE_C = HOLD
PHASE_D = HOLD
SOURCE_BINDING = EXECUTED_PHASE_A_ONLY
NUMERICAL_TESTS = PHASE_A_PASS
```

The later execution does not change the Repair-R1 pair decision. AXIS08 remains
blocked and no natural biological pair was admitted.
