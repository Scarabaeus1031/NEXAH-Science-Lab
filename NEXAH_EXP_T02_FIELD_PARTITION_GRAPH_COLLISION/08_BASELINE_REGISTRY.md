# Baseline Registry

The NEXAH ledger competes against all baselines below; none may be omitted after
results are seen.

| ID | Computation | Question answered | Detection rule |
|---|---|---|---|
| B0 source norm | relative L2 and max absolute `Z-Z'` | did source numerical content change? | either exceeds `1e-12` |
| B1 derivative norm | combined relative L2 over five derivative rasters | did numerical differential content change? | exceeds `1e-10` |
| B2 critical records | exact count/class/coordinate comparison under frozen seed correspondence | did detected critical structure change? | canonical records unequal |
| B3 partition | aligned mismatch fraction and adjusted Rand index | did cell assignment geometry change, with and without labels? | mismatch `>0`; ARI `<1-1e-12` |
| B4 graph edit | edge symmetric-difference count and Jaccard | did binary support change? | symmetric difference `>0` |
| B5 isomorphism | exhaustive node-permutation adjacency equality for these 3–4-node graphs | did unlabeled topology change? | no isomorphism exists |
| B6 weighted graph | normalized L1 difference of boundary-contact vectors | did boundary-weighted structure change? | exceeds `1e-12` |
| B7 components | exact component partition after seed correspondence | did connectivity change? | canonical components unequal |

Stage-wise baseline localization is the first ordered representation at which its
registered change/preserve expectation is violated or a previously detected
distinction becomes invisible. This gives the conventional baseline set the same
opportunity to localize loss as the collision ledger.

No Markov, bisimulation or information-theoretic baseline is added: the pipeline
contains no transition probabilities or behavior relation, and adding terminology
without a matching object would not be mathematically justified.
