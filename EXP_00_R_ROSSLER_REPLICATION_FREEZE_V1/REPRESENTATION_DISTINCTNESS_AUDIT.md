# Representation Distinctness Audit

**Result: PASS. The estimators are distinct, not statistically independent.**

| Property | TRAJECTORY | LEARNED_FIELD |
|---|---|---|
| input | decision state plus shared rollout observations | decision state plus shared rollout observations |
| learned object | finite-horizon action-conditioned objective map | local uncontrolled derivative field |
| response used | terminal objective by action | adjacent transition derivative after subtracting (Bu) |
| prediction | inverse-distance weighted terminal outcomes | local affine fit, controlled RK4 composition, terminal objective |
| output | five objective scores / weak action ranking | five objective scores / weak action ranking |
| support | query-state support | query and every predicted path state for every action |
| failure | whole-ranking abstention | whole-ranking abstention |

## Code-path audit

- `representation_trajectory.py` and `representation_learned_field.py` do not import or call one another.
- They do not share cached score vectors, fitted response matrices, or terminal predictions.
- LEARNED_FIELD never receives terminal objective labels as regression responses.
- TRAJECTORY never receives derivative labels or a fitted Jacobian.
- Their only common fitted inputs are the intentionally shared raw observation table, target metadata, action set, and support reference.
- Analytic plant code is outside both representation dependency trees.

## Interpretation boundary

Two different estimators trained on the same observations are not independent measurements. Their single Kendall-(\tau_b) value is described only as **pairwise action-ranking agreement**. The implementation and frozen documents do not call it consensus, majority agreement, distributed redundancy, or representation invariance.

