# Minimum Lab Structure

Status: recovered design; not an implementation authorization

## Question

For one frozen finite-dimensional synthetic state model and one fixed history-dependent weighted estimator, does a constant-width observation mask moving at constant velocity change estimation error and reacquisition behavior relative to an information-matched static mask?

## Hypothesis

With information loss matched, mask motion produces a reproducible difference in error or reacquisition behavior for the fixed estimator.

## Variables

- controlled: state model, channels, mask width, static/moving schedule, velocity, noise law/seeds, history, translations, weights;
- estimated: local estimates, shared-space estimates, weighted estimate, declared uncertainty if available;
- derived: error, estimator movement, reacquisition, information status, false-confidence count, baseline delta;
- unknown: unreconstructable masked state and all external generalization.

## Protocol

The minimum protocol is recovered from the handoff and Mission 03:

1. freeze one low-dimensional synthetic trajectory and observation system;
2. freeze one history-dependent estimator, translation contract, and fixed weights;
3. freeze paired noise seeds and all metrics before runs;
4. run no-mask reference, static-mask baseline, and one constant-velocity moving-mask condition;
5. match mask width and predeclared removed-information exposure between static and moving conditions;
6. keep synthetic truth isolated from the estimator and reveal it only for evaluation;
7. record directly available, reconstructed, underdetermined, and unknown status;
8. compare paired error and reacquisition outputs under the preregistered rule;
9. report a terminal result class and stop.

This document does not choose matrices, parameter values, thresholds, sample size, software, or repository. Those choices belong to an authorized protocol-design step.

## Expected observations

The Lab is expected to observe one of:

- moving-mask behavior differs from the matched static condition;
- no detectable difference appears;
- a difference is explained by a simpler exposure or baseline effect;
- the comparison is blocked by identifiability or protocol failure.

No outcome is presumed.

## Possible outcomes

`SUPPORTED`, `NULL`, `LIMITING`, `FALSIFIED`, or `BLOCKED` as defined in `07_FALSIFICATION.md`.

## Limitations

- synthetic rather than empirical;
- one model, estimator, mask width, velocity, and seed set;
- finite-dimensional Euclidean representation;
- no cross-domain inference;
- no estimator optimality claim;
- no physical, causal, control, OLS, or operator conclusion;
- results depend on the declared information-matching and reacquisition rules.
