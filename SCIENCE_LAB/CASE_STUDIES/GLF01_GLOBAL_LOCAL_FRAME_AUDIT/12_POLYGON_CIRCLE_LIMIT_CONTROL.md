# 12 — Polygon / Circle Limit Control

Fix the circumradius at `R=1` and inscribe `P_n` in the unit circle. This normalization is held fixed.

```text
side length s_n = 2 sin(π/n)
perimeter L_n = 2n sin(π/n) -> 2π
area A_n = (n/2) sin(2π/n) -> π
inradius r_n = cos(π/n) -> 1
radial/Hausdorff gap = 1-cos(π/n) -> 0
```

The limits follow from `sin x / x -> 1` and continuity of cosine. M6 records the same fixed-radius formulas and convergence of selected quantities.

For every finite `n`, `P_n` has finitely many straight edges and corners and is not the circle. The sequence converges to the circle in the stated metric/quantities; no finite polygon “becomes” a circle.

```text
FINITE_POLYGON_EQUALS_CIRCLE=NO
POLYGON_CIRCLE_LIMIT_STATUS=FIXED_CIRCUMRADIUS_CONVERGENCE_IN_HAUSDORFF_DISTANCE_PERIMETER_AND_AREA
```

