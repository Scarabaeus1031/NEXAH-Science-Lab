# Primary Endpoints

Held-out cases only (`n=84`):

- E1 `A_exact`: exact prediction accuracy including `NO_LOSS`.
- E2 `E_stage`: mean `abs(code(k_hat)-code(k*))`, with T1…T6=`1…6`,
  `NO_LOSS=7`, and `UNRESOLVED=7` for loss truths but `0` distance only when
  true is `NO_LOSS` and prediction `NO_LOSS`.
- E3 false-loss rate: predicted T1–T6 among true `NO_LOSS`.
- E4 missed-loss rate: predicted `NO_LOSS`/`UNRESOLVED` among true T1–T6.
- E5 N4 accuracy and stage-error margins versus strongest comparator.
- E6 uniquely correct N4 count: N4 correct and every comparator wrong/unresolved.
- E7 reverse unique count: N4 wrong and at least one comparator correct.
- E8 redundancy: exact prediction equality with any comparator plus count of
  baseline-decision-vector collision witness groups.

Report integer numerators/denominators and exact rational-derived floats. No
scalar NEXAH score, p-value, confidence interval, threshold tuning or population
claim is permitted.

