# Final Decision

```yaml
case: POINT_SPLIT_RETURN_OPERATOR_GRAMMAR_LAB
date: 2026-08-23
primary_category: C_GENERIC_GEOMETRIC_MOTIF
positive_control_D: PASS
resolution_stability: PASS
similarity_stability: PASS
mirror_boundary: PASS
affine_reported_separately: YES
projective_reported_separately: YES
matched_random_fpr: 0.004
adversarial_posthoc_fpr: 0.291
selectivity_gate: FAIL
historical_phase4: NOT_EXECUTED
five_to_seven: DECLARED_BRANCH_ADDITION_ONLY
six_plus_one: NOT_RETURN
source_files_modified: NO
prior_cases_modified: NO
commit_created: NO
next_action: NONE
```

## Decision

The declared D object is a valid synthetic construction: it scores 1.0, survives 256/512/1024 px quantization, similarity, mirror, the declared affine/projective transforms, and the perturbed positive control. Mirror reverses signed orientation without removing the grammar. P shifts of 0.15 and 0.30 bounding-box diagonals correctly destroy the Return gate, demonstrating centre sensitivity.

This does not establish a selective operator grammar. Once the same post-hoc freedoms visible in exploratory diagrams are allowed — choosing a favorable cycle, P, S, R and subgraph after field generation — 291 of 1,000 random fields classify positive. That exceeds the frozen 5% limit by a factor of 5.82. The motif is mathematically describable but too common under flexible selection.

The primary category is therefore:

```text
C_GENERIC_GEOMETRIC_MOTIF
```

`B_ANNOTATION_DEPENDENT_GRAMMAR` is not selected because historical H1/H2 was prohibited before execution; annotation dependence was not measured. `D_COORDINATE_SPACE_ARTIFACT` is not selected because correct coordinate conversion preserves D and the decisive failure occurs in post-hoc graph selection. No historical-origin conclusion is made.

The RRTM V2-B, Spatial-Crown and Return-17 decisions remain unchanged.

```text
A REPEATED VISUAL MOTIF IS NOT YET A SELECTIVE OPERATOR.
THE TEST DISTINGUISHES GEOMETRIC GRAMMAR FROM MARKER- AND SELECTION-DEPENDENT CONSTRUCTION.
POINT, SPLIT, RETURN AND PLUS-ONE ARE REPORTED ONLY IN THEIR DECLARED MATHEMATICAL ROLES.
NO CROSS-DOMAIN CLAIM IS ADOPTED.
```

