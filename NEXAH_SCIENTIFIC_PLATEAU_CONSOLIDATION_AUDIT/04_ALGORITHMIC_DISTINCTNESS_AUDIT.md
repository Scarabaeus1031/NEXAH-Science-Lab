# Algorithmic Distinctness Audit

## Decision

`ALGORITHMIC_DISTINCTNESS_NOT_ESTABLISHED`

No reproducible NEXAH input-output mapping is presently shown to be materially distinct from the strongest conventional method for the same information and resource budget.

| Area | Strong comparator family | Finding |
|---|---|---|
| Field segmentation | clustering, watershed/region methods, Morse–Smale methods | legacy code uses heuristics and nearest-seed assignment; no distinct mapping shown |
| Graph abstraction | region adjacency, graph compression, state aggregation | standard many-to-one abstraction |
| Dynamical analysis | Lyapunov, Koopman, state-space reconstruction, TDA | real standard modules and mislabeled proxies coexist; no new algorithm |
| Translation fidelity | rate–distortion, sufficiency, invariance/selectivity, bisimulation | NEXAH supplies a possible evaluation bundle, not a distinct estimator |
| T02 | hierarchical pooling, state-space models, calibrated selective prediction, remeasurement | strong B8 can subsume the verbal candidate; distinctness remains unclear |
| ORION | PnP, EKF/UKF, complementary filters, factor graphs/fixed-lag smoothing | `NEXAH_METHOD=UNDEFINED`; conventional methods fully specify the task |
| Uncertainty/decisions | Bayesian inference, calibration, abstention, decision theory | established machinery; no independent NEXAH rule validated |

Terminology, user interface, visualization, or chaining established operators does not establish algorithmic novelty. Reopening requires a frozen input-output contract, an implementable NEXAH method, information/resource parity, the strongest comparator, and a task-owner-defined loss. T02 and ORION do not currently satisfy these conditions.

