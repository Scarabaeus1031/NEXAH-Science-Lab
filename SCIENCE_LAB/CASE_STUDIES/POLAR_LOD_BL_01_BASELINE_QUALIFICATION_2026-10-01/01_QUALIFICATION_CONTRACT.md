# POLAR-LOD-BL-01 qualification contract

Date: 2026-10-01
Class: historical method-development audit
Outcome access: historical rows through 2025 were already known
Prospective authority: none

## Purpose

Qualify strong comparators for a later, separately authorized prospective
test of the fixed Polar-Janus six-period feature family on daily IERS C04
length-of-day values.

## Development population

- source snapshot: retained Test-08 extract, daily 2010-01-01 through
  2025-12-31;
- architecture selection: rolling annual holdouts 2018–2024 only;
- 2025: excluded from architecture selection and used only for a forensic
  comparison with the already-published Test-08 claim;
- task: one-day-ahead conditional prediction with observed values through
  `t-1` available at forecast date `t`.

This is not a blinded or preregistered result. Its purpose is to freeze a
defensible comparator before genuinely post-freeze evaluation rows exist.

## Candidate statistical architectures

Every candidate contains an intercept, linear time trend, annual and
semiannual sine/cosine terms, standardized on training rows only, and ridge
regularization chosen on the immediately preceding calendar year.

| ID | Fixed LOD lags in days |
|---|---|
| `L5` | 1, 2, 7, 14, 30 |
| `L9` | 1, 2, 3, 5, 7, 14, 21, 30, 60 |
| `L13` | 1, 2, 3, 5, 7, 10, 14, 21, 28, 30, 45, 60, 90 |
| `L17` | 1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 28, 30, 45, 60, 90, 120, 180 |

The architecture with the lowest pooled RMSE across 2018–2024 is frozen as
`B1`. No candidate may be added after this qualification.

## Frozen comparators

### B0 — persistence

`LOD_hat(t) = LOD(t-1)`.

### B1 — strong statistical

`B1-AR17`, selected on the development population. The prospective fit must:

1. use a fixed training block ending 366 days before the source freeze;
2. use the final 365 pre-freeze days only to select ridge alpha;
3. fit coefficients and scaling without any post-freeze target;
4. keep coefficients and scaling fixed for the evaluation window;
5. admit observed lagged LOD only when its timestamp is strictly earlier
   than the forecast timestamp.

### B2 — established geophysical

`B2-IERS-ZONT2` uses the same B1 architecture on

`LOD_residual(t) = LOD(t) - delta_LOD_RG_ZONT2(t)`

and returns

`LOD_hat(t) = residual_hat(t) + delta_LOD_RG_ZONT2(t)`.

The deterministic target-date correction is calculated from the official
IERS Conventions (2010) 62-term long-period zonal-tide model. Diurnal and
semidiurnal `ORTHO_EOP` terms are not added: the C04 daily series represents
fluctuations longer than roughly 6–7 days and daily exchange values omit those
high-frequency variations.

### M2 — candidate under test

`B1-AR17` plus exactly the six Test-08 sine/cosine period pairs:

`27.321661`, `29.530588214`, `27.554550`, `27.212221`, `13.6608305`, and
`14.765294107` days.

## Qualification gates

1. official IERS MJD 54465 `DLOD` test-case absolute error <= `1e-15 s`;
2. all development rows are daily and complete after required lags;
3. target-day mutation cannot alter its own prediction;
4. selected B1 pooled RMSE must beat both persistence and the historical
   five-lag M1 architecture on 2018–2024;
5. B2 must execute on all development years and beat B1 in pooled RMSE;
6. source, code, outputs and upstream routine hashes are recorded.

Passing these gates yields `BASELINE_READY`, not scientific PASS.

## STOP

Do not run the prospective outcome test until the minimum post-freeze data
window, custody, independent review and separate Human Owner release gates in
`POLAR-LOD-01` are all closed.
