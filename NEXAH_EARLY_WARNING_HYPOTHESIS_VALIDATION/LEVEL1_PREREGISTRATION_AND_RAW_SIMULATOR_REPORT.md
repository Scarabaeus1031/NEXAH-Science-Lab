# Level-1 Preregistration and Raw Simulator Report

Date: 2026-08-13 (Europe/Berlin)  
Disposition: `NOT_ADOPTED`

## Outcome of this pass

- **PROTOCOL FROZEN:** machine-readable protocol V1.0.0, SHA-256
  `d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`.
- **SIMULATOR IMPLEMENTED:** deterministic equilibrium, fixed-step RK4, and
  explicit-seed mechanical-power diffusion with immutable canonical outputs.
- **NUMERICAL SOFTWARE CHECKS:** A–K completed on a development path only.
- **SCIENTIFIC HYPOTHESIS NOT YET TESTED:** no indicator, comparator, endpoint,
  warning, alarm, event, lead, rate, or scientific outcome was computed.

## Required answers

1. **Internal consistency:** Yes; no contradiction prevented deterministic implementation.
2. **Frozen version:** `NEXAH-EARLY-WARNING-LEVEL1-SYNTHETIC` V1.0.0.
3. **Protocol SHA-256:** `d742ddfe23cea1ddd94817f51b0abc6b95c33599a78e965e7d375ec33f4fd9f3`.
4. **Scientific parameters changed:** No.
5. **Owner-review stop due to changes:** Not applicable; no scientific choice was changed. Explicit numerical/RNG operational details are recorded in the freeze record.
6. **Equation-based equilibrium:** Yes; deterministic Newton solve of the declared balance equations plus zero-sum gauge, with no guessed fallback.
7. **Residual:** maximum absolute physical residual `5.551115123125783e-17`; gauge residual `-2.7755575615628914e-17`.
8. **Deterministic byte replay:** Yes.
9. **Stochastic same-seed byte replay:** Yes.
10. **Different seeds distinct:** Yes; seeds 1000 and 1001 produce different raw trajectory hashes.
11. **`dt=0.005` support for `dt=0.01`:** Quantitatively consistent (delta `9.135581180430563e-11`, omega `2.0204145593973738e-10` maximum discrepancy); no formal acceptance judgment was invented because the reviewed protocol supplied no raw-state tolerance.
12. **Raw states changed after integration:** No.
13. **Warning/alarm/event times imposed:** No.
14. **R(t) used to tune simulator:** No; it was not computed.
15. **V(t) used to tune simulator:** No; it was not computed.
16. **Evaluation performance inspected:** No; no evaluation trajectory was generated.
17. **Early-warning hypothesis tested:** No.
18. **Application 001 changed:** No.
19. **Canonical components changed:** No NEXAH, ORION, NEXAHEDRON, or Experience component was changed.
20. **Exact next task:** After separate authorization, independently review this exact freeze and implement hash-frozen, raw-record-consuming event/candidate/comparator evaluators for development-only calibration; evaluation remains unopened.

## Repository discipline

Only files under `NEXAH_EARLY_WARNING_HYPOTHESIS_VALIDATION/` were added. No
Git staging, commit, push, merge, deployment, canonical modification, or
historical-file modification occurred.
