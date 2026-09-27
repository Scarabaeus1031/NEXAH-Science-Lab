# TOP-BOUNDARY-01 — Orientation, Complement and Interaction

**Date:** `2026-09-26`  
**Status:** `SYNTHETIC_INTERACTION_OPERATOR_VALIDATED / PHYSICAL_EQUIPMENT_NOT_BOUND / PARKED`  
**Domain:** experimental optics and imaging metrology  
**Method role:** bounded TOP application; no new theory, operator or physics claim

## Question

When source, medium, detector and processing are held fixed, what changes when
only the geometry of the optical boundary is changed?

The case tests three quantities:

1. orientation residual after a rotated observation is returned to a common
   frame;
2. complement-closure residual for a mask and its exact complement;
3. interaction residual for two boundaries measured separately and together.

## Two arms — one matrix, different physics

| Arm | Source and object | Primary effect | Claim boundary |
|---|---|---|---|
| A — boundary/dispersion | spatially incoherent broadband source; black-white edge, prism and complementary masks | edge-spread, wavelength-dependent displacement and detector response | not double-slit interference |
| B — diffraction/interference | monochromatic coherent source; calibrated slit and double-slit masks | diffraction envelope and phase-dependent interference | not a Goethe/prism color mechanism |

The arms share a bookkeeping form. They do not share a mechanism merely
because both contain cuts or apertures.

## Core model

```text
SOURCE -> BOUNDARY / APERTURE -> MEDIUM -> DETECTOR -> LINEAR RECORD
       -> ROTATION RETURN -> COMPLEMENT TEST -> INTERACTION TEST
       -> I-L-A-U -> TYPED RESIDUAL -> BOUNDED RETURN
```

Boundary state:

```text
B = (theta, polarity, width, separation, count, curvature)
```

Primary orientation set:

```text
theta = {0, 45, 90, 135, 180, 225, 270, 315} degrees
```

The eight-angle set deliberately includes `135°` and `270°`. Angles separated
by `180°` are retained as polarity and rotation controls rather than treated as
automatically redundant.

## Reading order

1. [Preregistration freeze](01_PREREGISTRATION_FREEZE.md)
2. [Boundary matrix](02_BOUNDARY_MATRIX.csv)
3. [Measurement and analysis protocol](03_MEASUREMENT_AND_ANALYSIS_PROTOCOL.md)
4. [Claim ledger and stop rules](04_CLAIM_LEDGER_AND_STOP_RULES.md)
5. [TOP return card template](05_TOP_RETURN_CARD_TEMPLATE.md)
6. [Machine-readable contract](boundary_contract.json)
7. [Synthetic dry-run freeze](07_SYNTHETIC_DRY_RUN_FREEZE.md)
8. [Dry-run deviation log](08_DRY_RUN_DEVIATION_LOG.md)
9. [Synthetic dry-run report](09_SYNTHETIC_DRY_RUN_REPORT.md)
10. [Supersampling convergence freeze](10_SUPERSAMPLING_CONVERGENCE_FREEZE.md)
11. [Supersampling convergence report](11_SUPERSAMPLING_CONVERGENCE_REPORT.md)
12. [Interaction residual / relation crosswalk](12_INTERACTION_RESIDUAL_RELATION_CROSSWALK.md)
13. [Primary interaction analysis freeze](13_PRIMARY_INTERACTION_ANALYSIS_FREEZE.md)
14. [Primary interaction analysis report](14_PRIMARY_INTERACTION_ANALYSIS_REPORT.md)
15. [Physical execution packet](15_PHYSICAL_EXECUTION_PACKET.md)
16. [Derived dry-run overview](dry_run/synthetic_boundary_matrix_overview.png)
17. [Supersampling convergence visual](convergence/supersampling_convergence.png)
18. [Primary interaction visual](interaction_primary/primary_interaction_residual.png)
19. [Preceding TOP visual marker series](../TOP_VISUAL_MARKER_SERIES_2026-09-26/00_README.md)
20. [Scientific contribution assessment](16_SCIENTIFIC_CONTRIBUTION_ASSESSMENT.md)

## Current disposition

No optical equipment, masks, dimensions, source spectra, calibration files or
measurements are bound. No physical result exists. Execution must stop until the
equipment-binding gate in the preregistration is complete.

The synthetic dry run is complete. It validates the computational bookkeeping
only and does not change the physical-experiment status above.

The aperture-occupancy supersampling sequence is also complete. It meets the
registered dry-run convergence rule, while the large diagonal return residual
remains nonzero. This is a stable response of the declared synthetic chain,
not a physical result.

The complete four-state interaction analysis is now also complete. Both linear
null arms close to floating-point precision, and the coherent arm reproduces
the analytical interference cross term at all eight orientations. The native
interaction ratio is stable while diagonal common-frame return remains
sampling-sensitive. The case is digitally complete and awaits real equipment
binding.

## Claim ceiling

This package may establish a reproducible local response to declared optical
boundaries after execution. It cannot establish that boundaries create
wavelengths, that prism edge colors and double-slit interference are the same
mechanism, that a residual is new physics, or that TOP is a predictive theory
of nature.
