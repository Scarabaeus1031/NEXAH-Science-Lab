# Formal Object and Type Ledger

## Minimum objects

| Object | Type | Meaning | Not equal to |
|---|---|---|---|
| `G=(V,E)` | finite abstract graph | vertices and adjacency relation | embedding, drawing, image |
| `lambda` | optional label map | names or marks assigned to graph objects | graph topology or geometry |
| `phi: V -> R^2` | embedding/drawing map | planar positions assigned to vertices | abstract graph |
| `p_v=phi(v)` | point | embedded location of vertex `v` | vertex identity |
| `d_(v,w)` | direction vector | `phi(w)-phi(v)` for adjacent vertices | edge itself |
| `theta_v(a,b)` | local unsigned Euclidean angle | angle between two incident directions at `v` | graph relation |
| `O` | observation map | projection, crop, rendering or measurement process | embedding or graph |
| `I=O(phi(G))` | observed representation | resulting image/data view | source graph |

## Dependency structure

```text
abstract graph G
      |
      | choose embedding phi and metric/frame
      v
embedded geometry phi(G)
      |
      | apply observation O
      v
observed representation I
```

Graph invariants belong to `G`. Euclidean lengths and angles belong to the embedded metric geometry. Pixel measurements belong to the observation and inherit its distortions and uncertainty.

`GRAPH_EQUALS_EMBEDDING=NO`

`EMBEDDING_EQUALS_OBSERVATION=NO`

`OBSERVATION_EQUALS_GRAPH=NO`
