# Optional Minimum Test Specification

## Authorization

Specification only. No implementation, simulation, optimization run, trajectory generation or Human data collection is authorized or reported.

## Exact question

In one small, fully declared synthetic dynamical system, do multiple distinct feasible trajectories reach the same predeclared task-return class while producing different shortest-path, work, stability, load-proxy and occupancy rankings—and does a frame/loss/residual ledger make those distinctions independently reconstructable?

This question tests the composite's discriminating value. It does not test whether the cat visual, a Human body or a golf swing has the depicted geometry.

## Frozen construction

Before execution freeze:

- state/control spaces, dynamics, horizon and initial set;
- equality/inequality, contact, power, energy and load constraints;
- target return map `F`, acceptance set and partition `kappa_r`;
- path metric/topology and corridor construction rule;
- deterministic trajectory-generation/enumeration method and complete admissible family definition;
- observer views, frames, sampling, projection and loss rules;
- stability metric, work ledger and mechanical-load proxy;
- seeds if any, numerical method, tolerances and failure states;
- density sampling measure, minimum sample size, estimator and uncertainty rule;
- Pareto objective directions and dominance rule.

## Comparators

Among the same frozen feasible trajectory family identify, if they exist:

1. shortest path under declared `d_length`;
2. minimum accounted work;
3. most stable path under a declared perturbation/robustness functional;
4. minimum mechanical-load **proxy**;
5. most frequent/occupied path class only if independent samples support estimation.

Ties and empty argmin sets remain explicit. Do not force one representative. Determine whether the selected sets are identical, overlap or differ.

## Pareto orientation

For each feasible path, report a vector such as:

    J(gamma) = (-speed, accuracy_error, instability,
                repeatability_error, work, mechanical_load_proxy,
                injury_risk_proxy)

Sign conventions and every proxy must be defined in advance. `injury_risk_proxy` is not injury risk validation. Report the nondominated set:

    P = {gamma in T_task : no gamma' weakly improves every objective
                         and strictly improves at least one}

No weights or scalar optimum are introduced unless separately authorized by the Human.

## Outputs

Trajectory and control IDs; feasibility/reachability status; state traces; Kaskadenz relation records where applicable; return vector/class; pairwise tolerance comparison; objective vector; comparator memberships; Pareto status; observer view; projection loss; compatible-path fiber; residual types; numerical error; density-estimation status; uncertainty; Human selection left unset.

## Pass and stop rules

The composite has incremental audit value only if an independent reader can reconstruct why paths are state-different, relation-similar/different and return-equivalent/comparable, and can identify every loss/proxy/uncertainty without changing underlying numerical results.

Stop with `FRAME_UNBOUND`, `DYNAMICS_UNBOUND`, `CONSTRAINT_UNBOUND`, `RETURN_CLASS_UNBOUND`, `PROXY_UNBOUND`, `INSUFFICIENT_SAMPLES_FOR_DENSITY`, `NUMERICALLY_UNRESOLVED`, `NO_MULTIPLE_FEASIBLE_PATHS`, `NO_INCREMENTAL_AUDIT_VALUE` or `HUMAN_STOP` as applicable.

    MINIMUM_TEST_JUSTIFIED = YES_SPECIFICATION_ONLY
    TEST_IMPLEMENTED = NO
    TEST_EXECUTED = NO

