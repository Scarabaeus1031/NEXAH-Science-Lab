# PROT-FOLD-01 — Conformer Ensemble / Frame / Quotient / Residual

Date: `2026-09-22`

Original intake status: `DRAFT_NOT_FROZEN_NOT_EXECUTABLE / DATA_NOT_BOUND`

Current status: `PHASE_A_FRAME_FIDELITY_CONFIRMED`

Execution status: `PHASE_A_EXECUTED_PASS`

## Question

Can one experimentally constrained native-state protein conformer ensemble be
carried through declared source-frame, centered-frame, body-frame and local
orientation views while preserving a typed account of invariants, gauge/frame
choice, information loss and reconstructability?

The planned carrier is an ensemble indexed by model/conformer number:

```text
X^(m), m = 1,...,M
```

The index `m` is not time. This package does not model or claim an observed
folding trajectory.

## Bound primary carrier

RCSB PDB `1XQQ`: a Solution-NMR ensemble of human ubiquitin with 128 submitted
conformers and 76 residues. The RCSB PDB-format source is bound in
`SOURCE_BINDING.json` with SHA-256
`88182fc83c2c5081f993ccdad6f4b628c1b52d39b3aea601bf568a0b6f4d45c1`.

Preferred phrase:

`EXPERIMENTALLY CONSTRAINED NATIVE-STATE CONFORMER ENSEMBLE`

Prohibited phrase for this carrier:

`OBSERVED FOLDING TRAJECTORY`

## Phase structure

```text
Phase A — Source / Centered / Body Frame Fidelity                 [PASS]
Phase B — Local Orientation and Quaternion Audit                [HOLD]
Phase C — FEATURE8 / AXIS08 after NATURAL_PAIR_GATE only         [HOLD]
Phase D — optional Mod-7/11 Address Sidecar                      [HOLD]
```

Phase A was frozen and executed. All eleven primary gates passed; see
`04_PHASE_A_EXECUTION_PREREGISTRATION.md` and `05_PHASE_A_RESULTS.md`.
Phases B–D remain unauthorized/on hold.

## Boundaries

- E8 remains an external exact calibration carrier. No protein–E8 mapping is
  defined here.
- `AXIS08_PAIR_STATUS = UNRESOLVED`.
- `MOD7_11_PROTEIN_SIDECAR = HOLD_PENDING_TYPED_UTILITY_QUESTION`.
- Hopf projection is a noninvertible orientation view unless its `S1` fiber
  coordinate is retained as a typed residual.
- Protein coordinates are bound only for Phase A. No genetic-code table or
  chemistry source is bound.
- No biological result or new capability is claimed.

## Read order

1. `03_REPAIR_R1_CARRIER_AND_PAIR_SEMANTICS.md`
2. `04_PHASE_A_EXECUTION_PREREGISTRATION.md`
3. `SOURCE_BINDING.json`
4. `phase_a_protocol.json`
5. `05_PHASE_A_RESULTS.md`
6. `phase_a_results.json`
7. `01_INTAKE_AND_OPERATOR_CONTRACT.md`
8. `02_PREREGISTRATION_DRAFT.md`
9. `SOURCE_PLAN.md`
10. `CHANGELOG.md`
