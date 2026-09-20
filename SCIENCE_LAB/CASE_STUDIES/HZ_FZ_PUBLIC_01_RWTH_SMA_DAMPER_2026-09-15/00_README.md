# HZ_FZ_PUBLIC_01 — RWTH SMA Damper

This case imports a small, openly licensed laboratory dataset for a controlled
external-data test of the NEXAH two-cut architecture.

Current state:

```text
SOURCE DOWNLOAD       = COMPLETE
ZENODO MD5            = VERIFIED
LOCAL SHA-256         = RECORDED
CSV STRUCTURE         = VERIFIED
TWO BEFORE/AFTER PAIRS = SELECTED
HZ_FZ_01 ADMISSION    = NOT CLAIMED
KERNEL 0.7 ATTACHMENT = COMPLETE, EXTERNAL E2 ONLY
CUT ROBUSTNESS        = CYCLE + PARAMETER BATTERY
HINGE STABILITY       = 36 ACTUATOR-CYCLE RECORDS
FREQUENCY GRID        = 8-WIRE 2 AMPLITUDES × 3 FREQUENCIES
COMPASS BINDER        = V0.1 DEFINED, DESCRIPTIVE E2 ONLY
MISSION CONTROL       = INTERACTIVE LOCAL VIEW COMPLETE
NEXT                  = PREREGISTER ONE REAL-MEASUREMENT TEST
```

Run the deterministic source check with:

```text
/opt/anaconda3/bin/python inspect_public_source.py \
  --output SOURCE_INTAKE_RESULT.json
```

The check validates source hashes, exact columns, finite observations,
strictly ordered time, rounded 512-Hz sampling and the two declared
before/after pairs. It also computes descriptive displacement-to-force
fundamental gain and phase values without making a causal claim.

Run and seal the Kernel 0.7 attachment, robustness result and PNG with:

```text
node attach_public_kernel_v07.js
```

The generated attachment cannot activate `hz-fz-transfer`. See
`02_PUBLIC_SOURCE_KERNEL_ATTACHMENT_CONTRACT.md` for the fixed mapping and
claim boundary.

## Cycle-level uncertainty extension

- `FACTORIAL_CYCLE_METRICS.csv` preserves all 56 active-cycle measurements.
- `FACTORIAL_UNCERTAINTY_RESULT.json` records median/IQR summaries, deterministic moving-block bootstrap contrasts, and the claim boundary.
- `NEXAH_FACTORIAL_UNCERTAINTY_WELL_TEST.png` shows the individual cycles behind the three frequency medians.
- `06_FACTORIAL_UNCERTAINTY_REPORT.md` concludes that the apparent 0.5 Hz minimum is inconclusive as a stable well, while the cycle trajectories support a history-dependent crossover.

## Contrast-compass extension

- `NEXAH_CONTRAST_COMPASS.png` shows that the compass is a rotated/differenced view of the same 40 mm cycle curves.
- `CONTRAST_COMPASS_RESULT.json` records the 2.918 point ratio, the `gamma^-2 = 3` reference, the cycle-path crossings, and the joint bootstrap orientation audit.
- `07_CONTRAST_COMPASS_REPORT.md` distinguishes close point-estimate alignment from unstable bootstrap orientation.

## Compass-Binder and cycle-path audit

- `09_COMPASS_BINDER_CONTRACT.md` defines the two contrast cuts, preserves both
  active-order and nominal-cycle pairing, and forbids profile activation.
- `COMPASS_BINDER_V0_1.json` is the machine-readable binder record.
- `CYCLE_PATH_SEQUENCE_RESULT.json` screens the named numeric references
  together, audits the bootstrap lattice and compares both alignment rules.
- `NEXAH_CYCLE_PATH_SEQUENCE_AUDIT.png` is the static four-view audit.
- `08_CYCLE_PATH_SEQUENCE_REPORT.md` records the result: the active-order
  interpolation has three crossings and a 2.0017 crossing-gap ratio, while the
  nominal-cycle alignment has two crossings. This is descriptive structure,
  not identification of a constant or mechanism.
- `../../EXPORTS/NEXAH_HZ_FZ_COMPASS_MISSION_CONTROL.html` couples source,
  Cartesian and polar views with node, alignment and reference controls.
