# Introduced Information

| Transition | Information appearing in target | Classification | Authority |
|---|---|---|---|
| T01 | sampled observation coordinates and deterministic phase-dependent jitter | E — genuinely computed quantity | frozen generator rule |
| T01 | prototypes, dwell, family walks | D — model assumption / analyst design | protocol |
| T03 | predecessor-coordinate columns | A — derived information | exact shift/stack operator |
| T03 | repeated `x_0` at the first predecessor position | C — analyst boundary convention | code |
| T04/T05 | centered, globally rescaled coordinates | A — derived information | normalization formula |
| T04/T05 | global-RMS geometry rather than per-feature scaling | C/D — analyst choice and model assumption | protocol/runner |
| T06/T07 | medoid choices, anonymous cluster IDs, assignments | A/E — computed quantities | deterministic k-medoids |
| T06/T07 | `k=4` | D — state-count oracle assumption | protocol |
| T06/T07 | cluster-to-source mapping and aligned semantic IDs | A plus C — derived correspondence under overlap-maximizing rule | alignment code using latent labels |
| T08/T09 | count matrices, support, components, ranks, bins and probabilities | A/E — mathematical derived quantities | certificate definitions |
| T08/T09 | “fidelity” metrics relative to oracle counts | A plus C — derived comparison under selected criteria | `fidelity` function |
| T10/T11 | rates, means, collision totals, Spearman coefficients | A/E — aggregate computed quantities | frozen analysis code |
| T12 | HIGH/MEDIUM/LOW classes and final disposition | C/D — analyst thresholds and interpretive rule | frozen protocol |

There is no visualization convention in this chain. No physical measurement, causal information, or external-domain meaning appears merely because the target contains more fields.

The most consequential introduction is the oracle alignment: semantic state names in the decoded graph do not emerge from unsupervised clustering alone. They are assigned afterward using known latent labels. Treating aligned node identity as preserved raw decoder output would be incorrect.

`INTRODUCED_INFORMATION_SEPARATED = YES`
