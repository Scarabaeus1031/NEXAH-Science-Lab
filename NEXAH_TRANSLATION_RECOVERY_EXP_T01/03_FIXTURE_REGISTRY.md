# Fixture Registry

| ID | Type | Frozen source | Purpose |
|---|---|---|---|
| `F1_ORDERED_1D` | ordered numeric state | `[-2.0,-0.5,1.0,3.0]` | signed order, ranks, distances; includes negative values for sign-loss control |
| `F2_GEOMETRY_2D` | labeled points | `[(0.1,0.2),(1.2,0.1),(1.8,1.3),(0.2,1.7)]` | metric order, 1-nearest-neighbor adjacency, orientation, connectivity |
| `F3_GRAPH` | undirected labeled graph | nodes `0..4`; edges `01,12,23,34` | explicit relabeling and relation-deletion controls |

Matched counterfactuals used only for certificate collisions/discrimination:

- `F1_CF`: swap the middle two 1D values;
- `F2_CF`: reflect all y-coordinates (`y -> -y`), preserving distances while
  reversing orientation;
- `F3_CF`: replace edge `12` by `13`, preserving graph connectivity while
  changing adjacency.

Thus at least one coarse certificate is preregistered to collide despite a real
source change. All fixtures and counterfactuals are `ENCODED`, not observations.

