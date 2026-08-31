# Crown-Origin Decision

## Decision

`C_STRUCTURED_GEOMETRY_REQUIRED`

This decision applies only to the preregistered synthetic operator family and the operational boundary-crown metric. It does not identify the origin of a historical visual and does not claim that all optical or rendering systems require corrugated source geometry.

## Evidence against the alternatives

| Arm/control | Material result | Crown criterion |
|---|---|---|
| A planar circle / N0 | residual RMS `2.87e-16`; 0 peaks | fail |
| B pose-only / N1 | eccentricity `0.5`; residual RMS `0.00255`; 0 peaks | fail |
| C concave seam | continuous boundary identical to A (`RMS=0`) | fail |
| D convex seam | continuous boundary identical to A (`RMS=0`) | fail |
| E smooth centred lens / N2 | radius changes to `1.15`; residual RMS `1.80e-15`; 0 peaks | fail |
| F raster / N3 | 96 px produced 16 small candidates but residual RMS `0.00839`; 256/512 px produced 0 qualifying peaks | fail and not persistent |
| G corrugated / N5 | 12 peaks; residual RMS `0.05649`; mode-12 share `1.0`; 12 peaks at both 256 and 512 px | pass |
| H front/back | contour overlaps; winding CCW→CW; 0 peaks | fail |
| I scissor arms | four tips move with declared angle; pivot drift `0` | geometry-tracking control; crown metric not applicable |

Ellipse calibration returned `0.5999999999999998` against the analytic target `0.6`. The complete numeric and PNG pipelines replayed with exact SHA-256 equality.

The N4 amplitude-matched random-boundary family produced many irregular local peaks (range 6–18, median 13), showing that peak count alone is not a unique grammar. None of 256 samples jointly matched the corrugated control's peak-count threshold and mode-12 concentration; the smoothed empirical upper rate is `1/257 ≈ 0.00389`. This distinguishes the periodic positive control from the declared random family, not from all conceivable structures.

## Why A, B, D, and E were not selected

- `A_PROJECTION_SUFFICIENT`: no smooth-source pose/projection arm passed.
- `B_RASTER_OR_RENDERING_SUFFICIENT`: the low-resolution staircase did not meet amplitude or cross-resolution persistence.
- `D_MIXED_CAUSATION`: no preregistered combination was needed; the structured source control passed directly.
- `E_NOT_IDENTIFIABLE`: calibration, discrimination, and deterministic replay all passed.

## Scientific boundary

The test excludes lighting caustics, learned renderers, off-axis/asymmetric lens models, compression, and historical source reconstruction. Concave and convex surfaces were deliberately compared through the same front orthographic seam; their depth sign is not recoverable from that silhouette. Therefore the result is a bounded method result: smooth transforms tested here did not manufacture a persistent boundary crown; explicit boundary variation did.
