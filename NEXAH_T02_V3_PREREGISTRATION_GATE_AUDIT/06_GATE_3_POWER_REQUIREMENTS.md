# Gate 3 — Power Requirements

## Design-only requirement

No power value can be calculated yet because the primary cost vector, practical
equivalence margin, process-family distribution, variance structure and finalized
algorithms are absent. Inventing them here would manufacture evidence.

A later design-only calculation must specify:

1. primary estimand `Delta(n,b)` at one externally relevant `(n,b)`;
2. smallest practically important absolute risk difference `epsilon` from the
   task owner;
3. paired comparison at the independent-system level when both methods see the
   same cases;
4. target precision or power for superiority and equivalence conclusions;
5. expected loss variance/covariance from external pilot literature or conservative
   bounds, never candidate benchmark results;
6. number of independent systems and handling of within-trajectory dependence;
7. one primary comparison and multiplicity rules for budgets/cost regimes;
8. deterministic resource accounting, tuning allocation and failure handling;
9. Monte Carlo scorer error bounded well below the confirmatory interval width;
10. a prospective rule for inconclusive intervals.

## Valid conclusion rule

Use a confidence interval for `Delta` and the owner-defined margin `epsilon`:

- upper bound `< -epsilon`: practically meaningful NEXAH advantage;
- lower bound `> +epsilon`: practically meaningful B8 advantage;
- interval contained in `[-epsilon,+epsilon]`: practical equivalence;
- otherwise: inconclusive.

This four-way rule permits null, either method loss and inadequate precision.
Failure to detect a difference is not equivalence.

## Implementation-quality confounding

Power cannot rescue an underspecified algorithm comparison. Both methods require
fixed interfaces, common training/tuning budgets, competence checks on neutral
controls, and symmetric failure penalties. B8 must not be a single weak model;
its within-training model selection must be frozen and charged. NEXAH may not use
additional hand engineering outside its budget.

## Current verdict

No quantitative power justification exists. A prospective method-independent
power plan is feasible only after the prior gates resolve their inputs. This is a
blocking condition for preregistration, not authorization to run a pilot on the
future confirmatory benchmark.

