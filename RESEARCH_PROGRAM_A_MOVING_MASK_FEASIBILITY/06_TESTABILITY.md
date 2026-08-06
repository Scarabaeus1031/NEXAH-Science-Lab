# Testability Review

## Scientific quality scores

| Criterion | Score | Justification |
|---|---:|---|
| clarity | 4/5 | One primary comparison can be extracted. The source handoff itself contains five alternative hypotheses and must be reduced before protocol freeze. |
| testability | 4/5 | State truth, mask schedules, estimator outputs, error, and reacquisition are measurable in a synthetic benchmark. Exact thresholds and the information-matching rule remain unspecified. |
| scope | 4/5 | Finite-dimensional state, fixed channels, one estimator, and three mask conditions form a bounded scope. The original handoff includes many excluded successors. |
| repeatability | 4/5 | Fixed trajectories, parameters, seeds, and deterministic records are explicitly required. They have not yet been selected or packaged. |
| observability | 4/5 | Synthetic reference truth permits direct scoring, while rank and record classes expose missing information. The true state is intentionally hidden from the estimator during reconstruction. |
| reproducibility | 3/5 | The required protocol, hashes, tests, baselines, and environment are described but no exact implementation or independent replay exists. |
| minimality | 3/5 | A minimum Lab is recoverable, but the source bundles width, velocity, weighting, uncertainty, sensitivity, and multiple future studies. Strict exclusions are required. |
| domain independence | 3/5 | The formal input/output contract is domain-neutral, but evidence from one synthetic linear benchmark cannot establish cross-domain portability. |

Total: `29/40`

## Inputs

- frozen state dimension, dynamics, initial state, horizon, and process-noise rule;
- fixed observation operators and sampling interval;
- no-mask, static-mask, and constant-velocity schedules;
- fixed mask width and information-matching rule;
- paired observation-noise seeds;
- one local estimator and history policy;
- explicit translation maps;
- fixed weights;
- preregistered metrics, thresholds, equivalence rule, and stop conditions.

## Outputs

- time-indexed estimate and error;
- paired error summaries;
- estimator-movement diagnostic;
- reacquisition time or `NOT REACQUIRED`;
- rank/information and record-status trace;
- false-confidence count if its confidence rule is available and frozen;
- baseline deltas with uncertainty;
- full parameter and provenance record;
- one terminal result class.

## Observable quantities

Generated records, mask position, state reference for evaluation, estimator output, error, rank, visible fraction, contributing channels, weight distribution, threshold crossings, and time to reacquisition.

## Hidden quantities

The estimator does not receive masked reference-state values. State directions that cannot be identified from the available record remain underdetermined. External-domain validity and behavior under other estimators or mask families remain unknown.

## Feasibility result

The proposal is scientifically testable after protocol freeze. It is not implementation-ready because exact benchmark values, estimator, thresholds, environment, and owner are absent.
