# 06 — Local Tangent Control

Let `γ:I->R^m` be differentiable at `t0`, with regular point `γ'(t0) != 0`. Write `p=γ(t0)`.

```text
γ(t0+h) = p + h γ'(t0) + o(h)
```

The affine tangent line is `{p+sγ'(t0): s in R}`. This is the first-order local approximation supplied by differentiability (M3), not the curve itself.

## Destruction test

A unit circle and its tangent line agree to first order at the contact point but differ globally: one is compact and closed, the other unbounded. Many different curves can share the same point and tangent; for example `y=0`, `y=x^2`, and `y=x^3` have the same tangent at the origin but different global images and curvature behavior.

```text
CURVE_EQUALS_TANGENT=NO
LOCAL_LINEAR_APPROXIMATION_EQUALS_GLOBAL_OBJECT=NO
TANGENT_DIRECTION_DETERMINES_GLOBAL_CURVE=NO
LOCALLY_STRAIGHT_IMPLIES_GLOBALLY_STRAIGHT=NO
```

Curvature requires further differentiability/regularity. It is not contained in the tangent direction alone.

