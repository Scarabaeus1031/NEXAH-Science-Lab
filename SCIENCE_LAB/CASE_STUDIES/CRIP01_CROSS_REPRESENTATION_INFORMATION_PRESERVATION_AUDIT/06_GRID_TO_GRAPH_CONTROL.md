# Grid-to-Graph Control

## Historical status

The exact T1/T2/T3, G1/G2/G3, Q1/Q2/Q3 historical source object was not recovered. Those tokens are therefore not asserted to be one original grid.

## Neutral audit construction

For a nine-cell label control only, define the array

`[[T1,T2,T3],[G1,G2,G3],[Q1,Q2,Q3]]`.

Define graph `H` with one node per cell and an edge exactly when two cells share a horizontal or vertical boundary. This is `AUDIT_RECONSTRUCTION_NOT_HISTORICAL_MAPPING`.

## Results

- cell/node identity: `PRESERVED` by the bijection;
- cardinality: `PRESERVED` (nine);
- declared four-neighbour adjacency: `PRESERVED`;
- row/column order: `LOST` if coordinates are not stored as attributes;
- Euclidean cell distance: `LOST` in a topology-only graph;
- color: `UNDEFINED` unless a legend types it; otherwise style only;
- graph layout: introduced view information, not graph structure.

The code-backed 20-wide historical grid confirms that an explicit indexing rule can make identity and coordinates reconstructable. It does not supply an attested historical graph transformation.

`GRID_DISTINCT_FROM_GRAPH=YES`

`GRAPH_DISTINCT_FROM_EMBEDDING=YES`
