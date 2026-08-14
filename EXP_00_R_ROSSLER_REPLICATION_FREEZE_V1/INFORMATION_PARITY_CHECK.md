# Information Parity Check

**Result: PASS (static/mechanical; registered science not executed).**

| Contract item | TRAJECTORY | LEARNED_FIELD | Check |
|---|---|---|---|
| seed registry | same `SharedRolloutTable.seed_ids` | same object | manifest equality test |
| observed variables | (x,y,z) | (x,y,z) | fixed neutral contract |
| raw controlled rollouts | complete shared table | complete shared table | `raw_table_identity` equality |
| action labels | same scalar array | same scalar array | exact-array fairness assertion |
| sampling schedule | 0.05 observations | 0.05 observations | table metadata |
| horizon | 1.0 | 1.0 | table and frozen config |
| target/objective metadata | identical center, radius, normalization, score | identical | fitted parity manifests |
| future test access | prohibited in `fit` | prohibited in `fit` | `source_split == train` guard |
| test-outcome access | none during fit | none during fit | API boundary |
| analytic Rössler field | none | none | separated module/dependency audit |

## Different transformations of equal information

TRAJECTORY selects the terminal state from each action-conditioned rollout, applies the shared target objective, and learns a neighborhood map from decision state/action to finite-horizon objective.

LEARNED_FIELD selects adjacent transitions from the same rollout table, subtracts the known additive (Bu) term, estimates a query-local affine derivative model, composes that model with RK4, and applies the same target objective.

Equal access does not imply equal capacity or accuracy. The representations deliberately learn different mathematical objects.

## Analytic-field boundary correction

The first static implementation placed `SharedRolloutTable` in `data.py`, which also imported the analytic plant. The learned field did not call the plant, but the transitive dependency prevented a strong no-access certification. Before freeze, the neutral contract was moved to `rollout_contract.py`; learned representations now depend only on the neutral table, actions, integration, objective, and support modules. Plant generation remains isolated in `data.py` and `rossler.py`.

## Mechanical evidence

- unit test 15 verifies identical parity manifests from the exact same raw table;
- tests 6–7 enforce training-only target construction;
- test 4 and deliberate negative fairness test 20 enforce exact action equality;
- test 19 verifies no analytic Rössler import in LEARNED_FIELD;
- tests 18 and 21 enforce frozen configuration and registered-seed boundaries.

