# 09 — Polygon Family Control

For exactly `n=3,...,10`, let `P_n` be a regular convex `n`-gon. Standard formulas are:

```text
vertices = edges = n
interior angle = (n-2)180°/n
exterior angle = central angle = 360°/n
rotational symmetry order = n
reflection symmetry count = n
full symmetry group = dihedral group with 2n elements
```

M5 supplies the dihedral symmetry structure; M6 supplies the regular-polygon formulas.

## Complexity control

“Complexity” is ambiguous without a metric:

| Candidate meaning | Behavior as `n` increases | Status |
|---|---|---|
| number of vertices/edges | increases exactly with `n` | defined |
| symmetry-group order | increases as `2n` | defined but not generic complexity |
| number of free shape parameters | zero within the fixed-radius regular family apart from rigid placement/scale choices | does not increase as assumed |
| description length | formula-dependent; `P_n` can be specified compactly by `n` and normalization | no monotone result established |
| approximation to fixed circle | improves in stated convergence metrics | defined under chosen normalization |

`POLYGON_COMPLEXITY_STATUS=AMBIGUOUS`. More vertices is one count, not “more complex in every sense.”

