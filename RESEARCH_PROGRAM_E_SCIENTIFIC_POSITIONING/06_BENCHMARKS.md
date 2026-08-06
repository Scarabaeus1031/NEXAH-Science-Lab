# Benchmarks

## Benchmark inventory

Ten established benchmark families are sufficient for positioning. Inclusion is not authorization to run them.

| ID | Benchmark | Questions | Standard use | Repository relevance |
|---|---|---|---|---|
| B-01 | [Regularization Tools / AIR Tools II](https://www.imm.dtu.dk/~pcha/Regutools/) | E-Q01, E-Q05, E-Q07 | Discrete ill-posed inverse problems with known forward models and test solutions | Replaces ad hoc reconstruction examples with standard known-loss problems |
| B-02 | [Middlebury stereo and multi-view evaluations](https://vision.middlebury.edu/) | E-Q01, E-Q05 | Multi-view reconstruction with ground truth and standardized metrics | Tests view-dependent identifiability and reconstruction |
| B-03 | Intermittent-observation linear state-space benchmark based on [Sinopoli et al.](https://doi.org/10.1109/TAC.2004.834121) | E-Q06 | Kalman error covariance under declared dropout schedules | Direct scientific baseline for Moving Mask |
| B-04 | Lorenz-63 partial-observation and regime-switching cases | E-Q05, E-Q06, E-Q10 | Nonlinear estimation, observability, and diagnostic comparison | Matches current repository reference system without claiming universality |
| B-05 | Double-gyre and Bickley-jet coherent-structure cases, reviewed by [Haller](https://doi.org/10.1146/annurev-fluid-010313-141322) | E-Q10 | FTLE/LCS transport-barrier comparison | Standard alternative to visual corridor/aperture language |
| B-06 | Synthetic change-point signals and the [ruptures evaluation framework](https://doi.org/10.1016/j.sigpro.2019.107299) | E-Q10 | Known change locations, cost functions, segmentation and localization metrics | Supplies labels, nulls, and baseline methods |
| B-07 | [SNAP network datasets](https://snap.stanford.edu/data/) | E-Q08, E-Q09 | Large real graph structures across domains | Tests graph statistics and reduction outside repository fixtures |
| B-08 | [SuiteSparse Matrix Collection](https://sparse.tamu.edu/) | E-Q09 | Repeatable sparse-matrix and graph algorithm evaluation | Tests spectral/cut reduction at varied scale and structure |
| B-09 | [TUDataset](https://arxiv.org/abs/2007.08663) | E-Q08, E-Q09 | Standardized graph classification/regression datasets and baselines | Tests graph invariance and reduction effects on downstream tasks |
| B-10 | [MATPOWER/pandapower IEEE test cases](https://pandapower.readthedocs.io/en/v3.3.1/networks/power_system_test_cases.html) | E-Q01, E-Q05, E-Q10 | Reproducible benchmark power-flow cases | Existing repository use; remains benchmark computation, not operational evidence |

`NUMBER_OF_BENCHMARKS: 10`

## Minimum method baselines

| Question | Required benchmark methods |
|---|---|
| E-Q01 | rank, null space, injectivity on restricted domain, mutual-information or task-specific preservation where probabilistic |
| E-Q02 | labelled transition system, attributed graph, hybrid automaton, W3C PROV separation |
| E-Q03 | explicit missingness/censoring model, solver-status record, feasible-set or identifiability analysis |
| E-Q04 | weighted mean/least squares, robust estimator, Fréchet mean only for non-Euclidean carrier |
| E-Q05 | observability rank/Gramian, regularized inversion, multi-view reconstruction |
| E-Q06 | Kalman or declared fixed estimator under no loss, static schedule, moving/time-varying schedule, and simple dropout schedule |
| E-Q07 | forward residual, pseudoinverse/reconstruction error, known-loss calibration, task error |
| E-Q08 | standard graph invariants, graph kernels or graph-signal summaries, isomorphism counterexamples |
| E-Q09 | spectral/cut sparsification, graph coarsening, reachability-preserving heuristic |
| E-Q10 | change-point detection, curvature/direction change, recurrence, FTLE/LCS where applicable, shuffled-order null |

## Validation protocol requirements

1. Freeze the scientific question and standard terminology.
2. Select benchmarks by declared fit, not by favorable output.
3. Separate development, evaluation, and external replay.
4. Freeze preprocessing, parameters, random seeds, baselines, metrics, and failure rules.
5. Include negative controls, ablations, sensitivity, and simple baselines.
6. Report task performance, calibration, uncertainty, computation, and failure separately.
7. Preserve exact-replay failure separately from scientific-equivalence judgments.
8. Stop at the bounded result; do not infer cross-domain validity.
