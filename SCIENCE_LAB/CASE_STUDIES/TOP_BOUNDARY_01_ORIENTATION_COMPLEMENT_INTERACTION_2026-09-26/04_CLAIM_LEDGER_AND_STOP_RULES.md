# 04 — Claim Ledger and Stop Rules

## Admissible claims after a valid execution

The strongest admissible claim has this form:

> Under the bound source, mask, medium, geometry, detector and processing
> conditions, changing the declared boundary variable produced the reported
> orientation, complement or interaction residual with the stated uncertainty.

The experiment may characterize:

- orientation dependence of the complete apparatus;
- complement closure or failure under a declared linear comparator;
- coherent double-slit interaction against established diffraction theory;
- locations at which detector, medium or geometry require further isolation;
- whether TOP bookkeeping preserves source, transformation, residual and claim
  limits during this case.

## Prohibited claims

This execution may not establish that:

- a boundary creates wavelengths or energy;
- red light physically becomes green in water;
- a colored shadow has an intrinsic color independent of illumination;
- prism edge spectra and double-slit interference are one mechanism;
- a diagonal or named angle is privileged in nature;
- a structured residual is new physics;
- a camera RGB channel is a monochromatic spectral measurement;
- Human perception is measured by the instrumental arm;
- TOP is a new natural theory or replaces Fourier optics, color science,
  imaging metrology or domain review.

## I-L-A-U preregistration

| Class | Frozen content |
|---|---|
| I — retained | source identity; mask geometry; orientation; calibrated linear records; acquisition order; residual maps; uncertainty and provenance |
| L — lost | unmeasured phase in intensity-only records; complete continuous field; uncontrolled environment outside the apparatus; subjective appearance in the primary arm |
| A — introduced | mask fabrication; coordinate frame; rotation interpolation; normalization; regions of interest; residual definitions; rendered communication images |
| U — unresolved | final equipment; calibration floor; spatial coherence of Arm A; achievable mask accuracy; whether any repeatable residual survives localization controls |

## Stop rules

Stop the run or mark it invalid when any of the following occurs:

1. required equipment-binding field is absent;
2. source drift exceeds the preregistered tolerance;
3. a mask and complement do not derive from the same binary master;
4. orientation cannot be independently verified;
5. automatic exposure, white balance, gamma, HDR, denoising or sharpening alters
   a primary record;
6. RAW values clip or crush beyond the frozen validity limit;
7. dark and flat calibration cannot be traced to the capture block;
8. acquisition order or failed captures are missing from the manifest;
9. Arm A and Arm B data are pooled before their separate baseline tests;
10. a display PNG is substituted for an immutable primary record;
11. the analysis code or thresholds change after results are inspected without a
    versioned deviation record;
12. Human perception claims are added without a separate protocol.

## Residual localization ladder

Before interpreting a repeatable residual, test in this order:

1. file integrity and manifest completeness;
2. dark/flat and detector linearity;
3. source stability;
4. pixel registration and interpolation;
5. mask geometry and complement accuracy;
6. optical alignment, lens and prism orientation;
7. polarization and coherence;
8. established domain model;
9. independent apparatus replication;
10. only then consider a narrower new hypothesis.

Failure at a lower rung blocks interpretation at every higher rung.

## Current result

```text
SCIENTIFIC_RESULT = NONE
EXECUTION_STATUS  = NOT_EXECUTED
EQUIPMENT_STATUS  = NOT_BOUND
CLAIM_STATUS      = PREREGISTRATION_ONLY
```
