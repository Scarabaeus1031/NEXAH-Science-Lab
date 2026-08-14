# Case B — Partition to Adjacency Edge Set

This edge has stronger direct implementation evidence than the maxima→partition interpretation.

## Evidence-derived reconstruction

`BasinTransitionGraph.compute` reads only `basin_map`. It loops over origins `i < ny-1`, `j < nx-1`, compares down and right neighbors, and returns sorted distinct pairs of differing integer labels. It does not use `maxima`. `plot` is a separate operator that uses maxima count and coordinates to construct/display a NetworkX graph.

The narrow computational edge is therefore:

`integer label raster → sorted undirected unique label-pair list`.

It is not yet `PARTITION → GRAPH` unless the graph-construction convention and isolated nodes are included. The compute output cannot represent isolated regions. The loop bounds omit right-neighbor contacts originating in the last row and down-neighbor contacts originating in the last column.

## Review classifications

- Operator: `OPERATOR_BOUNDARY_AMBIGUOUS` in the old record; compute and plot were blended under “graph.”
- Representation identity: target `GRAPH` is too broad; edge list/simple-undirected/unweighted/no-isolates must be contracted.
- Preservation: detected label contacts under the exact implemented scan are `OBJECTIVE`; complete four-neighbor region adjacency is `UNSUPPORTED`.
- Loss: raster geometry, memberships, boundary multiplicity/length, direction, and weights are structurally absent. Task loss is undefined.
- Invertibility: `MANY_TO_ONE` is objective for the declared edge-set output, although a concrete collision witness was not stored.
- Provenance: `COMPLETE_FOR_CLAIM` for source/callable at canonical commit; historical input/output instance remains unavailable.
- Existing-record agreement: `INTERPRETIVE_DIFFERENCE`. The previous record correctly found compression and border risk but incorrectly treated maxima count as a compute input and called the edge-set output a graph without isolating plotting.

