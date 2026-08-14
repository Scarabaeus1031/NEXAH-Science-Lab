# Gate 1 — Independent Task, Cost and Adequacy Contract

## Candidate contract

For a representation stage `i`, a fixed predictor produces the externally named
future-event decision `Y`. The decision maker chooses among:

- `USE_i`: use stage `i`;
- `USE_SOURCE`: retain/use the costly source;
- `REMEASURE`: buy a fixed additional observation batch;
- `REJECT`: decline the task;
- `UNKNOWN`: operationally identical to `REMEASURE`, with identical cost.

Adequacy must be defined only through externally meaningful task performance,
for example population task risk `R_i <= tau`. It must not be defined by a NEXAH
certificate, collision count, ledger state or preferred representation.

A valid owner contract must fix before either method is specified:

1. target outcome, horizon and prediction unit;
2. admissible predictor/action classes;
3. adequacy threshold `tau` and calibration requirement;
4. losses for task error and unsafe acceptance;
5. false-rejection/opportunity cost;
6. source-retention and representation costs;
7. remeasurement quantity, timing and cost;
8. the fact that `UNKNOWN` has the same consequences for every method;
9. sample, query, compute, memory and tuning budgets;
10. the deployment population over which risk is defined.

## Independence attack

No application owner or external operational requirement presently supplies
these quantities. The synthetic storage-versus-risk story is coherent, but it
does not determine `tau`, cost ratios, prediction horizon or acceptable
calibration. These choices could be made without NEXAH, yet they have not been.

Collision language is especially hazardous: a task cannot be declared unsafe
because a NEXAH certificate calls two cases a collision. Unsafe acceptance must
instead mean excessive externally scored task risk.

## Required evidence for a pass

Gate 1 can pass only after an independent task owner or a cited standard decision
problem signs a versioned contract without inspecting method outputs. A synthetic
contract is acceptable only if its utility is defensible from the task itself,
includes multiple prospectively fixed cost regimes, and names one primary regime
without reference to expected NEXAH behavior.

## Verdict

`GATE_1_CONDITIONAL`

The task form is method-neutral, but costs, adequacy and practical effect size are
not externally justified. Preregistration is not authorized.

