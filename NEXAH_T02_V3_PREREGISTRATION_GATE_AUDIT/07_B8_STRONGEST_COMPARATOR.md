# B8 — Strongest Fair Direct Comparator

## Required interpretation

B8 is not a raw empirical error rate. It is the strongest conventional pipeline
justified by the common information and resource budget. It receives exactly the
same stage observations, training labels, pairings, stage order, task/cost
contract, remeasurement option and compute budget as NEXAH.

B8 may prospectively select among:

- calibrated probabilistic prediction and direct empirical decision-risk
  minimization;
- Bayesian or frequentist uncertainty estimation;
- hierarchical/partial pooling across systems and stages;
- Markov, hidden-state or state-space models when supported by observations;
- representation-aware covariates and common stage pairing;
- regularization and cross-validation within the common tuning budget;
- conformal/calibration procedures where their assumptions and target apply;
- selective classification, abstention and active remeasurement;
- monotonic, sequential or change-point structure only when independently
  justified by the representation contract.

Its output is an estimated action-risk vector plus uncertainty and the action
minimizing expected common loss. It may return `UNKNOWN` under the same rule and
cost as NEXAH.

## Fairness constraints

- Candidate families and selection rules are frozen before test access.
- B8 may use all structure visible to NEXAH, but not hidden maps or scorer truth.
- Training, calibration, preprocessing, hyperparameter search and inference all
  count against the same resource ledger.
- Competence is checked on neutral controls, not by selecting the test winner.
- A family-appropriate established estimator must be included if it dominates a
  generic B8 component.

## Collapse attack

Once B8 has hierarchical pooling, uncertainty, selective decisions, state-space
models and representation-aware covariates, generic phrases such as “structured
pooling,” “adequacy evidence” and “uncertainty routing” no longer distinguish
NEXAH. Collision bookkeeping can be a feature inside B8 if computed from the same
observations and scientifically justified.

Therefore a separate NEXAH method survives only if its complete, executable
mapping from the common packet to actions is prospectively specified and cannot
be reproduced by a conventional B8 model of equal complexity/resources. That has
not yet been demonstrated.

