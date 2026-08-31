# Anchor / Ray / Edge Ledger

## Anchor

An anchor is a declared identity with a reference role. It may receive coordinates through an embedding. Only a separate declaration may set those coordinates to the frame origin.

`ANCHOR_EQUALS_ORIGIN=NO_IN_GENERAL`

`ANCHOR_MAY_BE_COORDINATE_ORIGIN=YES_IF_DECLARED`

## Ray

For anchor `a` and nonzero vector `v`, a geometric ray may be represented by

```text
R(a,v)={a+t v | t>=0}.
```

The direction is a component of the ray description, not the ray itself. Coordinate components of `v` require a frame.

`RAY_EQUALS_DIRECTION=NO`

`RAY_CONTAINS_DIRECTION=YES`

## Edge

An abstract edge connects two vertex identities. An embedded segment additionally depends on endpoint coordinates. Unlike a ray, it has two declared finite endpoints and need not carry orientation.

`RAY_EQUALS_EDGE=NO`

`AXIS_EQUALS_RAY=NO`

`SIGN_EQUALS_DIRECTION=NO`

Identity is based on declared IDs and endpoints, not visual coincidence.
