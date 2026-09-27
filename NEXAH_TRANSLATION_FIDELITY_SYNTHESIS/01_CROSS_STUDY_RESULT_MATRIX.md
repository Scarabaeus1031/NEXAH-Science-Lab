# Cross-Study Result Matrix

| Dimension | Study 1 | Study 2 | Study 3 |
|---|---|---|---|
| Implementation | canonical NEXAH v0.7 | canonical NEXAH v0.7 | independent NumPy runner |
| Families | 1 three-state fixture | 8 synthetic families | 10 synthetic families |
| Representations | baseline + 5 faithful + square loss + shortcut | baseline + 5 faithful + 3 lossy, 4 configs | baseline + 5 faithful + 3 lossy |
| Decoder | normalized windows + KMeans | same v0.7 pipeline/config grid | graph-blind deterministic k-medoids, known `k` |
| Correspondence | anonymous label-free graph | anonymous label-free graph | source sample → latent state → cluster → aligned node |
| Support robustness | 5/5 faithful comparisons, descriptive | 145/160 = **0.906 HIGH** | 78/100 = **0.780 MEDIUM** |
| Support discrimination | shortcut 0/1 at support level | 66/192 = **0.344 LOW** | 46/60 = **0.767 MEDIUM** |
| Weighted robustness | 2/5 faithful exact weighted matches, descriptive | 71/160 = **0.444 LOW** | full probabilities 57/100 = **0.570 MEDIUM** |
| Weighted discrimination | shortcut 1/1, descriptive | weighted graph 177/192 = **0.922 HIGH** | full probabilities 60/60 = **1.000 HIGH** |
| Intermediate certificates | coarse topology and probability multiset only | regime-shift count 0.875/0.557 | count ranks 0.760/0.950; bins 0.570/0.900 |
| Delay behavior | support preserved; weights changed | support 31/32; weights 6/32 | support 0/20; mean mapping accuracy 0.790 |
| Sampling behavior | factor two preserved support, changed weights | support 22/32; weights 0/32 | factor two preserved support 20/20 but not exact counts/weights |
| Lossy controls | square map broke support | square/factor-four/sign usually broke rich layers; coarse summaries saturated | even projection broke rich layers; factor-five/sign sometimes retained structure |
| Counterfactuals | one A→C shortcut | 8 matched families × representations/configs | 10 matched families × representations |
| Replay | byte-identical | byte-identical | byte-identical |
| Main falsification | support missed genuine shortcut | support missed 65.625%; no HIGH/HIGH | exact hierarchy failed; faithful delay was destructive |
| Scientific disposition | nontrivial candidate found | replicated robust but lossy | robustness–information trade-off candidate |

## What replicated

- Coarse summaries were generally more representation-stable and less able to
  distinguish matched structural changes.
- Rich transition information was generally more discriminative and more
  sensitive to translation/sampling.
- Stability alone did not establish fidelity.
- No certificate occupied the preregistered HIGH/HIGH region.
- Negative controls and matched counterfactuals were essential to interpretation.

## What did not replicate

The exact v0.7 hierarchy did not survive unchanged. Study 3 moved support from
HIGH/LOW to MEDIUM/MEDIUM and delay from strong support preservation to the
largest fidelity failure. Therefore the evidence is for a broader empirical
synthetic pattern, not for a decoder-independent support invariant.
