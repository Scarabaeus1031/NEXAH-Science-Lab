# Local Angle Definition

For incident edges `{v,a}` and `{v,b}` in an embedding `phi`, define nonzero vectors

```text
u = phi(a)-phi(v)
w = phi(b)-phi(v)
```

and the unsigned Euclidean angle

```text
theta_v(a,b) = arccos((u dot w)/(|u||w|)),  0 <= theta <= pi.
```

This is defined only when the incident edge vectors are nonzero. It depends on:

1. the selected incident edges;
2. their embedded coordinates;
3. the Euclidean inner product;
4. whether signed orientation is requested;
5. the observation accuracy if measured from an image.

The abstract graph supplies only incidence. It supplies neither `u dot w` nor a metric.

For signed angles, an oriented frame or orientation convention is additionally required. Reflection preserves unsigned angle magnitude but reverses orientation/chirality.

`EUCLIDEAN_ANGLE_GRAPH_INTRINSIC=NO`

`EUCLIDEAN_LENGTH_GRAPH_INTRINSIC=NO`

`FRAME_REQUIRED_FOR_DIRECTIONAL_INTERPRETATION=YES`

`ANGLE_EQUALS_RELATION=NO`
