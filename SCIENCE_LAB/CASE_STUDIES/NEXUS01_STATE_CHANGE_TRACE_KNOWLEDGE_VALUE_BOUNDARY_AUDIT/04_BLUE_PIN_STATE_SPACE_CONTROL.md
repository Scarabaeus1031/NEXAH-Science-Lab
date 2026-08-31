# Blue-Pin State-Space Control

Let a registered system state at `t0` contain:

```text
x(t0) = (c(t0), dc(t0)) = (2.0, -0.5)
```

Declare a representation map `R` from the registered state to a two-dimensional
state-space coordinate. A render rule maps that coordinate to a visible point
`P0` in a view.

```text
physical/system state X
  -> R(X) = state-space coordinate
  -> VIEW(R(X)) = rendered point/pin
```

Therefore:

```text
X ≠ R(X) ≠ VIEW(R(X))
SYSTEM = P0                    REJECTED
STATE = P0                     REJECTED in general
STATE_REPRESENTATION = P0      POSSIBLE only under declared map/frame/rendering
P0 = TRAJECTORY                REJECTED
P0 = HISTORY                   REJECTED
```

A coordinate tuple is also not complete point identity. A registered point needs
its own ID or scoped identity plus state, time, representation, frame and
provenance. Equal coordinates under different provenance records remain distinct
records.

`STATE_SPACE_POINT_STATUS=DERIVED_RECORD_SUFFICIENT`
