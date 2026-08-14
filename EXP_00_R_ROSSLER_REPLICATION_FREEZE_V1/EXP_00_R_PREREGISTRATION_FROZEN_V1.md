# EXP-00-R Preregistration — Frozen Version 1

**Configuration:** `EXP00R-ROSSLER-2REP-XCTRL-H1-FROZEN-20260808-v1`  
**Status:** FROZEN; REGISTERED RÖSSLER EXPERIMENT NOT EXECUTED.

This additive version adopts the complete design contract in the unchanged `EXP_00_R_ROSSLER_REPLICATION/` package except for one preregistered correction made during independent review.

## Versioned correction

Draft v0 excluded a state from both primary carrier regressions when either carrier selected (u=0). Frozen v1 rejects that output-conditioned population rule. The primary population is now every jointly supported state. For a carrier selecting (u=0):

\[
\Delta J=J(x_H^0)-J(x_H^0)=0,
\qquad S=1[0\le-0.01]=0.
\]

Active-only analyses are descriptive secondary diagnostics. This change was made without registered data and is justified in `CARRIER_POPULATION_SELECTION_AUDIT.md`.

## Resolved decisions

- **OD-1:** freeze scalar additive x-channel actuator and (U=\{-0.5,-0.25,0,0.25,0.5\}).
- **OD-2:** freeze training-only high-(x), three-dimensional standardized target ball as an operational task, not a natural Rössler goal.
- **OD-3:** freeze (H=1.0), RK4 `dt=0.005`, with horizon sensitivities 0.5 and 1.5.
- **OD-4:** retain the strict classification ceiling: frozen Lorenz v2's carrier dependence means EXP-00-R can reach at most `PARTIAL CROSS-SYSTEM REPLICATION` without a new carrier-balanced Lorenz replication.

## Frozen hypothesis terminology

EXP-00-R tests whether **pairwise agreement between two distinct learned action-ranking representations** adds held-out information about intervention reliability. It does not test consensus, a majority, three-view redundancy, or representation invariance.

All remaining plant, data, action, objective, representation, support, ranking, coherence, baseline, null, sensitivity, bootstrap, falsification, and classification values are serialized in `EXP_00_R_FROZEN_CONFIG.yaml` and the unchanged draft contracts incorporated by reference.

