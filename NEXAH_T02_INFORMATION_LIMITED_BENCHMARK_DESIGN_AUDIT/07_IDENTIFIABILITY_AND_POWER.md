# Identifiability and Power

## Can methods differ?

Yes under finite resources. Whole-risk estimation may pool effectively but miss
rare collision subgroups; certificate pooling may detect them but overfit or
abstain excessively. B8 can beat NEXAH through calibrated shrinkage; NEXAH can
beat B8 through a correct structural inductive bias. Neither outcome is forced.

## Knowledge states

- Both correct: high-signal cases.
- NEXAH uniquely wrong: spurious certificate/collision evidence.
- Baseline uniquely wrong: pooled risk hides a rare task-relevant collision.
- Neither can know: insufficient sample or observational equivalence; both may
  return `UNKNOWN`.
- Scorer truth remains identifiable from sealed law/large independent evaluation.

## Pre-implementation power gate

A v3 design must analytically or by design-only bounds establish enough cases near
the adequacy boundary and enough rare-but-prevalent collision strata for methods'
decisions to be capable of differing—without simulating candidate methods or
selecting fixtures for a desired winner. Required before freeze:

1. frozen population of process families, not handpicked favorable cases;
2. minimum meaningful loss difference from the external cost contract;
3. sample-size calculation or exact finite benchmark precision target;
4. case-level independence and correct unit of resampling;
5. no test-set model/tolerance selection.

Infinite data collapses all consistent methods to B8's optimal decision. This is
acceptable because finite-resource decision quality is independently justified by
measurement and compute costs. Any claim must remain finite-budget-specific.

