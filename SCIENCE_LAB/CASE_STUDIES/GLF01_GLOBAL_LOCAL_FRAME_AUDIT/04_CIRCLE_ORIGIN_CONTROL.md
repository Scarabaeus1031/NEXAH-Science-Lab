# 04 — Circle / Origin Control

Let the abstract circle be `S^1`, or the embedded unit circle `{(x,y): x^2+y^2=1}` when an ambient Euclidean frame is explicitly part of the representation.

## No intrinsic start

Rotations act transitively on circle points: for any two points there is a rotation carrying one to the other. The bare circle therefore has no distinguished starting point. The embedded formula `(cos θ, sin θ)` appears to start at `(1,0)` only because an ambient coordinate frame and `θ=0` were chosen.

Choose:

```text
o in S^1                 # base point/origin
epsilon in {+1,-1}       # orientation
p(t)=rotation_o(2π epsilon t)
```

Then `t mod 1` is a cyclic coordinate. `t=0` names the chosen base point; it is not an intrinsic zero of `S^1`.

## What survives reparameterization

- the image circle and its topology;
- incidence of points on the circle;
- cyclic order under orientation-preserving reparameterization;
- orientation class only when orientation is retained;
- metric arc length only under metric-preserving changes, not arbitrary parameter changes.

```text
CIRCLE_HAS_INTRINSIC_START=NO
CHOSEN_ZERO_EQUALS_INTRINSIC_ZERO=NO
ORIENTATION_IS_AUTOMATIC_PROPERTY_OF_BARE_CIRCLE=NO
```

