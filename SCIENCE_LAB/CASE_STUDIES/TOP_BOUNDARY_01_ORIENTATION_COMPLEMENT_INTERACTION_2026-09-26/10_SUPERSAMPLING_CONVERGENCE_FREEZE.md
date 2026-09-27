# 10 — Aperture Supersampling Convergence Freeze

**Execution ID:** `TOP-BOUNDARY-01-DRY-02`  
**Status before execution:** `FROZEN_SYNTHETIC_CONVERGENCE_PROTOCOL`  
**Physical evidence:** `NONE`

## Question

Do the large diagonal coherent orientation residuals from Dry Run 01 converge
when the binary aperture boundary is represented by subpixel area occupancy
rather than one-pixel staircase decisions?

## Frozen design

| Parameter | Value |
|---|---|
| detector/aperture grid | `257 x 257` |
| occupancy supersampling | `1x, 2x, 4x, 8x` per axis |
| orientations | `0, 45, 90, 135, 180, 225, 270, 315 degrees` |
| aperture families | finite single slit; equal-width double slit |
| slit width | `0.10` normalized units |
| double-slit center separation | `0.34` normalized units |
| propagation | squared magnitude of the 2D FFT of fractional aperture amplitude |
| return | same bicubic common-frame return used in Dry Run 01R1 |
| metric | ideal orientation-return NRMSE in the frozen central ROI |

For scale `s`, every coarse aperture pixel is divided into `s x s` subpixels.
The binary aperture is evaluated at subpixel centers and averaged back to one
fractional amplitude-transmission value per coarse pixel before propagation.

## Important model boundary

This is aperture-occupancy antialiasing. It is not a full high-resolution wave
propagation followed by physical detector-area integration. It tests whether
the previously observed diagonal residual is stable against a more faithful
boundary representation.

## Frozen decisions

- no scale may be removed after inspection;
- cardinal and diagonal orientations remain in the same table;
- convergence is reported as the full sequence, not only `8x`;
- monotonic improvement is not assumed;
- a nonzero limit is not new physics; return interpolation and finite-window
  effects remain in the synthetic system;
- no equipment recommendation follows unless diagonal metrics stabilize enough
  to separate model response from digitization response.

## Outcome vocabulary

| Outcome | Rule |
|---|---|
| `CONVERGED_FOR_DRY_RUN` | `4x -> 8x` change is below 5% of the `8x` value for every nonzero diagonal metric |
| `IMPROVING_NOT_CONVERGED` | diagonal metrics decrease overall but the 5% rule fails |
| `GRID_SENSITIVE` | sequence is unstable or does not decrease overall |
| `INVALID` | any scale, complement, cardinal return or output-integrity control fails |

The outcome applies only to the synthetic aperture representation.
