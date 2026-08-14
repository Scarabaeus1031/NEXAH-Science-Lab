# A1 Null / P1–P3 Adversarial Review

## Verdict

**NULL / P1–P3 CONTRACT: FAIL.**

The conceptual separation is scientifically coherent:

- P1 consumes agreement statistics.
- P2 retains coefficient sign and clustered interval.
- P3 consumes held-out log-loss improvement, Brier, and predictive-gain null comparisons.
- N5 is validity-only.

The exact null data construction remains underdefined.

## Unresolved choices

### Population

“Applicable fixed primary agreement population” does not identify whether N1–N4 use:

- the original observed jointly supported population including zero carrier actions;
- a null-specific supported population;
- the intersection of original and null-supported rows;
- another V1 diagnostic population.

These choices alter mean agreement, coefficient fits, held-out loss, and Monte Carlo outcomes.

### Outcome and carrier handling

N2–N4 replace or mismatch LEARNED_FIELD rankings while V1 N2 explicitly says outcome rows remain fixed. A1 does not state whether carrier action/outcome labels remain fixed when the transformed ranking's top action differs.

N1 refits action semantics and recomputes rankings. A1 likewise does not specify whether carrier outcomes are:

- the original carrier-selected outcome rows with only coherence changed;
- reselected from already available shared-action outcomes using the null top action;
- otherwise reconstructed.

This is a scientifically meaningful definition of the null predictive target.

### Support handling

N1 can change learned-field predicted paths and hence path-support flags. A1 does not state whether the original support population is binding or changed support invalidates the repetition. “Missing statistic invalidates” does not answer row-level membership.

## Defined parts that pass

- N1–N4 each require 200 complete repetitions.
- Required outputs include mean coherence, top-action agreement, coefficient, and log-loss improvement.
- P1 requires both agreement statistics against all four families.
- P2 coefficient-null results are diagnostics only.
- P3 requires both carriers, positive log-loss gain, nonworse Brier, and log-loss gain above all four nulls.
- Brier is not incorrectly randomized as a null statistic.
- Missing/nonfinite required null statistics cause invalidity.

## Monte Carlo arithmetic

With `p=(1+k)/201` and `p<=0.025`:

| k | p | Pass |
|---:|---:|---|
| 3 | 0.0199004975 | yes |
| 4 | 0.0248756219 | yes |
| 5 | 0.0298507463 | no |

The maximum allowed exceedance count is exactly four. Prose, YAML, and arithmetic agree.

## Proposition fixtures

| Fixture | Contract-level consequence |
|---|---|
| P1 pass, P2 fail, P3 pass | proposition failure; no replication |
| P1 pass, P2 pass, P3 fail | proposition failure; no replication |
| One carrier passes P3, other fails | P3 false |
| All P1–P3 pass, N5-RUN fails | `INVALID EXPERIMENT` |
| Missing required null statistic | `INVALID EXPERIMENT` |

Because the null population/outcome rules are unresolved, these logical mappings are insufficient for acceptance.
