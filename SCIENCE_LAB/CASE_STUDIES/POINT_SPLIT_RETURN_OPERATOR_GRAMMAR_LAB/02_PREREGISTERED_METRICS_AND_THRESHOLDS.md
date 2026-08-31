# Preregistered Metrics and Thresholds

Frozen before execution on 2026-08-23.

## Grammar Score

Five binary components, each weight `0.2`:

1. `split`: P–S stem exists; S has 2–7 non-stem branches.
2. `separation`: minimum branch-angle separation is at least `π/6`.
3. `closure`: at least one simple cycle contains S; `|area|/bbox_area >= 0.08`; normalized closure gap `<=0.03`.
4. `winding`: P lies inside the selected cycle (`|winding|=1`).
5. `return`: R is distinct from P, is connected to a selected-cycle node, and `distance(R,P)/bbox_diagonal <=0.08`.

`GS` is their arithmetic mean. Positive classification requires:

```text
GS >= 0.80
split = 1
closure = 1
return = 1
```

Thus an added branch, a generic cycle, or a near point alone is insufficient.

## Gates

- G1: D must classify positive and exceed A, B and C by at least `0.40` GS.
- G2: D classification must agree at 256, 512 and 1024 px.
- G3: similarity transforms must preserve classification and GS within `1e-12`.
- G4: mirror must preserve classification; oriented area/winding sign must reverse.
- G5: affine and projective outcomes are reported separately; no invariance is presumed.
- G6: each frozen-role random control I and adversarial post-hoc control J must have FPR `<=0.05` over 1,000 trials.
- G7: if J FPR exceeds 0.05, the grammar is non-selective and historical Phase 4 is prohibited.
- G8: 5→7 transition passes only if branch IDs `new_1,new_2` are added by the predeclared operator to the five-branch input.
- G9: six-plus-one is not return unless its seventh branch separately satisfies the return component. Branch count alone cannot do so.
- G10: P information is reported only as coordinate/node/pivot/stem relation.

## Random families

Seed `570710`. Arm I uses 1,000 six-node/six-edge graphs with fixed P/S/R roles, exact P–S stem, exactly two initial non-stem S branches, normalized bounding box equal to D and total edge length accepted within ±15% of D. Arm J uses 1,000 twelve-node/eighteen-edge random fields and searches all simple cycles of length 3–6 plus all admissible P/S/R role assignments. Similarity freedoms add no geometric information; subset/role selection is explicitly allowed and recorded.

## Robustness

K adds node noise with `σ=0.005*bbox_diagonal`, one closure gap of `0.01*bbox_diagonal`, and rasterization. The gap is below the preregistered 0.03 tolerance. Random, raster, and perturbation seeds are deterministic.

No threshold or weight may be changed after seeing synthetic or historical outcomes.

