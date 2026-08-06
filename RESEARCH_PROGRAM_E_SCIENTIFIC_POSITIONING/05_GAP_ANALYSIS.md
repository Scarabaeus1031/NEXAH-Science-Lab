# Gap Analysis

## Questions studied extensively

### E-Q04 — Weighted barycenters and data fusion

The Euclidean weighted mean, weighted least squares, consensus, sensor fusion, and non-Euclidean Fréchet/Karcher means are established. Repository gap: specify the carrier, metric, weights, noise model, and invariance group.

### E-Q05 — Incomplete-observation identifiability

Observability, inverse problems, tomography, and multi-view reconstruction are mature fields. Repository gap: replace visual cases with explicit forward operators, equivalence classes, noise, and recovery criteria.

### E-Q06 — Time-varying intermittent observations

Kalman filtering with intermittent observations, switched sensing, and sensor scheduling directly cover the core question. Repository gap: freeze one ordinary estimator and observation schedule; do not introduce a new scientific object.

### E-Q09 — Property-preserving graph reduction

Sparsification, coarsening, lumpability, and backbone extraction provide established methods and guarantees. Repository gap: choose one reduction operation and one property set.

### E-Q10 — Trajectory-based transition diagnostics

Change-point detection, recurrence, coherent-structure methods, FTLE, and simple geometric diagnostics provide mature comparisons. Repository gap: freeze event labels, statistic, baselines, nulls, and held-out evaluation.

## Questions partially represented by literature

| ID | Reason overlap is partial |
|---|---|
| E-Q01 | Information theory handles stochastic transformations and sufficient statistics; inverse problems handle forward maps. The repository mixes identity, provenance, invariants, and partial-domain failure without selecting one formal setting. |
| E-Q02 | Labelled and hybrid transition systems are mature, but heterogeneous scientific evidence and provenance normally live in separate typed layers. |
| E-Q03 | Missingness, censoring, numerical failure, physical boundary, and non-identifiability each have mature literatures; their joint record semantics are fragmented. |
| E-Q07 | Cycle consistency is established, but its use as a quantitative proxy for information loss is not valid without additional assumptions or calibration. |

## Question with weak overlap

### E-Q08 — Invariant graph statistics

Graph invariance and equivariance are established. The overlap is weak because the repository has no defined observable. The scientific question becomes ordinary only after the statistic, graph type, encoding equivalence, and perturbation class are stated.

## Questions with no obvious literature match

`None.`

This does not mean every repository formulation is solved. It means every surviving question falls inside an existing discipline and can be stated using existing scientific language.

## Gap types

| Gap | Affected questions | Required reduction |
|---|---|---|
| Undefined object | E-Q04, E-Q08 | Define carrier/output; use standard estimator/statistic names |
| Mixed semantic levels | E-Q02, E-Q03 | Separate transition, provenance, missingness, failure, and physical boundary |
| Missing assumptions | E-Q01, E-Q05, E-Q07 | State maps, probability/noise model, equivalence, and loss criterion |
| Missing protocol | E-Q06, E-Q10 | Freeze estimator/statistic, baselines, labels, metrics, and held-out data |
| Missing guarantee | E-Q09 | Name retained property and approximation tolerance |

## Novelty boundary

- No question is presently unique.
- No repository term establishes a new method class.
- A new result could still be useful if it is a bounded result within one of these established questions.
- Novelty assessment, if ever needed, requires a separate systematic review after definitions and results exist.
