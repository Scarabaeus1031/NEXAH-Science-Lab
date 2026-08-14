# Final T02 Information-Limited Design Audit

## Conclusion

A fair nontrivial benchmark is possible in principle, but only after changing the
question from exact public first-loss computation to finite-sample downstream
decision quality under common information and resource limits.

The proposed substrate is a hidden finite-state Markov/aggregation family. Every
method receives the same labeled training/calibration trajectories, unlabeled
held-out observations, task definition, stage order and budget. Hidden states,
maps, correspondence, state count, population risk and test labels remain
scorer-only. Methods must estimate whether each representation is adequate for a
future-event task and decide which stage to use, whether to retain source data or
whether to remeasure.

The mandatory comparator is B8, a direct calibrated task-risk estimator that
minimizes the same external loss and may abstain. NEXAH has no additional
information. Its only candidate distinction is finite-sample structured
certificate/collision/uncertainty pooling. It can be wrong, redundant or dominated.
With infinite data, consistent methods should collapse to B8; only finite-resource
performance is a justified question.

This tests no principle beyond established statistics, decision theory,
information estimation, Markov aggregation and abstraction. It may nevertheless
test whether the specific operational synthesis improves held-out decisions under
a bounded budget. Execution is not yet justified: an independent task owner must
set costs/adequacy, the process-family distribution must be frozen, and a design-
only power/identifiability gate must pass.

## Mandatory questions

1. **Common information:** identical finite labeled train/calibration trajectories,
   unlabeled held-out stages, task/cost contract, stage order and resource budget.
2. **Hidden from methods:** hidden state/map/count/correspondence, population risk,
   test labels and case parameters.
3. **Scorer-only:** sealed law, large evaluation sample, true stage risks and
   optimal action.
4. **Target directly computable publicly:** no; population task risk must be
   estimated from finite data.
5. **Inference required:** calibrated per-stage task adequacy and minimum-loss
   action under partial observability.
6. **Strongest comparator:** B8 direct calibrated task-risk/decision estimator.
7. **Mathematically distinct NEXAH:** different finite-sample structured estimator,
   not different information or asymptotic target.
8. **Can NEXAH lose:** yes through bias, false collisions or costly abstention.
9. **Can baseline lose:** yes through variance, pooling bias or missed rare strata.
10. **Can both return UNKNOWN:** yes, charged the same remeasurement cost.
11. **External loss:** unsafe acceptance, task error, representation/source cost,
    unnecessary rejection and remeasurement.
12. **Beyond prior art:** no new theory; only an operational finite-budget method
    comparison not yet established for this exact synthesis.
13. **Infinite-data collapse:** yes, to the direct optimal decision.
14. **Finite-resource justification:** yes in principle because samples, queries
    and computation have external cost; still needs owner-provided constants.
15. **Worth preregistration/execution:** potentially, only after the three gates in
    `09_CANDIDATE_BENCHMARK.md`; not authorized now.

## Machine-readable conclusion

```text
INFORMATION_PARITY_DEFINED = YES
GROUND_TRUTH_SCORER_ONLY = YES
TARGET_NOT_DIRECTLY_COMPUTABLE = YES
REAL_INFERENCE_REQUIRED = YES
STRONGEST_DIRECT_COMPARATOR_INCLUDED = YES
NEXAH_DISTINCT_FROM_DIRECT_COMPARATOR = YES
EXTERNAL_DECISION_LOSS_DEFINED = PARTIAL
UNKNOWN_ALLOWED = YES
NEXAH_CAN_LOSE = YES
BASELINE_CAN_LOSE = YES
ORACLE_LEAKAGE_FOUND = NO
ASYMMETRIC_TASK_INFORMATION_FOUND = NO
NONTRIVIAL_INCREMENTAL_VALUE_TEST_EXISTS = YES
EXECUTION_SCIENTIFICALLY_JUSTIFIED = NO
PROTOCOL_FROZEN = NO
EXPERIMENT_EXECUTED = NO
ORIGINAL_T02_CHANGED = NO
T02_V2_CHANGED = NO
CANONICAL_NEXAH_CHANGED = NO
REVIEW_DECISION = NONTRIVIAL_T02_V3_DESIGN_POSSIBLE
NEXT_ACTION = OBTAIN_AN_INDEPENDENT_TASK_COST_CONTRACT_FREEZE_THE_PROCESS_FAMILY_AND_COMPLETE_A_DESIGN_ONLY_POWER_GATE_BEFORE_ANY_V3_PREREGISTRATION
```

NONTRIVIAL_T02_V3_DESIGN_POSSIBLE

