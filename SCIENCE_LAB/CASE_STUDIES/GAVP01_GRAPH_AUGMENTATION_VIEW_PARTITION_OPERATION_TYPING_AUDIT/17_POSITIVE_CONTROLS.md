# Positive Controls

## PC1 — Fixed graph, reflected embedding

Reflection gives the same `G` with different `E`; adjacency survives and coordinates/orientation change. Passed.

## PC2 — Addition of `H/PH`

The explicit subdivision model changes vertex/edge counts, degrees and cycle rank, producing `G+`. Passed.

## PC3 — Transform composition

Two reflections across intersecting axes compose to a rotation by twice the axis angle. Passed.

## PC4 — Multiple views

One `(G,E1)` source produces views with different crops, labels, frames and styles. Passed.

## PC5 — Geometry-dependent augmentation

The perpendicular foot requires coordinates, line incidence and Euclidean metric. Passed.

## PC6 — Combinatorial augmentation

Adding a vertex with declared adjacency can be specified on a graph without Euclidean geometry. Passed.

`POSITIVE_CONTROLS=6_OF_6_PASSED`
