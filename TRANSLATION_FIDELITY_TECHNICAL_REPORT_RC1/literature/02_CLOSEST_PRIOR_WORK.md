# Top 10 Closest Prior Works

Ranking reflects conceptual proximity to the surviving claim, not citation
importance. Source metadata and search coverage are in
`REFERENCES_AND_SEARCH_REGISTER.md`.

## 1. Varma and Ray (2007): discriminative power–invariance trade-off

- **Claim/setting:** visual descriptors trade invariance against discriminative
  power; a constant descriptor is the fully invariant, non-discriminative
  extreme; task-specific combinations can be learned.
- **Overlap:** almost exactly the motivating `R` versus `D` logic, including
  apparent robustness obtained by throwing distinctions away.
- **Difference:** learned image descriptors and recognition, not frozen graph
  certificates or matched state-sequence counterfactuals.
- **Effect on novelty:** makes the broad observation expected and contains the
  two desiderata in substance. [Source](https://doi.org/10.1109/ICCV.2007.4408875)

## 2. Zhao et al. (2022): limits and Pareto trade-offs in invariant learning

- **Claim/setting:** an information-theoretic feasible region describes target
  information/accuracy versus invariance, with a Pareto frontier.
- **Overlap:** direct formal precedent for treating invariance and retained
  discriminative information as separate competing axes.
- **Difference:** population representation-learning theory rather than the
  NEXAH finite empirical metrics and graph translation.
- **Effect on novelty:** makes both the broad trade-off and Pareto framing
  non-novel in principle. [Source](https://jmlr.org/papers/v23/21-1078.html)

## 3. Achille and Soatto (2018): minimality, sufficiency, invariance

- **Claim/setting:** for sufficient learned representations, information
  minimality is tied to invariance to nuisance factors.
- **Overlap:** explains increased invariance through removal of input
  information while requiring task-relevant sufficiency.
- **Difference:** supervised probabilistic representations, not explicit graph
  certificate collisions or counterfactual panels.
- **Effect on novelty:** makes the information-loss mechanism standard, while
  not duplicating the exact operational protocol. [Source](https://jmlr.org/papers/v19/17-646.html)

## 4. Anselmi, Rosasco, and Poggio (2016): invariance and selectivity

- **Claim/setting:** a representation should be invariant on intended
  transformation orbits and selective outside them.
- **Overlap:** “stable for admissible change, different for meaningful change”
  is the same requirement in formal vocabulary.
- **Difference:** transformation-group theory and learned representations, not
  transition-graph extraction.
- **Effect on novelty:** contains `R` versus `D` in substance and strongly
  limits conceptual novelty. [Source](https://doi.org/10.1093/imaiai/iaw009)

## 5. Jacobsen et al. (2019): excessive invariance

- **Claim/setting:** classifiers can be invariant to task-relevant changes;
  excessive invariance is distinct from excessive sensitivity.
- **Overlap:** warns that robustness/equality of representations does not imply
  fidelity and can conceal meaningful differences.
- **Difference:** adversarial image classification, not graph summaries.
- **Effect on novelty:** makes the collision interpretation expected, though it
  does not supply the NEXAH counts. [Source](https://openreview.net/forum?id=BkfbpsAcF7)

## 6. Tishby, Pereira, and Bialek (1999): information bottleneck

- **Claim/setting:** compress observations while retaining information relevant
  to a declared target.
- **Overlap:** formalizes the core compression-versus-retained-information
  problem behind coarse and rich certificates.
- **Difference:** mutual-information objective, not empirical `R/D` scores.
- **Effect on novelty:** makes the causal explanation unsurprising but does not
  prescribe the dual-axis graph audit. [Source](https://arxiv.org/abs/physics/0004057)

## 7. Mikolajczyk and Schmid (2005): robust and distinctive descriptors

- **Claim/setting:** local image descriptors are evaluated for robustness under
  transformations and distinctiveness/matching performance.
- **Overlap:** longstanding empirical practice of measuring both stability and
  discriminability.
- **Difference:** benchmark matching criteria rather than controlled graph
  counterfactuals and explicit collisions.
- **Effect on novelty:** dual evaluation is standard in substance.
  [Source](https://doi.org/10.1109/TPAMI.2005.188)

## 8. Geiger and Temmel (2013), with Geiger et al. (2015): Markov aggregation

- **Claim/setting:** studies non-injective state aggregation and when a reduced
  Markov representation preserves information; later work optimizes KL-rate
  fidelity using information bottleneck methods.
- **Overlap:** closest substrate precedent for compressing state-transition
  dynamics and auditing information retained by aggregation.
- **Difference:** entropy/KL criteria and stochastic processes, not the exact
  finite certificate ladder or `R/D` thresholding.
- **Effect on novelty:** makes coarse-graining loss expected; exact protocol
  remains different. [2013](https://doi.org/10.1109/ITW.2013.6691265),
  [2015](https://doi.org/10.1109/TAC.2014.2364971)

## 9. Bruna and Mallat (2013): invariant scattering

- **Claim/setting:** scattering representations can obtain invariance and
  deformation stability while retaining discriminative high-frequency content.
- **Overlap:** explicitly treats both stability and retained discrimination.
- **Difference:** constructive signal transform with mathematical guarantees,
  not a diagnostic for arbitrary translation pipelines.
- **Effect on novelty:** shows the trade-off is not an unavoidable universal law;
  good constructions can combine both properties. [Source](https://doi.org/10.1109/TPAMI.2012.230)

## 10. Xu et al. (2019): graph-representation expressivity

- **Claim/setting:** message-passing GNNs have Weisfeiler–Lehman-bounded ability
  to distinguish graph structures, producing representational collisions.
- **Overlap:** graph summaries must be evaluated by which non-equivalent graphs
  they fail to separate.
- **Difference:** learned GNN expressivity and graph isomorphism, not translated
  transition networks or robustness under decoder variation.
- **Effect on novelty:** collision/expressivity analysis is established, while
  the particular count-rank certificate is not addressed.
  [Source](https://iclr.cc/virtual/2019/poster/791)

## Near matches outside the ten

Goodfellow et al. empirically measure invariance and mention its tension with
selectivity; Wang and Isola separate alignment from uniformity; VICReg couples
invariance with anti-collapse constraints. These reinforce the conclusion but
are less close to the full graph-translation protocol.

