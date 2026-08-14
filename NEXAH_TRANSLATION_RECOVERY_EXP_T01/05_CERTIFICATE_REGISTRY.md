# Certificate Registry

All comparisons are exact on canonical JSON payloads except numeric recovery.

| ID | Definition / applicability | Expected preservation | Information discarded | PASS does not mean |
|---|---|---|---|---|
| `C0_STATE` | full ordered coordinates or exact labeled edge set; all fixtures | only after successful inverse; forward equality generally false | none within encoding | physical identity or external fidelity |
| `C1_DISTANCE_ORDER` | tie-aware rank ordering of all labeled pairwise Euclidean distances; F1/F2 | translation, positive scale and orthogonal maps | absolute position, orientation, common scale, sometimes shape handedness | injectivity; F2 reflection counterfactual is a planned collision |
| `C2_ADJACENCY` | mutual 1-nearest-neighbor edges for F1/F2; exact edges for F3 | similarity/isometry; graph relabel after explicit correspondence | distances, weights, non-neighbor geometry | full structural fidelity |
| `C3_ORIENTATION` | signs of all increasing-index 1D differences (F1) or signed area of first non-collinear labeled triple (F2) | positive affine/isometric orientation-preserving maps | magnitudes and most geometry | recoverability or topology |
| `C4_RANK_ORDER` | tie-aware coordinate ranks (F1) or degree ranks (F3) | positive affine maps / explicit graph relabeling | magnitudes and many relations | unique state identification |
| `C5_CONNECTIVITY` | connected-component partition; F3 and C2-derived F1/F2 graph | any map preserving registered adjacency | almost all within-component structure | adjacency or metric fidelity |

Collision count is the number of unordered distinct source/counterfactual pairs
with equal certificate payloads. Certificate applicability is fixed by fixture;
inapplicable values are absent, never treated as equal.

