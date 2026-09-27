# 07 — Synthetic Dry Run Freeze

**Dry-run ID:** `TOP-BOUNDARY-01-DRY-01R1`  
**Status before execution:** `FROZEN_SYNTHETIC_PROTOCOL`  
**Purpose:** verify masks, returns and residual calculations; not physical evidence

## Fixed numerical model

| Parameter | Frozen value |
|---|---|
| grid | `257 x 257` pixel-centered samples over `[-1, 1] x [-1, 1]` |
| orientations | `0, 45, 90, 135, 180, 225, 270, 315 degrees` |
| slit width | `0.10` normalized field units |
| double-slit center separation | `0.34` normalized field units |
| isotropic Gaussian blur | `sigma = 2.0 pixels` |
| spectral displacement | red `+6 px`, green `0 px`, blue `-6 px` on the fixed detector x-axis |
| repeats | `10` synthetic acquisitions per metric |
| source-gain noise | Gaussian, `sigma = 0.001` |
| sensor noise | Gaussian, `sigma = 0.0005` of unit open-field signal |
| dark offset | `0.01` before dark subtraction |
| random seed | `260926` |
| rotation return | bicubic interpolation, fixed canvas, central ROI |

## Three frozen checks

### DRY-C0 — isotropic null control

A binary boundary is blurred by a rotationally symmetric Gaussian transfer
function. After return to the common frame, any nonzero orientation residual is
attributed to sampling, binary-mask rasterization and interpolation.

### DRY-A1 — fixed-axis dispersion control

The same boundary is passed through a linear three-channel model with fixed
detector-axis displacements. A returned rotated mask need not agree with the
`0°` record because the dispersive axis does not rotate with the mask.

This is a qualitative transfer model. It is not a calibrated prism simulation.

### DRY-B1 — coherent aperture control

Fraunhofer intensity is calculated as the squared magnitude of the 2D Fourier
transform of each aperture. Single-slit, complementary bar, two component
slits and their joint double slit are retained separately.

Expected outcome:

- finite single-slit diffraction is present;
- the double slit produces a structured joint-versus-separate interaction;
- intensity complement closure is not assumed in the coherent arm.

## Frozen residuals

```text
rho_theta = ROTATE_BACK(Y_theta, theta) - Y_0

epsilon_Q = Y(Q) + Y(1-Q) - Y(1) - Y(0)

Delta_12 = Y(Q1 UNION Q2) - Y(Q1) - Y(Q2) + Y(0)
```

Both noiseless and ten-repeat noisy summaries are saved. Full arrays remain
available in a compressed numerical archive; PNG output is a derived overview.

## Interpretation ceiling

The dry run may validate software plumbing and expose raster/rotation artifacts.
It cannot validate a prism, camera, laser, material, color observer or physical
claim. Agreement with a known synthetic model is a code check, not experimental
confirmation of nature.

The `R1` suffix records the pre-result null-control repairs listed in
`08_DRY_RUN_DEVIATION_LOG.md`.
