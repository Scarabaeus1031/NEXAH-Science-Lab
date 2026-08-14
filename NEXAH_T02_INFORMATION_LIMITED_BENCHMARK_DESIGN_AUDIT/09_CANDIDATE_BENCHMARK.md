# Candidate Benchmark

## Decision

`NONTRIVIAL_T02_V3_DESIGN_POSSIBLE`, conditional on three pre-freeze gates. This
document is not a protocol.

## Proposed estimand

Under a common finite trajectory/compute budget, estimate the action minimizing
externally fixed loss when selecting among progressively aggregated representations
for a specified future-event task. Secondary: localize the first population-risk
adequacy crossing or return `NO_LOSS/UNIDENTIFIABLE`.

## Information contract

Use the exact parity matrix in `02_INFORMATION_ACCESS_MATRIX.md`: same labeled
train/calibration trajectories, unlabeled held-out observations, task/cost
contract, stage order and budgets; no hidden states/maps/state count/test labels.

## Comparator set

- B8 direct calibrated task-risk/decision estimator (primary strongest attack);
- conditional-information estimator;
- empirical Markov/lumping and approximate-bisimulation methods when applicable;
- reconstruction, graph-expressivity and simple statistical baselines;
- NEXAH component ablations.

## Decision endpoint

Primary: mean external decision loss on held-out systems, with false acceptance,
unnecessary rejection, remeasurement and calibration reported separately.
NEXAH incremental value requires a preregistered practically meaningful loss
improvement over the strongest comparator and all ablations, not one unique case.

## Required gates before any preregistration

1. independent owner supplies `tau` and cost ratios;
2. process-family distribution and applicability rules are frozen from scientific
   considerations, not method outcomes;
3. design-only identifiability/power analysis shows meaningful discrimination at
   the common resource budget.

Failure of any gate converts the recommendation to
`T02_RESEARCH_LINE_SHOULD_STOP`; it does not authorize synthetic tuning.

