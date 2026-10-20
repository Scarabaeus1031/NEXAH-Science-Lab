# ORION Scientific Runner v1 — reference experiment result

Date: `2026-10-01`

Decision: `REFERENCE_PASS`

## Result

The deterministic reference experiment matched all seven preregistered ORION
classifications:

| ID | Test | Observed |
|---|---|---|
| A01 | energy under rotation | `INVARIANT` |
| A02 | anisotropic representation with declared inverse | `EQUIVARIANT` |
| A03 | radius in Cartesian and polar views | `INVARIANT` |
| A04 | energy under bounded two-axis perturbation | `ROBUST` |
| A05 | sign of `y` after x-only projection | `UNDEFINED` |
| A06 | phase-bin readout under a changed bin origin | `REPRESENTATION_DEPENDENT` |
| A07 | raw energy under anisotropic scaling | `FAILED` |

The result is important because the fixture does not reward every claim with a
pass. It distinguishes preservation, lawful frame transport, bounded change,
view dependence, information loss and direct contradiction.

## Verification

- unit and integrity tests: `5 / 5 PASS`
- registered assertions: `7 / 7 MATCH`
- Primary/Replay: byte-identical
- Primary and Replay SHA-256:
  `88544f82ca3f87bbf47a2cd8cd91f4c47a13cb87e31709fd018e8f25656e80c1`
- canonical protocol SHA-256 embedded in both results:
  `0f2da156f1bbcf0a771a3ff1a2639987e4cd07de922de82e4e62480fbc8466a5`

## Pre-release repair

The first development execution correctly rejected A04 because the drafted
`0.00021` tolerance did not cover the declared simultaneous two-axis shift.
Before reference release, the fixture was repaired once to the analytically
adequate `0.00030`; the observed maximum energy change was
`0.0002828627124746852`. No runner logic or observed result was altered.

## Interpretation and boundary

The implementation demonstrates a reusable, auditable ORION classification
kernel for finite declared fixtures. It does not yet demonstrate transfer to
an independently sourced domain, automatic discovery, causal inference,
navigation benefit or production capability. A future second reference should
therefore test the same unchanged runner on an independent dataset and compare
its classifications with an external ground-truth label set.
