# POLAR-LOD-01 strong-baseline and prospective protocol

Status: `BASELINES FROZEN / NOT EXECUTION AUTHORITY`

This document fixes the minimum scientific contract that must be completed
before a new Polar-Janus LOD execution can be authorized. The comparator
architecture is now fixed by `POLAR-LOD-BL-01`; inference and materiality
thresholds must still be frozen before any outcome access.

## Target and task

- source: one named IERS C04 series and versioned retrieval;
- target: daily `LOD` in seconds;
- task: rolling one-day-ahead prediction;
- allowed information at prediction date `t`: dated source rows through
  `t-1` only;
- evaluation population: contiguous daily rows newly admitted after the
  source freeze, excluding any row inspected during model or baseline design;
- minimum evaluation window: 180 complete daily targets and at least six
  complete synodic-month cycles;
- preferred evaluation window: 365 complete daily targets.

## Required comparators

1. `B0 persistence`: previous observed LOD.
2. `B1 strong statistical`: frozen `B1-AR17`, with lags
   `1, 2, 3, 4, 5, 6, 7, 10, 14, 21, 28, 30, 45, 60, 90, 120, 180`, trend,
   annual/semiannual harmonics and ridge alpha selected only on pre-freeze
   validation rows.
3. `B2 established geophysical`: frozen `B2-IERS-ZONT2`; apply B1 to LOD
   residuals after subtracting the IERS Conventions (2010) 62-term
   long-period zonal-tide correction, then add the known target-date
   correction back.
4. `M2 six-period`: B1 plus the unchanged six Test-08 periods.

The implementation and historical qualification are fixed in
`../POLAR_LOD_BL_01_BASELINE_QUALIFICATION_2026-10-01/`. No additional lag
bank, tidal model or period may be introduced after prospective freeze.

The six-period model must beat both B1 and B2 to support incremental utility.
Beating only the historical M1 is insufficient.

## Controls

- exact reproduction of the historical Test 08 result from its retained
  source snapshot, classified as reproduction only;
- source-revision ledger separating new rows from revised historical rows;
- timestamped prediction ledger or deterministic end-of-window replay whose
  feature builder is hash-frozen and provably excludes target-day values;
- negative-control period sets matched in number and frequency range;
- ablation of full-month and half-month families;
- missing-day, leap-day and source-latency tests;
- sensitivity to forecast origin, lag availability and standardization;
- residual autocorrelation and calibration diagnostics;
- one independent implementation or reviewer before result registration.

## Primary endpoint

The primary endpoint is paired out-of-sample error difference against the
stronger of B1 and B2. RMSE is primary and MAE is required as a concordance
metric. Confidence or randomization inference must respect temporal blocks and
must be fixed before outcome access.

## Outcome classes

- `PASS_BOUNDED`: six-period M2 beats both strong baselines by the frozen
  materiality threshold, inference gate and temporal-robustness gate.
- `FAIL_BOUNDED`: valid execution but the incremental hypothesis does not pass.
- `INVALID`: leakage, source ambiguity, baseline-validation failure,
  insufficient evaluation population or contract violation.

## STOP

Stop without execution if the established geophysical baseline cannot be
implemented and independently reference-validated, if fewer than 180 new daily
targets are available, or if the evaluation rows have been used during design.
Stop after one authorized execution; no threshold repair or automatic
successor.

## Claim ceiling

A PASS would support only incremental one-day-ahead predictive utility of the
frozen six-period feature set for the named IERS series and evaluation window.
It would not establish causality, novel lunar physics, a universal `4+2`
structure, an operational service or general NEXAH superiority.
