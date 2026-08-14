# Direct Comparator Attack

## Strongest fair comparator

`B8_DIRECT_DECISION_THEORETIC` receives the common packet and directly estimates
per-stage task risk with calibrated uncertainty using a frozen nested/predictive
procedure. It selects the action minimizing expected external loss, including an
`UNKNOWN/request-more-data` action. It is task-aware and may use stage order.

Additional attacks:

- conditional entropy/mutual-information estimator with finite-sample bounds;
- cross-validated task classifier risk at each stage;
- empirical Markov lumpability/KL aggregation when preconditions apply;
- graph/WL diagnostics for graph observations;
- approximate-bisimulation distance for declared behavioral targets;
- reconstruction distortion plus a task-risk model;
- sequential change-point/isotonic risk estimator across stages.

## Result of attack

With infinite data and an unrestricted correct model, B8 computes the optimal
decision directly. NEXAH cannot contain more task information under parity.
However, with the same finite trajectory and compute budget, estimators can differ
in bias, variance, calibration, abstention and use of cross-stage structure.
That is a legitimate established statistical comparison, not a new information
principle.

A NEXAH advantage is invalid if it is reproducible by:

- a threshold change;
- reformatting B8 risks/confidence bounds;
- using labels/correspondence absent from B8;
- choosing the best certificate after test results;
- comparing against only a weak direct estimator.

B8 is compulsory. Any future v3 must benchmark against tuned-within-training but
fully frozen conventional model families under identical resource accounting.

