# Falsification Rules

All triggers are executable:

- F1 `BASELINES_MATCH_OR_EXCEED`: strongest comparator accuracy >= N4.
- F2 `NEXAH_REDUNDANT`: N4 predictions equal any one comparator on all held-out
  cases, or E6=0 and witness groups=0.
- F3 `THRESHOLD_ARTIFACT`: any positive claim depends on unequal comparison
  semantics. Primary comparisons are exact; any detected threshold use triggers.
- F4 `GROUND_TRUTH_LEAKAGE`: static diagnostic audit fails, truth token appears in
  public data, or diagnostic-output hash occurs after truth reveal.
- F5 `CORRESPONDENCE_TRIVIALIZES`: N2 matches/exceeds N4 accuracy and stage error.
- F6 `ORDER_DEPENDENCE`: JSON key, feature insertion or case-order permutation
  changes predictions after restoration by case ID.
- F7 `PRECONDITION_FAILURE`: suite count/stratification, monotonic truth,
  one-sided correspondence, alias bijection or schema validation fails.
- F8 `NO_LOSS_FALSE_POSITIVE`: N4 false-loss rate > `0.10`.
- F9 `KNOWN_CONTROL_ONLY`: H1 thresholds pass only when controls are included;
  controls are excluded mechanically, so any inclusion is protocol violation.
- F10 `STANDARD_BASELINE_SUFFICIENT`: any B0–B6 matches/exceeds N4 accuracy with
  no greater stage error.

F3/F4/F6/F7/F9 are fatal protocol-validity gates. F1/F2/F5/F8/F10 bar incremental
value but remain reportable scientific negatives.

