# Metrics Definition

Frozen before numerical execution on 2026-08-23.

## Closed-boundary metrics

- **Area and perimeter:** polygon shoelace area and cyclic segment sum.
- **Circularity:** `4π area / perimeter²`; 1 is the ideal sampled circle limit.
- **Eccentricity:** `sqrt(1-λmin/λmax)` from the covariance eigenvalues of centred boundary points.
- **Radial symmetry:** `max(0, 1 - std(r)/mean(r))` about the sampled centroid. It is descriptive, not an invariant across pose.
- **Curvature variation:** coefficient of variation of discrete turning angle per local arc length.
- **Reference difference:** paired RMS Euclidean distance from arm A after identical sampling; no registration other than common centre/sample phase.

## Operational crown

1. Convert boundary points to `r(θ)` about their centroid.
2. Resample on 2048 uniform angular bins.
3. Least-squares remove Fourier modes 0, 1, and 2. This removes size, decentring, and the dominant ellipse/tilt term.
4. Smooth only with a circular five-sample moving average.
5. A local maximum is a candidate if it exceeds the higher neighbouring minima within ±7.5° by at least `0.020` world units.
6. Enforce a 15° minimum separation by retaining the more prominent candidate.
7. `crown_present = true` only when peak count is at least 3, detrended RMS is at least `0.030`, persistence passes, and deterministic repeat is exact.

For raster masks, the radial boundary is the outermost in-mask sample along each of 2048 rays, converted back to world units before the same algorithm. Raster sufficiency additionally requires passage at both 256 and 512 px.

## Spectral specificity

The power of complex Fourier modes 3–24 is measured on the detrended radial profile. `mode12_share` is mode-12 power divided by total power in those modes. N4 reports an empirical exceedance rate over 256 fixed-seed random boundaries for both the observed mode-12 share and qualifying peak count.

## Anchor, seam, and reversal

- Needle length: Euclidean centre-to-tip distance in the named space.
- Needle-to-seam gap: nearest boundary distance from the tip.
- Seam location: centroid and mean radius.
- Front/back: signed polygon area and surface-normal sign are recorded separately. A winding reversal is a representational orientation flip; it is not automatically an inside/outside physical reversal.
- Scissor control: pivot drift, outer-tip count, and projected tip positions across the three declared opening angles.

## Calibration and failure

The ellipse calibration must return eccentricity `0.6 ± 0.005`. Failure of calibration, deterministic replay, or required controls forces `E_NOT_IDENTIFIABLE` regardless of appearance.
