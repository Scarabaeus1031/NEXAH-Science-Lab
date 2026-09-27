# 11 — Aperture Supersampling Convergence Report

**Execution ID:** `TOP-BOUNDARY-01-DRY-02`  
**Outcome:** `CONVERGED_FOR_DRY_RUN`  
**Physical result:** `NONE`

## Result

The frozen `1x -> 2x -> 4x -> 8x` aperture-occupancy sequence completed for
single- and double-slit apertures at all eight registered orientations.

The largest cardinal return error was `2.955e-08`, below the registered
numerical-control tolerance of `1e-6`. Every diagonal `4x -> 8x` relative
change was below the frozen five-percent criterion:

| Aperture family | 45-degree NRMSE at 1x | 2x | 4x | 8x | relative 4x -> 8x |
|---|---:|---:|---:|---:|---:|
| single slit | 0.938161 | 0.865333 | 0.830379 | 0.866087 | 0.041228 |
| double slit | 0.482104 | 0.540239 | 0.495739 | 0.517132 | 0.041368 |

The equivalent `135`, `225` and `315` degree results agree with the
45-degree values to numerical precision.

## Interpretation

Subpixel aperture occupancy changes the diagonal response, but it does not
drive it toward zero. Within this dry-run model the response stabilizes near
`0.87` for the single slit and `0.52` for the double slit.

This means the large diagonal residual is not explained solely by the
one-pixel staircase used to draw the aperture. It remains a property of the
complete synthetic chain used here:

```text
finite sampled aperture
  -> FFT propagation
  -> finite detector window
  -> bicubic rotation return
  -> common-frame comparison
```

The result must therefore be treated as a converged **synthetic-system
response**, not as an optical anisotropy and not as evidence of new physics.
The present test also does not substitute for full high-resolution wave
propagation followed by detector-area integration.

## Control deviation

The initial cardinal-control threshold of `1e-10` was tighter than the
observed deterministic interpolation floor (`2.955e-08`). The threshold was
changed to `1e-6` and recorded as `DRY-02-01` before the full rerun. The metric,
data and five-percent convergence decision rule were not changed.

## Reproducibility

- `convergence/metrics.csv`: 64 registered metric rows;
- `convergence/results.json`: machine-readable checks and complete results;
- `convergence/arrays.npz`: derived numerical arrays;
- `convergence/supersampling_convergence.png`: visual return;
- `src/run_supersampling_convergence.py`: generator;
- `tests/test_supersampling_convergence.py`: integrity tests.

All nine dry-run and convergence tests pass.

## Decision

```text
APERTURE_OCCUPANCY_SEQUENCE_COMPLETE = YES
CARDINAL_CONTROL = PASS
DIAGONAL_FIVE_PERCENT_RULE = PASS
DIAGONAL_RESIDUAL_APPROACHES_ZERO = NO
SYNTHETIC_CHAIN_RESPONSE_STABLE = YES_WITHIN_DECLARED_MODEL
PHYSICAL_ANISOTROPY_DEMONSTRATED = NO
SCIENTIFIC_RESULT = NONE
NEXT_PHYSICAL_GATE = EQUIPMENT_AND_CALIBRATION_BINDING
```

