# Collision-Aware Evaluation of Representation Robustness and Counterfactual Discrimination in Synthetic Transition-Graph Pipelines

## Abstract

Three frozen synthetic studies evaluated which transition-graph certificates
survive changes of representation and which certificates distinguish matched
structural counterfactuals. The studies jointly report representation
robustness, discrimination, and collision behavior. Coarse certificates were
often robust because they discarded distinctions; richer certificates were
often more discriminative but less exactly preserved. This pattern is
consistent with established information-loss and robustness–discrimination
principles. The contribution of this candidate is a bounded operational and
reproducibility synthesis, including negative results, not a new mathematical
principle or algorithm.

## Research question

When a dynamical system is translated between representations, which structural
properties can remain operationally useful while information is lost, and how
should robustness be distinguished from fidelity and counterfactual
discrimination?

## Definitions

- **Representation robustness (R):** fraction of registered faithful
  representation comparisons for which a certificate equals its baseline.
- **Counterfactual discrimination (D):** fraction of registered matched
  structural counterfactual comparisons detected by a certificate.
- **Collision:** distinct registered systems or counterfactuals mapped to the
  same certificate value. A robust certificate may collide heavily and therefore
  carry little discriminative information.
- **Fidelity:** agreement with a registered source-to-recovered-state or graph
  correspondence. It is not synonymous with certificate robustness.

## Frozen evidence

Study 1 was an exploratory minimal translation study. Its support certificate
was preserved in 5/5 registered faithful comparisons, while the structural
shortcut was not detected at support level and was detected by weighted
comparison. These counts are descriptive and too small for general inference.

Study 2 preregistered eight graph families, four configurations, six faithful
representations, three lossy controls, and eight counterfactuals. Binary support
had R = 145/160 = 0.90625 and D = 66/192 = 0.34375. Exact weighted graph
comparison had R = 71/160 = 0.44375 and D = 177/192 = 0.921875. No certificate
met the registered joint high-robustness/high-sensitivity gate.

Study 3 used an independent NumPy-only pipeline with ten graph families, ten
matched counterfactuals, six faithful representations, three lossy controls,
and seven ordered certificates. C0 components yielded R = 0.990 and D = 0.0167
with 154 induced baseline collision pairs; C1 support yielded R = 0.780 and
D = 0.7667 with 15 collisions; C3 count ranks yielded R = 0.760 and D = 0.950
with 4 collisions; C6 full probabilities yielded R = 0.570 and D = 1.000 with
3 collisions. No certificate met the registered joint high/high gate.

## Cross-study interpretation

Across the registered synthetic systems, increasing certificate detail was
associated with lower exact robustness and higher discrimination in Study 3
(Spearman correlations −0.8078 and 0.7412 respectively). This is descriptive
within seven predeclared certificates, not a fitted law. Study 2 displayed the
same qualitative separation between support and weighted certificates. Study 1
provided only a small precursor observation.

The results do not identify an invariant that is simultaneously highly robust
and highly discriminative. Instead, they show why robustness must be reported
alongside retained information and counterfactual detection. The observed
trade-off is expected under established coarse-graining, sufficient-statistic,
rate–distortion, abstraction, and lossy-representation perspectives; it is not
claimed as a new principle.

## Figures and tables

- [Figure 1](figures/01_robustness_discrimination_pareto.png) plots Study-3 R
  against D and labels baseline collision counts. The connecting path is
  descriptive; no curve or law is fitted.
- [Figure 2](figures/02_certificate_summary.png) compares the seven registered
  Study-3 certificate rates and collision counts.
- [Figure 3](figures/03_study3_first_loss_schematic.png) is explicitly marked as
  a descriptive first-loss schematic based on the frozen Study-3 result.
- The five release tables are in [tables/](tables/); the compact study index is
  [STUDY_MATRIX.md](STUDY_MATRIX.md).

## Negative and implementation-dependent findings

- The registered certificate hierarchy was not strictly monotone.
- No registered certificate passed the joint high/high gate in Studies 2 or 3.
- Coarse connected-component and SCC/WCC summaries saturated and missed most or
  all registered counterfactuals.
- The Study-3 delay representation produced 20 dominant-state collision pairs,
  mean aligned-state accuracy 0.7896, and mean edge recall 0.6081.
- Two Study-3 lossy sign-threshold cells were not testable.
- Study 1 and Study 2 contain hard-coded historical dependency paths. A
  release-level path adapter now preserves runner immutability, but Study 2 does
  not reproduce its frozen result hash in the locked owner-gate runtime.

## Prior-art position

Robustness through discarded distinctions, information–discrimination tension,
reconstruction error, invariants, sufficient representations, graph
compression, and abstraction have strong prior art. The apparently distinct
element is the specific collision-aware operational bundle combining exact
representation preservation, matched-counterfactual discrimination, and
negative-result reporting across these synthetic pipelines. That formulation
has not been externally validated and supports, at most, a plausible
methodological/documentation contribution.

## Scope and conclusion

All evidence is synthetic and bounded to the frozen protocols. There is no
physical, predictive, stability, control, early-warning, universality, or
external-validity claim. The evidence supports publishing a transparent
reproducibility and negative-results technical report only after owner metadata,
license scope, and portable replay requirements are resolved.
