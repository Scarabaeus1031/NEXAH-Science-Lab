# Graph-to-Polar Control

## Historical mapping gate

No source-backed mapping was recovered between the named D-node candidate and the selected polar/radial images. Node names and a polar-looking layout do not establish shared object identity.

`HISTORICAL_GRAPH_TO_POLAR_TRANSFORMATION=UNDERDEFINED`

## Audit reconstruction

Using the nine-node control graph from `06_GRID_TO_GRAPH_CONTROL.md`, retain a declared row-major node order `j=0..8` and render

`θ_j = 2πj/9`, `r_j = 1`.

This is `AUDIT_RECONSTRUCTION_NOT_HISTORICAL_MAPPING`.

| relation | result |
|---|---|
| node identity | `PRESERVED` if IDs retained |
| declared row-major cyclic order | `TRANSFORMED_BY_DECLARED_RULE` |
| graph adjacency | not encoded by polar proximity; `LOST` unless edges drawn |
| graph degree | `LOST` unless retained as attribute |
| radius/magnitude | `UNDEFINED`; radius was fixed styling |
| displayed distance | `INFORMATION_INTRODUCED_BY_VIEW` |
| orientation | depends on zero-angle and clockwise convention |

`POLAR_POSITION_DISTINCT_FROM_STRUCTURAL_RELATION=YES`
