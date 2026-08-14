# Candidate Estimands

| Candidate | Classification | Adversarial assessment |
|---|---|---|
| 1 partial observability | `NONTRIVIAL` only with finite data | task sufficiency is not directly known; otherwise population conditional risk solves it conventionally |
| 2 unknown correspondence | `PARTIALLY_NONTRIVIAL` | matching is inferential, but giving NEXAH privileged matching is unfair; same trajectories permit all methods to infer it |
| 3 finite-sample localization | `NONTRIVIAL` | methods estimate population task-risk crossings with uncertainty; finite-sample error is real and measurable |
| 4 held-out counterfactual generalization | `NONTRIVIAL` if transformations/maps are held out by family | must predict task adequacy from training systems, not hand-select collision pairs |
| 5 downstream decision | `NONTRIVIAL` | fixed cost makes calibration, abstention and false acceptance externally consequential |
| 6 resource-limited diagnosis | `NONTRIVIAL` as secondary factor | legitimate only because trajectory acquisition/compute are costly; equal budgets mandatory |

## Primary estimand candidate

For stage `i`, let `R_i` be the sealed population task risk of the frozen optimal
predictor class trained with unlimited scorer data. Define adequacy by the
externally selected requirement `R_i <= tau`. Define true first loss as the first
stage where adequacy fails after being adequate; nonmonotone cases are a distinct
`UNIDENTIFIABLE_FOR_FIRST_LOSS` truth, not forced into a stage.

The diagnostic estimand is not exact survival from public arrays. It is the
finite-sample decision:

```text
choose the least costly adequate stage, request source/re-measurement, or UNKNOWN
```

Primary score is external decision loss, not ledger agreement. First-loss
localization is a secondary explanatory endpoint.

The threshold `tau`, action costs, predictor class, trajectory budget and case
distribution must be selected from an independently motivated application
contract before preregistration—not tuned to NEXAH outcomes.

