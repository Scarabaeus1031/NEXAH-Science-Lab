# Gate 1 — Cost Sensitivity

## Loss family

Let `A_i` indicate that stage `i` violates the externally fixed adequacy rule.
A generic common loss is:

```text
L(USE_i,Z) = c_repr(i) + c_error * task_error(i,Z)
             + c_unsafe * A_i
L(USE_SOURCE,Z) = c_source + c_error * task_error(0,Z)
L(REMEASURE,Z) = c_measure + optimal_post_measurement_loss(Z)
L(UNKNOWN,Z) = L(REMEASURE,Z)
L(REJECT,Z) = c_reject
```

The same function scores both methods. Abstention receives no NEXAH-specific
credit.

## Regime analysis

| Cost regime | Likely decision pressure | Ranking vulnerability |
|---|---|---|
| very high `c_unsafe` | conservative use, remeasurement/abstention | favors any method that abstains more unless remeasurement is fully charged |
| high `c_measure` | avoid `UNKNOWN` and acquire decisions | can favor an aggressive calibrated estimator over conservative certificates |
| high `c_source` | select compressed stages | magnifies false adequacy calls and threshold sensitivity |
| high `c_reject` | discourage rejection | rewards coverage, penalizes selective methods |
| dominant `c_error` | approximate ordinary predictive-risk comparison | likely collapses toward strong B8 |
| flat representation costs | stage selection has little utility | weakens the purpose of the representation ladder |

Reasonable cost changes can therefore reverse method ranking. That is not itself
a defect: decision-optimal methods are expected to depend on utility. It becomes
a defect if one favorable cost vector is selected post hoc or a global method
claim is inferred across incompatible utilities.

## Required sensitivity contract

- One independently owned primary vector and practical margin must determine the
  confirmatory conclusion.
- A small, externally justified set of secondary regimes must be frozen before
  implementation.
- Report risk difference and action-specific components, not only weighted loss.
- A sign reversal across secondary regimes means `UTILITY_DEPENDENT`, not method
  superiority.
- No cost may be estimated from test-set method behavior.

## Current assessment

Cost sensitivity is scientifically manageable but currently unconstrained. The
conclusion could be researcher-degree-of-freedom dominated until an external
contract fixes the primary regime and interpretation of reversals.

