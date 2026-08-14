# Final Literature Gap & Prior-Art Audit

## Executive conclusion

The central NEXAH observation is not conceptually new. Coarse representations
can be robust precisely because they merge distinctions; richer representations
can retain more counterfactual information while becoming more sensitive to
representation, sampling or perturbation. This is established in substance by
invariance–selectivity theory, sufficient/minimal representations, information
bottleneck and rate–distortion, Markov aggregation, graph expressivity, TDA
stability limits, descriptor evaluation and abstraction/bisimulation.

The Study-3 `(R,D)` Pareto formulation has close established analogues. Varma
and Ray formulate discriminative power versus invariance
([DOI](https://doi.org/10.1109/ICCV.2007.4408875)); Anselmi et al. formalize
invariance with selectivity
([DOI](https://doi.org/10.1093/imaiai/iaw009)); Zhao et al. explicitly derive a
Pareto frontier for competing representation objectives
([JMLR](https://jmlr.org/papers/v23/21-1078.html)). NEXAH's exact finite R and D
estimators are an operational specialization, not a new Pareto principle.

The EXP-T01 chain

```text
X --T--> Y --T^-1/reconstructor--> X_hat
```

with reconstruction error is a standard inverse-problem/encoder–decoder form.
Existence, uniqueness and stability are classical inverse-problem questions;
autoencoders use reconstruction loss; sufficient representations and
rate–distortion make fidelity task-relative; equivariance/invariance constrain
transformation behavior; bisimulation supplies stronger behavioral equivalence.
Adding a ladder of structural checks is sound engineering, but no new recovery
mathematics was found.

## Three-level decision

### A — Established mathematics

- invariance, equivariance and selectivity;
- non-injectivity, data processing and task-relative sufficiency;
- rate–distortion and information bottleneck;
- graph-invariant collisions and expressivity bounds;
- stability without completeness in TDA;
- Markov lumping and information-preserving aggregation;
- inverse reconstruction and regularization;
- delay embedding under Takens' hypotheses;
- operator/observable representations;
- exact and approximate bisimulation;
- Pareto optimization of competing representation objectives.

### B — NEXAH-specific operational synthesis

The combined package of preregistered transformations, a finite certificate
ladder, separate recovery/structure/dynamics fields, matched counterfactuals,
explicit collision counts, non-scalarized R/D reporting, and fail-closed loss
statuses was not located verbatim. It is therefore **possibly distinct as an
engineering/evaluation synthesis**. This does not establish novelty, utility or
superiority.

### C — Potentially unresolved question

The plausible gap is whether this joint audit protocol improves out-of-sample
representation selection relative to established distortion, sufficiency,
expressivity and bisimulation baselines. Population calibration of finite
collision panels and links from certificate fidelity to downstream decisions
also remain open. These are methodological questions, not new laws.

## Relationship classifications by family

| Family | Classification | Consequence |
|---|---|---|
| invariance/equivariance | `KNOWN_SPECIAL_CASE` | no broad novelty |
| sufficiency/data processing | `KNOWN_SPECIAL_CASE` | coarse robustness is task-relative |
| information bottleneck/rate–distortion | `STRONGLY_RELATED` | compression trade-off established |
| coarse-graining/RG | `STRONGLY_RELATED` | macro usefulness need not imply micro recovery |
| Markov aggregation | `KNOWN_SPECIAL_CASE` | direct transition-state prior art |
| graph invariants/expressivity | `KNOWN_SPECIAL_CASE` | collision phenomenon established |
| TDA stability | `STRONGLY_RELATED` | stability is not completeness |
| Morse–Smale/basin summaries | `PARTIALLY_RELATED` | useful coarse basin descriptions precede NEXAH |
| Koopman/operator methods | `STRONGLY_RELATED` | independent representation family and baseline |
| Takens reconstruction | `CONTRADICTS_NEXAH_INTERPRETATION` | no unconditional decoded-fidelity inference |
| Kuramoto summaries | `PARTIALLY_RELATED` | scalar coherence is a known coarse observable |
| robustness/discriminability | `KNOWN_EQUIVALENT` conceptually | R/D idea established |
| lossy embeddings/autoencoders | `KNOWN_SPECIAL_CASE` | recovery chain established |
| bisimulation/abstraction | `STRONGLY_RELATED` | stronger behavioral baseline exists |

## Novelty and evidence judgment

1. **New mathematical principle:** not supported.
2. **New general empirical phenomenon:** not supported.
3. **Internal reproduction of known phenomenon:** yes, bounded and
   implementation-qualified.
4. **Distinct operational synthesis:** possible, because the exact joint audit
   bundle was not found; absence of a match is not proof.
5. **Genuine research gap:** possible only at the level of incremental
   diagnostic value, calibration and cross-family benchmarking.
6. **External replication:** still justified, but must test incremental utility
   against prior-art baselines rather than the already-known trade-off.

## Primary literature anchors

- Anselmi, Rosasco & Poggio, invariance/selectivity
  ([DOI](https://doi.org/10.1093/imaiai/iaw009)).
- Varma & Ray, discriminative-power/invariance trade-off
  ([DOI](https://doi.org/10.1109/ICCV.2007.4408875)).
- Zhao et al., representation Pareto frontier
  ([JMLR](https://jmlr.org/papers/v23/21-1078.html)).
- Tishby, Pereira & Bialek, Information Bottleneck
  ([arXiv](https://arxiv.org/abs/physics/0004057)).
- Shannon, rate–distortion/fidelity criterion
  ([publisher](https://ieeexplore.ieee.org/document/5311476)).
- Geiger & Temmel, Markov lumping and entropy-rate preservation
  ([DOI](https://doi.org/10.1239/jap/1421763331)).
- Cohen-Steiner, Edelsbrunner & Harer, persistence stability
  ([DOI](https://doi.org/10.1007/s00454-006-1276-5)).
- Williams, Kevrekidis & Rowley, EDMD/Koopman approximation
  ([DOI](https://doi.org/10.1007/S00332-015-9258-5)).
- Takens, delay embedding
  ([DOI](https://doi.org/10.1007/BFb0091924)).
- Girard & Pappas, approximate bisimulation
  ([DOI](https://doi.org/10.1016/j.automatica.2007.01.019)).
- Hinton & Salakhutdinov, autoencoder reconstruction
  ([DOI](https://doi.org/10.1126/science.1127647)).
- Xu et al., graph-representation discrimination
  ([ICLR](https://iclr.cc/virtual/2019/poster/791)).

## Review sources used for field mapping

- Kadanoff, real-space renormalization
  ([DOI](https://doi.org/10.1103/RevModPhys.86.647)).
- Rodrigues et al., Kuramoto networks
  ([DOI](https://doi.org/10.1016/j.physrep.2015.10.008)).
- Chazal & Michel, TDA overview
  ([Annual Reviews](https://doi.org/10.1146/annurev-statistics-031017-100045)).
- Brunton et al., modern Koopman theory
  ([DOI](https://doi.org/10.1137/21M1401243)).
- Bondy & Hemminger, graph reconstruction
  ([DOI](https://doi.org/10.1002/jgt.3190010306)).

## Required machine-readable conclusion

```text
LITERATURE_REVIEW_COMPLETED = YES
KNOWN_MATHEMATICS_OVERLAP = HIGH
NEXAH_OPERATIONAL_SYNTHESIS_DISTINCT = POSSIBLY
NEW_MATHEMATICAL_PRINCIPLE_SUPPORTED = NO
ROBUSTNESS_DISCRIMINATION_TRADEOFF_PRIOR_ART = ESTABLISHED
TRANSLATION_RECOVERY_PRIOR_ART = ESTABLISHED
GENUINE_RESEARCH_GAP_IDENTIFIED = POSSIBLY
EXTERNAL_REPLICATION_STILL_JUSTIFIED = YES
RECOMMENDED_NEXT_ACTION = REFRAME_EXTERNAL_PREREGISTRATION_TO_TEST_INCREMENTAL_DIAGNOSTIC_VALUE_AGAINST_INFORMATION_THEORETIC_MARKOV_BISIMULATION_AND_GRAPH_EXPRESSIVITY_BASELINES
```

No canonical NEXAH file was modified. No new experiment was run. Negative
results remain negative results.
