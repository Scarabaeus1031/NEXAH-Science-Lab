# NEXAH Diagnostic and Ablations

- `N0 BASELINES_ONLY`: majority of B0–B6 predicted labels; ties `UNRESOLVED`.
- `N1 +STAGE_ORDER`: Boolean union of baseline survival signals followed by
  monotone first-loss localization.
- `N2 +CORRESPONDENCE`: exact whole-feature comparison after source→stage alias
  alignment; nuisance features remain included.
- `N3 +COLLISION_LEDGER`: N2 plus explicit equality-transition records; prediction
  is independently derived from the full aligned feature set.
- `N4 COMPLETE`: uses the public task query to isolate only the target observable,
  applies correspondence, records its stage-wise survival/collision ledger and
  predicts the first monotone `1→0` or `NO_LOSS`.

N4 does not consume baseline outputs. N0–N3 and all B methods are comparators.
N4's additional operation is task-specific projection, classified prospectively
as `SAME_INPUT_DIFFERENT_OPERATOR`; it is not independent raw information.

Required N4 output per case: survival vector, predicted label, loss transition,
correspondence status, destroyed-distinction record, applicable stages and exact
source/stage IDs. Missing/one-sided correspondence produces `UNRESOLVED`, never a
guessed stage.

