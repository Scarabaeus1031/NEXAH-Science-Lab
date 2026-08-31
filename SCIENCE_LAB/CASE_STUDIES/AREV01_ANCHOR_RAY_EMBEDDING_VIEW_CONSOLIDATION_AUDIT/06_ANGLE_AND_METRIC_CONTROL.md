# Angle and Metric Control

For embedded nonzero directions `u` and `v` in an inner-product metric,

```text
theta(u,v)=arccos(<u,v>/(||u|| ||v||)).
```

This value requires:

- the two typed directions;
- an embedding or coordinate realization;
- a declared metric;
- a frame/orientation only when a signed angle or absolute bearing is requested.

It does not follow from vertex degree or edge incidence.

QAW-01 shows that a local image-plane angle can be measured with uncertainty, while cross-view invariance was not established. That measured image angle belongs to the view and cannot silently replace the source-space angle.

`V_PLUS_METRIC_EMBEDDING_DEFINES_ANGLE=YES`

`GRAPH_DEGREE_EQUALS_VISIBLE_OPENING_ANGLE=NO`

`ANGLE_EQUALS_RELATION=NO`

`ANGLE_IS_METRIC_RELATION_BETWEEN_EMBEDDED_DIRECTIONS=YES`

`VISIBLE_ANGLE_GRAPH_INTRINSIC=NO`

`ANGLE_REQUIRES_EMBEDDING_AND_METRIC=YES`

`Q_DEGREE_EQUALS_ANGLE=NO_UNLESS_INDEPENDENTLY_REGISTERED`
