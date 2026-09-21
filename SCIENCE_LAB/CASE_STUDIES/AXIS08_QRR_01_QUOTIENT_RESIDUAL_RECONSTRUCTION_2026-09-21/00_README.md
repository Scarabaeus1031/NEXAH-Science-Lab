# AXIS08-QRR-01 — Quotient–Residual Reconstruction

Status: `PHASE_A_EXACT_RESIDUAL_SUFFICIENCY_CONFIRMED`

Question: Can a declared AXIS08 quotient identify its lost kernel direction,
and can an explicit residual restore reconstruction without being confused
with compression, physical identity or predictive utility?

This package extends the Translation Fidelity line. It does not extend the E8
intake claim and does not activate an IEEE/power-system claim.

## Phases

1. **Phase A — authorized:** exact algebra, deterministic synthetic controls,
   E8 calibration and frozen generic baselines.
2. **Phase B — gated:** inspect IEEE-9/14 source semantics for a domain-justified
   eight-component state and paired coordinates. No suitable pair means STOP.
3. **Phase C — not authorized:** unchanged external/domain transfer only after
   Phase B passes without inventing features or retuning.

Phase B has now passed its semantic gate for one bounded candidate: the
same-unit minimum/maximum bus-voltage envelope. Its execution is preregistered
in `05_PHASE_B_IEEE_PREREGISTRATION.md`; no IEEE result is claimed yet.

## Required reading

- `01_PREREGISTERED_PROTOCOL.md`
- `02_FORMAL_MODEL.md`
- `03_IEEE_TRANSFER_GATE.md`
- `protocol.json`

Run Phase A with the bundled scientific Python runtime:

```text
python3 run_phase_a.py
```

## Phase A result

- primary cells: `10/10 PASS`
- E8 calibrations: `2/2 PASS`
- metric rows: `60`
- exact quotient-plus-residual reconstruction maximum error:
  `8.881784197001252e-16`
- quotient-only kernel counterfactual maximum distance:
  `8.881784197001252e-16` (numerical zero; blind as predicted)
- quotient-plus-residual kernel-event detection: `1.0`
- IEEE/PEGASE executed: `NO`

See `04_PHASE_A_RESULTS.md` and `phase_a_results.json`.
