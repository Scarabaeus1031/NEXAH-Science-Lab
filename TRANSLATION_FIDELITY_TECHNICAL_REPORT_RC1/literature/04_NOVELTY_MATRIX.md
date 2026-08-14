# Strict Novelty Matrix

Exactly one primary classification is assigned per row. “Possibly” means a
candidate requiring a fuller systematic search and independent evaluation, not
an affirmative novelty finding.

| # | Claim or component | Classification | Basis |
|---:|---|---|---|
| 1 | Robustness can result from information loss | `KNOWN_STANDARD` | Constant-descriptor extreme and minimal/compressed representations: [Varma–Ray](https://doi.org/10.1109/ICCV.2007.4408875), [Achille–Soatto](https://jmlr.org/papers/v19/17-646.html) |
| 2 | Invariance does not imply informativeness | `KNOWN_STANDARD` | Excessive invariance and anti-collapse work: [Jacobsen et al.](https://openreview.net/forum?id=BkfbpsAcF7), [VICReg](https://openreview.net/forum?id=xm6YD62D1Ub) |
| 3 | Robust summaries can become saturated | `KNOWN_IN_OTHER_FORM` | Constant/collapsed representations are established; NEXAH “saturation” is local finite-panel terminology. [Varma–Ray](https://doi.org/10.1109/ICCV.2007.4408875) |
| 4 | Richer graph structure can improve discrimination | `KNOWN_STANDARD` | Graph expressivity hierarchies and higher-order methods: [Xu et al.](https://iclr.cc/virtual/2019/poster/791), [Morris et al.](https://doi.org/10.1609/aaai.v33i01.33014602) |
| 5 | Richer representations can lose robustness | `KNOWN_IN_OTHER_FORM` | Descriptor and invariant-representation literature establishes the tension, but not a universal direction. [R1](https://doi.org/10.1109/ICCV.2007.4408875), [R2](https://jmlr.org/papers/v23/21-1078.html) |
| 6 | Separate measurement of robustness and discrimination | `KNOWN_STANDARD` | Descriptor benchmarks and invariance/selectivity frameworks already separate the desiderata. [R6](https://doi.org/10.1093/imaiai/iaw009), [R7](https://doi.org/10.1109/TPAMI.2005.188), [R11](https://proceedings.neurips.cc/paper/2009/hash/428fca9bc1921c25c5121f9da7815cde-Abstract.html) |
| 7 | Explicit counterfactual discrimination tests | `KNOWN_BUT_DIFFERENT_OPERATIONALIZATION` | Task-relevant transformations and descriptor matching serve the same logic; NEXAH's paired structural counterfactual panel is a specific design. [R5](https://openreview.net/forum?id=BkfbpsAcF7), [R7](https://doi.org/10.1109/TPAMI.2005.188) |
| 8 | Collision counting as interpretation aid | `KNOWN_BUT_DIFFERENT_OPERATIONALIZATION` | Collision/non-injectivity analysis is standard; a transparent count ledger attached to `R/D` is a simple local implementation. [R10](https://iclr.cc/virtual/2019/poster/791), [R13](https://openreview.net/forum?id=xm6YD62D1Ub) |
| 9 | Pareto treatment of robustness versus discrimination | `KNOWN_STANDARD` | An explicit invariant-representation Pareto frontier already exists. [Zhao et al.](https://jmlr.org/papers/v23/21-1078.html) |
| 10 | Count-rank intermediate certificate | `NOT_ENOUGH_EVIDENCE` | Rank/ordinal summaries and transition aggregation have precedents, but this search did not locate the exact tie-aware rank of a transition-count matrix as a fidelity certificate. [Geiger–Temmel](https://doi.org/10.1109/ITW.2013.6691265) |
| 11 | State-sequence to transition-graph application | `KNOWN_BUT_DIFFERENT_OPERATIONALIZATION` | Markov aggregation and transition-network/coarse-graining traditions cover the substrate; the exact synthetic translation suite differs. [R8](https://doi.org/10.1109/ITW.2013.6691265), [R18](https://doi.org/10.1109/TAC.2014.2364971) |
| 12 | Combined preregistered experimental methodology | `POSSIBLY_NOVEL_COMBINATION` | No located source combines a frozen certificate ladder, admissible representation transforms, matched structural counterfactuals, separate `R/D`, and collision ledger. Each ingredient has prior art. [R1](https://doi.org/10.1109/ICCV.2007.4408875), [R8](https://doi.org/10.1109/ITW.2013.6691265), [R10](https://iclr.cc/virtual/2019/poster/791) |

## Verdict

`NO_DISTINCT_CONCEPTUAL_NOVELTY_FOUND`

The matrix supports, at most, novelty of operational combination and a narrow
synthetic result. It supports no new principle, theorem, or universal empirical
phenomenon.

