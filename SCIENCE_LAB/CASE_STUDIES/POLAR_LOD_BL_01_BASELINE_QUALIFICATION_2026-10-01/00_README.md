# POLAR-LOD-BL-01 — baseline qualification

Date: 2026-10-01
Status: `BASELINE_READY / NO_PROSPECTIVE_RESULT`

This package qualifies the statistical and geophysical comparators required
before any prospective `POLAR-LOD-01` execution. It is a historical method
development audit, not a preregistered scientific result and not execution
authority for the future holdout.

## Decision

Both required comparator classes are now specified and executable:

- `B1-AR17`: ridge autoregression with 17 fixed past-only lags, trend,
  annual and semiannual harmonics;
- `B2-IERS-ZONT2`: the same model applied after subtracting the official
  IERS Conventions (2010) 62-term long-period zonal-tide LOD correction,
  with the known correction added back at the forecast date.

The IERS-derived Python implementation reproduces the official MJD 54465
test case to floating-point precision. Historical development on 2018–2024
selects the 17-lag architecture without using 2025. A forensic application to
the already-known 2025 Test-08 holdout shows that the six-period candidate
beats the stronger statistical baseline but does not beat the geophysical
baseline. That observation is diagnostic only and is not prospective
confirmation.

## Contents

- `01_QUALIFICATION_CONTRACT.md` — scope, gates and fixed architecture;
- `02_SOURCE_AND_METHOD_BINDING.md` — C04/IERS applicability and provenance;
- `03_QUALIFICATION_RESULT.md` — decision and bounded interpretation;
- `baseline_qualification.py` — deterministic qualification runner;
- `qualification_results.json` — machine-readable result;
- `rolling_baseline_metrics.csv` — historical development metrics;
- `IERS_SOFTWARE_LICENSE.txt` — upstream software notice;
- `SHA256_MANIFEST.txt` — package integrity manifest.

## Boundary

`BASELINE_READY` closes only readiness gate R4. It does not close prospective
data gate R3, does not authorize `POLAR-LOD-01`, and creates no Research Result.
