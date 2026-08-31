# Graph Invariant Ledger

For a fixed abstract graph `G=(V,E)` and any drawing that faithfully carries the same `V` and `E`:

| Quantity | Graph intrinsic? | Preserved under re-embedding? | Note |
|---|---:|---:|---|
| vertex count | yes | yes | if no vertices are added/removed |
| edge count | yes | yes | if no edges are added/removed |
| adjacency | yes | yes | defining graph relation |
| node valence/degree | yes | yes | follows from adjacency |
| walk/path existence | yes | yes | graph-theoretic |
| graph distance | yes | yes | edge-count metric, not Euclidean distance |
| connected components | yes | yes | graph-theoretic |
| cycle structure | yes | yes | graph-theoretic |
| planarity | yes | yes | existence of a crossing-free embedding; not the appearance of one drawing |
| visible crossing count | no | no | drawing dependent |
| Euclidean edge length | no | no | embedding and metric dependent |
| local Euclidean angle | no | no | embedding and metric dependent |
| absolute direction | no | no | frame dependent |
| visual symmetry | no | no | embedding/observation dependent |

`ADJACENCY_EMBEDDING_INVARIANT=YES_FOR_FIXED_ABSTRACT_GRAPH`

`NODE_VALENCE_EMBEDDING_INVARIANT=YES_FOR_FIXED_ABSTRACT_GRAPH`

`PATH_STRUCTURE_EMBEDDING_INVARIANT=YES_FOR_FIXED_ABSTRACT_GRAPH`

`CYCLE_STRUCTURE_EMBEDDING_INVARIANT=YES_FOR_FIXED_ABSTRACT_GRAPH`
