# 09 — Synthetic Dry Run Report

**Execution ID:** `TOP-BOUNDARY-01-DRY-01R1`  
**Date:** `2026-09-26`  
**Result:** `PASS_SYNTHETIC_WITH_TYPED_ARTIFACTS`  
**Physical experiment:** `NOT_EXECUTED`  
**Scientific result:** `NONE`

## Outcome first

The dry run validates the residual bookkeeping and rejects a naive reading of
orientation differences as optical effects.

Three software-geometry artifacts were found and repaired through null
controls: zero-angle conversion, image-coordinate rotation sign and even-grid
FFT centering. After the repairs, all six automated controls pass.

The final synthetic records show:

1. a residual floor from rasterization and interpolation even in the isotropic
   null model;
2. an additional structured orientation residual when the dispersion axis is
   fixed while the mask rotates;
3. exact noiseless complement closure for the linear synthetic models;
4. nonzero coherent complement and double-slit interaction residuals, as
   expected from intensity interference rather than simple addition;
5. severe diagonal-slit raster sensitivity and inadequate synthetic SNR in the
   noisy coherent arm.

## Automated controls

```text
tests run  = 6
tests pass = 6
tests fail = 0
```

The tests cover exact binary complements, noiseless linear closure, coherent
double-slit interaction, exact zero-angle identity, isotropic quarter-turn
return and coherent quarter-turn return.

## Orientation return

Ideal normalized RMSE after return to the `0°` frame:

| Angle | Isotropic edge | Fixed-axis dispersion edge | Coherent single slit | Coherent double slit |
|---:|---:|---:|---:|---:|
| 0 | 0.000 | 0.000 | 0.000 | 0.000 |
| 45 | 0.025 | 0.064 | 0.938 | 0.482 |
| 90 | 0.030 | 0.179 | 0.000 | 0.000 |
| 135 | 0.025 | 0.260 | 0.938 | 0.482 |
| 180 | 0.030 | 0.288 | 0.000 | 0.000 |
| 225 | 0.026 | 0.261 | 0.938 | 0.482 |
| 270 | 0.030 | 0.181 | 0.000 | 0.000 |
| 315 | 0.026 | 0.065 | 0.938 | 0.482 |

Interpretation:

- `0.025–0.030` in the isotropic model is the synthetic return floor, not an
  optical orientation effect;
- the fixed dispersion axis produces a clear orientation-dependent excess over
  that floor;
- the large coherent diagonal values are dominated by the staircase boundary
  of a one-pixel binary aperture. Cardinal directions happen to align with the
  grid and therefore return exactly in the ideal model.

The last point directly answers why diagonal cuts matter in a digital record:
they test the representation and sampling grid as much as the nominal optical
geometry.

## Complement closure

| Family | Ideal NRMSE | Mean noisy NRMSE |
|---|---:|---:|
| isotropic edge | `3.89e-16` | `0.00194` |
| fixed-dispersion edge | `4.12e-16` | `0.00188` |
| fixed-dispersion slit | `3.84e-16` | `0.00165` |
| coherent single slit | `0.0977` | `0.245` |

The linear models close to floating-point precision before noise. The coherent
intensity records do not close under simple mask-plus-complement addition; this
is expected and is not an anomaly.

## Two-boundary interaction

For the coherent double slit:

```text
ideal normalized RMSE(Delta_12) = 0.577350
ideal normalized L1(Delta_12)   = 0.653855
maximum absolute interaction    = 0.005117
```

The interaction is structured and nonzero, matching the existence of the
coherent cross term. It is not extra energy or a new object.

The ten-repeat noisy interaction NRMSE is approximately `9.92`. The frozen
noise scale overwhelms the low-transmission coherent signal. This is retained
as a typed design finding: a real apparatus must bind exposure, transmitted
power, detector noise and dynamic range before the interaction metric is
interpretable.

## What survives

- the three residual formulas are computationally operational;
- mask/complement provenance can be enforced exactly;
- the full orientation series distinguishes fixed-axis response from isotropic
  return only after a raster/interpolation null control;
- diagonal cuts are valuable controls because they expose sampling anisotropy;
- two boundaries cannot generally be interpreted by adding two intensity
  pictures in the coherent arm.

## What does not survive

- any claim that orientation difference alone reveals new physics;
- any reading of the coherent diagonal residual without supersampling or an
  analytic aperture representation;
- any noisy coherent comparison under the frozen synthetic exposure/noise
  scale;
- any claim about a real prism, laser, water, film, eye or camera.

## Next admissible step

Before even a low-tech camera pilot, run one numerical refinement:

1. supersample every aperture by at least `8x` and integrate down to detector
   pixels;
2. bind a coherent exposure scale that keeps the double-slit signal above the
   simulated detector floor without clipping;
3. repeat the eight-angle matrix and verify that diagonal residuals converge;
4. retain the present `257 x 257` result as the coarse-grid comparator.

Only after this convergence test should the package recommend physical masks
or equipment.

## Artifacts

- `dry_run/results.json` — complete parameters, checks and metrics;
- `dry_run/metrics.csv` — tabular metrics;
- `dry_run/arrays.npz` — full numerical arrays;
- `dry_run/synthetic_boundary_matrix_overview.png` — derived visual summary;
- `08_DRY_RUN_DEVIATION_LOG.md` — all repairs and their causes.

## Claim ceiling

```text
DRY_RUN_RESULT        = PASS_SYNTHETIC_WITH_TYPED_ARTIFACTS
PHYSICAL_RESULT       = NONE
NEW_OPTICAL_EFFECT    = NO
TOP_THEORY_CHANGE     = NONE
NEXT_ACTION           = NUMERICAL_SUPERSAMPLING_CONVERGENCE_TEST
```
