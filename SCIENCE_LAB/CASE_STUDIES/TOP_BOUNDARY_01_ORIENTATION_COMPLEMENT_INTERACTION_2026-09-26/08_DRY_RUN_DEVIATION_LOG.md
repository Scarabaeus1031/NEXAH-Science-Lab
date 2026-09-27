# 08 — Dry Run Deviation Log

## Status

This log records repairs triggered by failed synthetic null controls before any
physical interpretation. Every repair was followed by a complete rerun.

## DRY-R1-01 — zero-angle identity

**Observed:** the `0°` return test failed exact equality.  
**Cause:** the record was unnecessarily converted from float64 to a Pillow
float image and back even though no rotation was requested.  
**Repair:** `rotate_back(record, 0)` now returns an exact copy.  
**Claim effect:** none; prevents numerical conversion from becoming a residual.

## DRY-R1-02 — image-coordinate rotation sign

**Observed:** the isotropic `90°` null control returned normalized RMSE near
`1.399`, while the opposite rotation sign returned approximately `0.030`.  
**Cause:** mathematical mask coordinates use an upward-positive y-axis; image
coordinates use a downward-positive y-axis.  
**Repair:** the fixed Pillow return rotation uses `+theta`. A quarter-turn null
test was added.  
**Claim effect:** all outputs were regenerated; no result from the incorrect
sign is retained as evidence.

## DRY-R1-03 — even-grid Fourier center

**Observed:** after the sign repair, the coherent quarter-turn return remained
dominated by a one-pixel center mismatch.  
**Cause:** a `256 x 256` FFT grid has its geometrical rotation center between
pixels, while the discrete zero-frequency sample and image rotation were not
co-located for the narrow coherent peaks.  
**Repair:** the dry run uses a `257 x 257` pixel-centered grid over `[-1,1]` and
adds a coherent quarter-turn null test.  
**Claim effect:** execution ID advanced to `TOP-BOUNDARY-01-DRY-01R1`; physical
preregistration and boundary questions remain unchanged.

## Governance reading

These are software-geometry repairs required by negative controls. They do not
select angles, masks or outcomes for a preferred scientific conclusion. The
failed checks are retained here because the dry run is intended to expose
exactly this class of representational artifact.

## DRY-02-01 — cardinal supersampling tolerance

**Observed:** the `8x` cardinal return was approximately `2.30e-8` NRMSE and
the maximum over all scales was approximately `2.95e-8`, while the initial unit
test required `< 1e-10`.  
**Cause:** floating trigonometric evaluation and subpixel averaging produce
minute numerical differences even for nominal quarter turns.  
**Repair:** the cardinal-control tolerance is recorded as `1e-6`; the observed
error remains more than an order of magnitude below it.  
**Claim effect:** no metric, scale or 5% convergence rule changed. The full
convergence execution was rerun after the tolerance was declared.
