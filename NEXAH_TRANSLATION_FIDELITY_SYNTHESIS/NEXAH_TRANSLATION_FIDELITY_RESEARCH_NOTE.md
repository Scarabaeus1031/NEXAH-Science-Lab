# Translation Fidelity: A Synthetic Study of Representation Robustness and Structural Discrimination

## Abstract

Representations that remain stable under coordinate, sampling or embedding
changes may achieve that stability by discarding distinctions needed to detect
structural change. We synthesize three preregistered synthetic studies of
state-sequence-to-transition-graph translation. A minimal v0.7 study first
identified stable binary support across five faithful transformations but
showed that support missed a controlled shortcut. A multi-family v0.7
replication found support robustness of 0.906 and counterfactual discrimination
of 0.344, while the weighted graph achieved 0.444 and 0.922. A third study used
an independent k-medoids decoder, explicit source-to-cluster correspondence and
a seven-level certificate ladder. It did not reproduce the exact v0.7
hierarchy: support became 0.780/0.767. It did reproduce a broader association
between retained detail, representation robustness and structural
discrimination. Count ranks occupied an empirical frontier position at
0.760/0.950. No HIGH/HIGH certificate was found. These results motivate a
narrow methodological hypothesis for external replication, not a universal
law, invariant, physical result or application claim.

## 1. Introduction

Cross-representation stability is easy to overinterpret. A graph summary can
remain unchanged because meaningful organization survives, because a decoder
is insensitive, or because the summary has removed the very distinction under
test. Translation fidelity therefore requires at least two measurements:
stability under admissible representation changes and sensitivity to matched
structural counterfactuals.

The research sequence began with a candidate invariance observation, subjected
it to broader replication and then replaced the original decoder with an
independent domain-neutral implementation. The scientific value lies in that
progression: the candidate narrowed as falsification improved.

## 2. Research Question

The operational question is:

> What is the least detailed representation that remains sufficiently stable
> under admissible representation changes while retaining sufficient ability
> to discriminate structural change?

This is a two-objective selection problem. It does not assume a trade-off and
does not define a universal optimum.

## 3. Definitions and Claim Boundaries

Representation robustness `R` is the fraction of frozen faithful
transformations preserving a certificate relative to baseline. Structural
discrimination `D` is the fraction of matched base/counterfactual comparisons
the certificate distinguishes. Retained detail `I` is represented by a frozen
operational ladder and discrete collision counts. `I` is not entropy or mutual
information.

Graph isomorphism under node relabeling and ordinary coordinate/phase
invariances are standard mathematical facts. Byte-identical replay is software
evidence. Cross-representation rates are empirical and conditional on the
decoder, fixtures, transformations and equivalence rules. No physical,
predictive or causal meaning is assigned.

## 4. Study Sequence

Study 1 used one synthetic three-state plateau trajectory and one canonical
v0.7 window/KMeans configuration. Binary support survived affine, nonlinear
injective, delay, small-noise and factor-two transformations. Transition
weights changed under nonlinear, delay and sampling changes. Crucially, a
genuine A→C shortcut changed weights but not support.

Study 2 expanded the same implementation family to eight structures, four
configurations, six faithful representations, three lossy controls, eight
counterfactuals and ten certificates. It replicated high support robustness
but showed low structural discrimination. The original shortcut weakness also
replicated. This converted the candidate from “stable structure” to “robust but
lossy support.”

Study 3 removed the key v0.7 assumptions. A standalone NumPy implementation
used deterministic k-medoids without windows, KMeans or canonical NEXAH. Ten
families had explicit latent states and sample-to-cluster-to-node
correspondence. Seven certificates ranged from components to full transition
probabilities. The exact v0.7 hierarchy failed, while the broader ordered
pattern survived.

## 5. Experimental Designs

The studies used controlled state sequences, faithful representation changes,
separate lossy controls and matched counterfactuals. Study 2 varied cluster
count and window size within v0.7. Study 3 fixed a known state count—an oracle
assumption—and varied affine/redundant, nonlinear-injective, delay, seeded-noise
and factor-two representations. Its lossy controls were an even projection,
factor-five sampling and sign thresholding.

All parameters and decision criteria were frozen before execution. Results and
errors were retained. The three runners reproduced byte-identical outputs.
Study 2's disclosed defective family convenience accumulator was not used;
valid aggregate summaries and raw records were retained without repair.

## 6. Representation and Certificate Ladder

Study 3 ordered certificates as components, binary support, exact counts,
count ranks, probability bins, two-decimal probabilities and twelve-decimal
probabilities. Components retain only connectivity-size summaries. Support
retains the existence of edges but not multiplicity. Counts retain
multiplicity but are sampling-sensitive. Ranks discard count scale while
preserving order. Bins and rounded probabilities retain increasing weight
detail.

The ladder is operational rather than information-theoretic. Its auxiliary
counts—unique certificate values, induced collisions and destroyed
counterfactual distinctions—make compression visible without assuming a
probability distribution over systems.

## 7. Results

In Study 2, support achieved `R=0.906`, `D=0.344`; SCC/WCC summaries achieved
`R=1.000`, `D=0`; and the weighted graph achieved `R=0.444`, `D=0.922`. No
certificate was HIGH/HIGH.

In Study 3, components achieved `0.990/0.017`, support `0.780/0.767`, exact
counts `0.570/1.000`, count ranks `0.760/0.950`, probability bins
`0.570/0.900`, and full probabilities `0.570/1.000`. Again no certificate was
HIGH/HIGH.

The frozen Study-3 Spearman associations were -0.808 for detail versus
robustness, +0.741 for detail versus discrimination and -0.838 for robustness
versus discrimination. These are descriptive values for seven certificates,
not universal constants.

## 8. Robustness–Discrimination Trade-off

The empirical frontier contained components, support, count ranks and the
R/D-equivalent exact-count/probability points. Probability bins were dominated.
Count ranks formed the clearest intermediate candidate: compared with support,
they traded 0.020 robustness for 0.183 discrimination; compared with full
probabilities, they gained 0.190 robustness for a 0.050 discrimination loss.

This is a Pareto observation, not a recommendation. Components remain formally
nondominated because of high R, but their two unique values over 20 Study-3
systems and failure on all ten R0 counterfactuals reveal saturation.

## 9. Replication and Non-Replication

The original support-stability observation replicated within v0.7 across new
families and configurations. The broader tendency for coarser summaries to be
more robust and less discriminative also appeared in the independent decoder.

The exact hierarchy did not replicate. Independent support was MEDIUM/MEDIUM,
not HIGH/LOW. Delay support preservation fell from 31/32 v0.7 comparisons to
0/20 in Study 3. Explicit correspondence showed mean delay mapping accuracy of
0.790, state collisions and edge recall of 0.608, distinguishing genuine
decoder failure from harmless label permutation.

## 10. Falsification Results

Coarse topology missed shortcuts, rare transitions and asymmetric transition
changes. Stable SCC/WCC/component summaries were saturated. Rich weights were
highly informative but sensitive to representation and sampling. Formally
lossy transformations did not always destroy fixture-level structure, while a
formally faithful delay embedding did. Transformation labels alone therefore
did not determine empirical fidelity.

These failures reject a decoder-independent support invariant and an automatic
robustness-equals-truth interpretation. They strengthen the methodological
case for reporting R, D and collisions separately.

## 11. Limitations

All structures were synthetic and internally designed. Only two implementation
families were tested. Study 3 used known state count, one prototype geometry,
one principal noise level and one delay depth. Exact equality makes weighted
certificates deliberately stringent. No literature review establishes novelty.
No external investigator, real domain or utility criterion has replicated the
pattern.

## 12. Interpretation

The narrow inference is that, across these preregistered synthetic studies,
certificate robustness often increased as structural distinctions were
removed, while richer certificates detected more counterfactuals but were less
stable. The independent failure of the exact hierarchy prevents attribution to
a universal support/weight law. The surviving object is a methodological
hypothesis about how translation fidelity should be evaluated.

## 13. Future External Replication

A stronger test requires independently written decoders and fixtures, multiple
known and unknown state-count assumptions, explicit correspondence, several
noise/delay/sampling regimes and frozen decision rules. It should preserve
negative results and explicitly allow a nontrivial HIGH/HIGH certificate to
falsify an unavoidable-trade-off interpretation. Internal certificate
optimization should stop pending that work and a literature review.

## 14. Conclusion

Study 1 supplied a candidate. Study 2 replicated its robustness and exposed
its information loss. Study 3 rejected the exact v0.7 hierarchy but reproduced
the broader relation between operational detail, robustness and structural
discrimination. Count ranks are an empirical frontier candidate, not a
solution. The evidence is sufficient for a narrow paper-level methodological
hypothesis ready for external replication, and insufficient for a mathematical,
physical, universal, predictive or domain claim.
