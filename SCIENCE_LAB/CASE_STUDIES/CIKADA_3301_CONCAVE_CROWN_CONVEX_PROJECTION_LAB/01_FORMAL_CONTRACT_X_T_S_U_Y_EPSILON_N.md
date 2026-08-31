# Formal Contract — X, T, S, U, Y, ε, N

Frozen before numerical execution on 2026-08-23.

## X — inputs

All coordinates are dimensionless synthetic world units.

| ID | Input | Exact declaration |
|---|---|---|
| X0 | Circle | 2048 samples, radius `r=1`, centre `(0,0)` |
| X1 | Ellipse calibration | semiaxes `a=1`, `b=0.8` |
| X2 | Concave surface | `z=-0.35(x²+y²)`, circular seam at `r=1` |
| X3 | Planar aperture | `z=0`, circular seam at `r=1` |
| X4 | Convex surface | `z=+0.35(x²+y²)`, circular seam at `r=1` |
| X5 | Corrugated positive control | seam `r(θ)=1+0.08 cos(12θ)` |
| X6 | Needle/anchor | centre to `(0,0.75)`, fixed in object space |
| X7 | Scissor arms | two length-`0.9`, width-`0.08` rectangles sharing the origin; half-angle `α` |

## T — operators, kept separate

- `T_geometry`: circle, ellipse, smooth concave/planar/convex height field, or explicit corrugation.
- `T_pose`: rotation about world x-axis by a declared angle; no shape editing.
- `T_projection`: orthographic projection unless an arm explicitly declares perspective.
- `T_lens`: centred radial map `p' = p(1+k1||p||²+k2||p||⁴)` with `k1=0.20`, `k2=-0.05`.
- `T_raster`: world window `[-1.4,1.4]²` to square pixels, polygon fill, threshold `>=128`.
- `T_colour`: display-only palette; excluded from geometry metrics.
- `T_front_back`: reflection `z -> -z` plus winding reversal; no source-boundary edit.
- `T_scissor`: changes only `α ∈ {20°,45°,70°}`.

No arm may silently combine an undeclared operator.

## S — preserved quantities

- Object-space seam sample order and declared radius, except X5/X7 where geometry is intentionally varied.
- World scale and centre.
- Needle length and object-space attachment.
- Viewport and metric definitions.
- Same floating-point implementation and fixed seed across primary/repeat.

## U — spaces

`U_world` (3D synthetic geometry) → `U_projected` (continuous 2D) → `U_lens` (continuous distorted 2D) → `U_raster` (pixel mask) → `U_display` (colour-labelled comparison).

Values are never compared across spaces without naming the transition. Display colour is not treated as geometry.

## Y — outputs

Circularity, covariance eccentricity, radial-symmetry score, boundary-curvature variation, detrended crown-peak count/prominence, centre/needle/seam relations, RMS difference from planar reference, signed winding/front-back indicator, scissor-tip and pivot stability, null distributions, repeat hashes, and the final bounded decision.

## ε — preregistered tolerances

- Numeric equality/replay: absolute `1e-12` for continuous metrics; exact equality for integer counts.
- Analytic ellipse eccentricity calibration: absolute error `<=0.005` from `0.6`.
- Reference overlap: paired RMS `<=1e-10` means continuously identical.
- Crown peak minimum prominence: `0.020` world units after removal of Fourier modes 0–2.
- Crown residual amplitude: RMS `>=0.030` world units.
- Peak separation: `>=15°`; qualifying peak count `>=3`.
- Persistence: qualifying count differs by at most one between 256 and 512 px-equivalent evaluation and is identical in deterministic repeat.
- Raster-only sufficiency requires the crown criteria at both 256 and 512 px; a single-resolution staircase is insufficient.
- Corrugation spectral specificity: mode-12 power share among modes 3–24 `>=0.80`.

## N — nulls and controls

| ID | Null/control | Purpose |
|---|---|---|
| N0 | Circle + orthographic projection | smooth reference |
| N1 | Tilt only, 30° | pose/ellipse without source structure |
| N2 | Smooth centred lens distortion | smooth optical map |
| N3 | Raster + threshold at 96/256/512 px | pixel/threshold artefacts |
| N4 | 256 seeded random boundaries, RMS amplitude matched to X5, modes 3–24 | specificity and chance peak structure |
| N5 | 12-fold corrugated boundary | positive control |

N4 is not a null for “all structure”; it is a null for the fixed periodic 12-fold grammar. Its amplitude is matched after low-order detrending.

## Decision rule

- `A_PROJECTION_SUFFICIENT`: a smooth-source pose/projection arm meets all crown criteria without lens/raster/source corrugation.
- `B_RASTER_OR_RENDERING_SUFFICIENT`: N3 meets all crown criteria at both 256 and 512 px while its continuous parent does not.
- `C_STRUCTURED_GEOMETRY_REQUIRED`: A–F and H do not meet the persistent crown criteria, while N5/G does; source-boundary structure is therefore required *within this operator family and metric*.
- `D_MIXED_CAUSATION`: no isolated arm suffices, but a preregistered combination does.
- `E_NOT_IDENTIFIABLE`: calibration, repeatability, or discriminating controls fail, or multiple decision rules remain compatible.
