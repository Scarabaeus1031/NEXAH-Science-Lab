# HZ_FZ_PUBLIC_01: contrast compass

## Coordinate transform

The compass is another view of the same 40 mm loop-area curves. Each axis is a contrast rather than an absolute loop area:

- x = median(0.5 Hz) − median(0.1 Hz)
- y = median(0.5 Hz) − median(1.0 Hz)

The observed vector is (-14.244, -41.568) J. Its absolute slope is 2.918310. The numerical compass label γ = 1/√3 gives γ⁻² = 3, so the point estimate is -2.723% from that reference and -0.480° from its negative ray.

## Cycle-path relation

The three pairwise active-order crossings occur at 2.609, 4.257, and 7.556. Their step lengths are 1.648 and 3.299; the second is 2.0017 times the first.

## Uncertainty result

The point estimate aligns closely with the γ⁻² ray, but the joint moving-block bootstrap cloud is broad:

- quadrant III fraction: 63.05%
- within ±5° of the reference ray: 8.88%
- within ±10°: 17.50%
- angular residual quantiles (2.5%, 25%, 50%, 75%, 97.5%): -61.17°, -27.20°, +1.91°, +29.75°, +129.22°

Classification: `POINT_ESTIMATE_ALIGNS_WITH_GAMMA_REFERENCE_BUT_BOOTSTRAP_ORIENTATION_IS_NOT_STABLE`.

## Claim boundary

This is a rotation and differencing of the existing three run summaries. It reveals orientation, crossings, and uncertainty more clearly, but it does not add an independent experiment or establish a physical γ law.
