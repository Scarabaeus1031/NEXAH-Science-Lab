# Wheel / Radial View Control

A geometric wheel can be modeled as a finite family of rays

```text
W={R_k=(a,v_k)}
```

sharing anchor `a`, optionally with angular coordinates or a cyclic order in a declared embedding.

The underlying star graph records adjacency from the central vertex to leaves. It does not by itself record angular order, equal radii, a shell, repeated directions or visual circularity. Those require embedding data and, for angular order, an orientation convention.

`WHEEL_EQUALS_GRAPH=NO`

`WHEEL_REQUIRES_EMBEDDING=YES_FOR_GEOMETRIC_WHEEL`

`RADIAL_ORDER_EQUALS_GRAPH_ORDER=NO_IN_GENERAL`

`RADIUS_EQUALS_RETURN=NO`

`RADIAL_EQUALS_ROTATIONAL=NO`

Shell crossings and radial magnitudes are representation properties unless separately bound to typed data. A wheel motif establishes no mechanical wheel, rotation, invariant or extra dimension.

`WHEEL_ROLE_STATUS=CONDITIONAL_GEOMETRIC_EMBEDDING_ROLE`
