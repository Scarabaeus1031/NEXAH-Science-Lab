# POLAR-LOD-01 strong-baseline and prospective protocol

Status: `EXTENDED CONTRACT FROZEN / NOT EXECUTION AUTHORITY`

This document fixes the scientific contract that must be completed before a
new Polar-Janus LOD execution can be authorized. The NEXAH candidate and core
comparators are fixed by `POLAR-LOD-BL-01`. This extension adds stronger
falsification routes without adding or tuning a candidate period.

## Scientific position and novelty boundary

Autoregression, harmonic regression, long-period zonal-tide correction and
effective-angular-momentum (`EAM`) inputs are established Earth-rotation
methods. Individual monthly and half-monthly lunar contributions to `LOD` are
also established. The possible contribution under test is therefore narrow:

- incremental predictive information in this exact frozen six-period family;
- a bounded, auditable relation-oriented test architecture;
- no claim that the six periods, lunar forcing or residual modeling are new.

Relevant method anchors include the IERS Conventions (2010), the Second EOP
Prediction Comparison Campaign assessment, and the GFZ ESMGFZ prediction
product:

- `https://iers-conventions.obspm.fr/content/chapter8/icc8.pdf`;
- `https://doi.org/10.1007/s00190-024-01824-7`;
- `https://doi.org/10.2478/arsa-2022-0022`.

## Target and task

- source: one named IERS C04 series and versioned retrieval;
- target: daily `LOD` in seconds;
- primary task: rolling one-day-ahead prediction;
- secondary horizons: direct-origin `3`, `7`, and `30` day prediction;
- allowed information at prediction date `t`: dated source rows through
  `t-1` only;
- evaluation population: contiguous daily rows newly admitted after the
  source freeze, excluding any row inspected during model or baseline design;
- minimum evaluation window: 180 complete daily targets and at least six
  complete synodic-month cycles;
- preferred evaluation window: 365 complete daily targets;
- the primary result is the one-day horizon; secondary horizons cannot rescue
  a failed primary result.

For a secondary horizon `h`, the forecast origin is `t` and the target is
`LOD(t+h)`. Every observed feature must be timestamped no later than `t`.
Separate coefficients are fitted for each horizon. Recursive insertion of
observed future LOD values is forbidden.

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

### B3 operational geophysical benchmark

The expanded test also requires a source-vintage-faithful EAM benchmark for
the horizons supported by the admitted operational product. It must use the
axial components of the archived GFZ ESMGFZ atmosphere, ocean, hydrology and
sea-level prediction products, or the corresponding archived combined EAM
prediction. Only a product issued at or before the forecast origin is
admissible. Analysis or reanalysis values that became available later may not
stand in for a forecast.

Before execution, an EAM preflight must freeze:

1. product names, provider URLs, release timestamps and licenses;
2. raw file hashes and a missing-vintage ledger;
3. the exact EAM-to-LOD transformation and units;
4. the maximum supported forecast horizon;
5. a fallback rule fixed without outcome access.

`B3` is required for an operational-relevance claim. If historical forecast
vintages cannot be proven, the run may at most test the core B1/B2 question
and must be labelled non-operational.

The implementation and historical qualification are fixed in
`../POLAR_LOD_BL_01_BASELINE_QUALIFICATION_2026-10-01/`. No additional lag
bank, tidal model or period may be introduced after prospective freeze.

The six-period model must beat both B1 and B2 to support core incremental
utility. It must also beat B3 on the supported horizons to support operational
relevance. Beating only the historical M1 is insufficient.

## Frozen primary decision rule

At horizon `1`, compare M2 separately with B1 and B2 on identical dates.
`PASS_BOUNDED` requires all of the following:

1. M2 RMSE is at least `5%` lower than each comparator RMSE;
2. the one-sided `95%` lower confidence bound for the mean paired squared-error
   improvement is above zero for each comparator;
3. M2 MAE is lower than each comparator MAE;
4. improvement is positive in at least two of three chronological equal-sized
   evaluation segments, and no segment is worse by more than `5%` RMSE;
5. the specificity gate below passes.

Inference uses a circular moving-block bootstrap with block length `30` days,
`20,000` replicates and deterministic seed `20261001`. All incomplete paired
dates are excluded before resampling and their count is reported. There is one
primary horizon and no outcome-dependent comparator selection.

## Frozen specificity and ablation battery

The following models are secondary diagnostics and cannot replace M2:

- `A-FULL`: the four full-month periods only;
- `A-HALF`: the two half-month periods only;
- six leave-one-period-out M2 variants;
- `100` frequency-matched negative-control sets, each containing four periods
  drawn uniformly in frequency over `27–30` days and two over `13.5–15` days.

The negative controls use NumPy `PCG64` seed `20261001`; redraw any period
within `0.02` day of a frozen M2 period or another period in the same control
set. The specificity gate passes only when M2's paired RMSE improvement over
B2 exceeds the `95th` percentile of the negative-control improvements.

These diagnostics may localize an effect or show that generic nearby
frequencies perform similarly. They cannot convert a primary failure into a
pass.

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

The source-revision ledger must distinguish first-seen values from later C04
revisions. A sensitivity replay on one independently maintained final EOP
series is desirable but remains secondary and requires its own frozen source
binding.

## Primary endpoint

The primary endpoint is paired out-of-sample error difference against both B1
and B2 at horizon `1`. RMSE is primary and MAE is the concordance metric. B3
and horizons `3`, `7`, and `30` determine robustness and possible operational
relevance, not the primary scientific decision.

## Outcome classes

- `PASS_BOUNDED`: six-period M2 beats B1 and B2 by every frozen primary gate,
  including specificity and temporal robustness.
- `FAIL_BOUNDED`: valid execution but the incremental hypothesis does not pass.
- `INVALID`: leakage, source ambiguity, baseline-validation failure,
  insufficient evaluation population or contract violation.

An additional `OPERATIONAL_RELEVANCE_SUPPORTED` annotation is allowed only if
M2 also beats the valid B3 benchmark on its supported horizons. It is not a
substitute for `PASS_BOUNDED`.

## STOP

Stop without execution if the established B2 baseline cannot be implemented
and independently reference-validated, if fewer than 180 new daily targets or
six synodic cycles are available, or if the evaluation rows have been used
during design. The preferred release point remains 365 complete targets.
Label the run non-operational if B3 forecast-vintage custody fails. Stop after
one authorized execution; no threshold repair or automatic successor.

## Claim ceiling

A PASS would support only incremental one-day-ahead predictive utility of the
frozen six-period feature set for the named IERS series and evaluation window.
Secondary horizons may support temporal robustness. Only a valid B3 comparison
may support a bounded operational-relevance annotation. No outcome establishes
causality, novel lunar physics, a universal `4+2` structure, an operational
service or general NEXAH superiority.
