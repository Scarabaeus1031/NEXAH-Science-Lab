# Graph Augmentation Control

From embedded triangle `(G,E1)`, drop the Euclidean perpendicular from `P` to line `AB`. Let its foot be `H=(0,0)`.

Use the explicit subdivision representation:

```text
G+:
V+={A,H,B,P}
E+={AP,PB,AH,HB,PH}.
```

Added or changed:

- new vertex `H`;
- new edge `PH`;
- original edge `AB` subdivided into `AH` and `HB`;
- new incidence at `H` and `P`;
- registered perpendicular relation `PH perpendicular AB`;
- vertex count `3 -> 4`;
- edge count `3 -> 5`;
- degrees `(2,2,2) -> (2,3,2,3)` for `A,H,B,P`;
- cycle rank `1 -> 2`.

`G+` is not equal or isomorphic to `G`: their vertex and edge counts and degree multisets differ.

The altitude is geometry-dependent because locating `H` requires the embedding, Euclidean metric and line `AB`. By contrast, a rule such as “add new vertex `X` adjacent to `A` and `B`” is a combinatorial augmentation that requires no metric.

`AUGMENTATION_CHANGES_REGISTERED_STRUCTURE=YES`

`GEOMETRY_DEPENDENT_AUGMENTATION_IDENTIFIED=YES_PERPENDICULAR_FOOT_CONSTRUCTION`

`COMBINATORIAL_AUGMENTATION_IDENTIFIED=YES_ADD_VERTEX_WITH_DECLARED_ADJACENCY`
