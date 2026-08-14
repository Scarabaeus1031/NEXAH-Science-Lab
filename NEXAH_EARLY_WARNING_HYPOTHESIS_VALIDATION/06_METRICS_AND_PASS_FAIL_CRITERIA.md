# Metrics and Pass/Fail Criteria

Status: `PROPOSED / NOT_ADOPTED`

## Run-level definitions

For event time `T_E`, candidate warning `T_N` and comparator alarm `T_B`:

```text
L_N = T_E - T_N
L_B = T_E - T_B
Delta_L = L_N - L_B
```

Lead is credited only inside the preregistered actionable horizon. Missing
warning on an event run is a false negative, not an invented zero lead.

## Required metrics

| Metric | Definition/reporting |
|---|---|
| Event detection rate / recall | detected event runs / valid event runs |
| False-negative rate | missed event runs / valid event runs |
| False-positive rate | warned event-free runs / valid event-free runs; also warnings per unit simulated time |
| Precision | true actionable warnings / all warnings |
| Warning lead | median, IQR, empirical 95% interval of `L_N` and `L_B` |
| Delta lead | paired `Delta_L` where both detect, plus full detection table to prevent survivor bias |
| Seed variability | run-level distributions and hierarchical summaries by seed |
| Stress-path variability | results stratified by rate, cap and event/non-event class |
| Threshold sensitivity | all metrics at frozen threshold and ±10%; no post-hoc winner selection |
| Numerical sensitivity | event/warning agreement at `dt=0.01` versus `0.005` |

Use paired bootstrap confidence intervals stratified by stress path for lead
comparisons, and exact/binomial intervals for rates. Report raw counts.

## PASS

All must hold on the untouched evaluation set:

1. at least 30 valid event runs and 30 valid non-event runs; otherwise
   `INCONCLUSIVE`;
2. candidate event recall is not more than 0.05 below comparator recall;
3. candidate false-positive rate is ≤0.10 and no more than 0.05 above the
   comparator rate;
4. median paired `Delta_L > 0` and its stratified 95% bootstrap interval has
   lower bound >0 among jointly detected events;
5. the advantage is directionally preserved at both ±10% threshold settings
   and in at least two evaluation stress-rate strata;
6. timestep-halving changes neither classification rates by more than 0.02 nor
   median lead by more than 10%;
7. all identity, provenance and no-retuning gates pass.

## FAIL

The execution is valid but the hypothesis fails if adequate evaluation data
exist and any substantive PASS gate fails: no positive lead advantage,
inferior recall, excessive false positives, non-robust threshold behavior or
advantage confined to a favorable path/seed subset.

## INCONCLUSIVE

- too few event or non-event runs;
- calibration yields no eligible threshold;
- numerical convergence/initialization validity fails;
- material manifest/code/data drift;
- confidence interval cannot be estimated under the frozen rule;
- prohibited evaluation retuning or selective data loss occurs.

Inconclusive is not converted to pass or fail by visual inspection.

