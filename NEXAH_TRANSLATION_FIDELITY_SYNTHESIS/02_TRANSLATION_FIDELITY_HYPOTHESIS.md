# Translation Fidelity Hypothesis

## Operational research question

> What is the least detailed representation that remains sufficiently stable
> under admissible representation changes while retaining sufficient ability
> to discriminate matched structural change?

This is a two-objective empirical selection problem, not a request for a new
universal equation.

## Quantities

- **R — representation robustness:** fraction of preregistered faithful
  transformations for which a certificate equals its baseline under the
  study's frozen equivalence rule.
- **D — structural discrimination:** fraction of matched base/counterfactual
  comparisons for which the certificate differs as intended.
- **I — retained information/detail:** the certificate's declared operational
  position in a frozen ladder—components, support, counts, ranks, bins and
  probabilities—plus transparent collision/distinction counts.

`I` is not Shannon information, entropy, mutual information or a fundamental
scale. It is an ordered design variable specific to the tested certificates.
R and D are also conditional on the frozen transformation set, fixtures,
decoder and equality rule.

## Current methodological hypothesis

Within preregistered synthetic state-to-graph translation tasks, progressively
coarser certificates may gain representation robustness partly by discarding
distinctions needed to detect structural counterfactuals. Intermediate
certificates may occupy useful Pareto positions, but their location is
implementation- and transformation-dependent.

This hypothesis is falsifiable. It does not assert monotonicity in every case,
an unavoidable theorem, a physical mechanism or a universal law.

## Frozen Study-3 associations

| Association | Spearman value |
|---|---:|
| detail vs robustness | -0.8078131664 |
| detail vs discrimination | +0.7412493167 |
| robustness vs discrimination | -0.8383073406 |

These correlations describe seven frozen certificates on one synthetic
implementation. They are evidence for the candidate within that design, not
universal constants, causal estimates or literature-level novelty claims.
