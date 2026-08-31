# 07 — Zoom and Nonsmooth Counterexample

## Precise “looks straight” statement

At a differentiable regular point, translate to `p=γ(t0)`, rescale by `1/h`, and compare:

```text
[γ(t0+hu)-γ(t0)] / h -> u γ'(t0)  as h -> 0
```

for fixed bounded `u`. The rescaled curve converges pointwise (and under stronger hypotheses uniformly on bounded parameter sets) to its tangent map. This is the mathematical content of local first-order straightness.

## Prerequisites

- differentiability supplies a linear first-order term;
- `γ'(t0) != 0` makes the parameterized point regular and gives a nonzero tangent direction;
- smoothness beyond first derivative is not required for linearization but is needed for standard curvature/Frenet data.

## Bounded counterexamples

1. `y=|x|` at `x=0` has unequal left/right derivatives, hence no unique tangent-line linearization. Zooming preserves the corner.
2. `γ(t)=(t^2,t^3)` has `γ'(0)=0`, so the parameterization is not regular at the cusp. A limiting geometric tangent may still be discussed, but the regular-curve formula cannot be applied there.

```text
LOCAL_LINEARIZATION_SUPPORTED=YES
NONSMOOTH_COUNTEREXAMPLE_COMPLETE=YES
VISUAL_ZOOM_ALONE_IS_PROOF=NO
```

