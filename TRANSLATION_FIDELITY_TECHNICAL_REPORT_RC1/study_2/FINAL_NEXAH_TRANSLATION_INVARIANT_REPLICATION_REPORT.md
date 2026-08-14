# Final NEXAH Translation Invariant Replication Report

Disposition: `RESEARCH / NOT_ADOPTED`  
Scientific result: `CANDIDATE_REPLICATED_ROBUST_BUT_LOSSY`

## Executive conclusion

The prior coarse-support candidate replicates across eight new controlled
families and four preregistered v0.7 configurations as a **robust but lossy
translation property**. It is not both robust and discriminative. Coarse
support survives faithful representation changes in 90.625% of comparisons
but detects only 34.375% of matched structural counterfactuals. Weighted
transition structure reverses the tradeoff: approximately 44–47% robust and
90–92% sensitive.

## Required answers

1. **Base families:** 8.
2. **Faithful representations:** 6 including scalar baseline; 5 transformed.
3. **Lossy controls:** 3, analyzed separately.
4. **Structural counterfactuals:** 8 matched families.
5. **Configurations:** 4; every cell retained.
6. **Does support topology replicate?** Yes as HIGH robustness: 145/160.
7. **Under which representations?** Affine 100%, nonlinear 90.625%, delay
   96.875%, seeded noise 96.875%, factor-two sampling 68.75%.
8. **Under which configurations?** C0 95%, C1 100%, C2 82.5%, C3 85%.
9. **Where does it fail?** Most often under sampling loss, lossy maps, long
   windows/four clusters, and some nonlinear or near-degenerate cells.
10. **SCC/WCC replication:** 100%, but both detected 0/192 counterfactuals.
11. **Articulation replication:** 91.25%; structural detection only 28.646%.
12. **Distance replication:** 92.5%; detection only 32.292%.
13. **Weights:** no. Probability multiset 46.875% and weighted graph 44.375%
   robust; respectively 90.625% and 92.188% structurally sensitive.
14. **Most representation-robust:** SCC sizes, WCC sizes and self-loop count at
   100%, but they are saturated and uninformative here. Among richer
   certificates, distances/edge count are 92.5% and support 90.625%.
15. **Most structurally sensitive:** W2 weighted graph, 177/192 = 92.188%.
16. **Both robust and discriminative?** No frozen certificate is HIGH/HIGH.
17. **Coarse support misses:** 126/192 = 65.625%.
18. **Previous A→C failure:** yes. F1 support detected 6/24 only; C0–C2 missed
   every representation, while weights detected 24/24.
19. **Why is support robust?** Primarily aggressive information compression,
   with a narrower empirical preservation component. Many distinct sequences
   and representations collapse onto the same binary support.
20. **Configuration dependence:** exact behavior changes materially, especially
   weights. U1 range 0.175 is below the frozen 0.25 final-classification
   threshold, so coarse replication is not classified configuration-dependent.
21. **Source-to-cluster recovery:** not from existing public artifacts. Labels
   and centers are absent; canonical modification or independent reconstruction
   would be required. Semantic location remains `NOT_IDENTIFIABLE`.
22. **Adversarial failures:** yes—every candidate layer failed somewhere;
   lossy projection/coarsening and genuine shortcuts were decisive.
23. **Original candidate:** strengthened as a reproducible robustness property,
   weakened as a structural-preservation claim, and falsified as a jointly
   robust-and-discriminative invariant.
24. **Hierarchy evidence:** yes—robust coarse skeleton plus sensitive weights.
25. **Stable across families?** Qualitatively yes across all configurations and
   most families, but rates vary; directed reversal/bridge changes especially
   expose coarse blindness.
26. **Guaranteed versus observed:** label permutation/isomorphism and adjacency
   extraction are definitional; affine normalization is standard. Cross-map
   nonlinear/delay/noise/coarsening preservation and counterfactual response
   rates are empirical.
27. **v0.7-specific:** per-feature normalization, historical sliding windows,
   KMeans local fits, omission of labels/centers, empirical row-normalized
   transitions and all observed rates.
28. **Reproducible NEXAH property:** on these preregistered synthetic families,
   v0.7 frequently preserves a label-free coarse transition-support skeleton
   across faithful representations while its weighted layer preserves more
   structural distinctions but is representation-sensitive.
29. **Must not be claimed:** universality, mathematical/physical invariance,
   semantic regimes, causal structure, prediction, early warning, stability,
   risk, control, IEEE/PEGASE validity or usefulness.
30. **Next experiment:** independent domain-neutral implementation with frozen
   source-to-cluster correspondence and count-aware certificates, testing
   whether discrimination can improve without sacrificing representation
   robustness. Do not escalate automatically to IEEE.

## Reproducibility and limitation

All 576 cells completed, and a second full execution was byte-identical at
SHA-256 `589c2195…`. A nonprimary convenience family-label field in the runner
has a disclosed accumulator defect; aggregate certificate summaries and the
disposition derive from correct raw records and are unaffected. No post-result
repair or rerun was made.

```text
CANONICAL_OPERATORS_CHANGED = NO
APPLICATION_001_CHANGED = NO
LEVEL1C_CHANGED = NO
IEEE_PEGASE_EXECUTED = NO
POST_RESULT_RETUNING = NO
```

NEXAH_TRANSLATION_REPLICATION_ROBUST_BUT_LOSSY
