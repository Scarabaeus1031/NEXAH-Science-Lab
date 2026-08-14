# Case B Reconstruction

## Independent record

`BasinTransitionGraph.compute` consumes only the integer raster, not maxima. It compares down/right neighbors from origins with both indices below the last row/column, inserts sorted differing-label pairs into a set, and returns a sorted unique edge-pair list. Plotting and NetworkX node construction are separate.

The target is an undirected, unweighted, simple label-pair set without isolated-node inventory—not a complete graph object and not observed dynamics. Returned pairs pass an exact deterministic scan criterion. Raster geometry, membership, direction, multiplicity, boundary length, weights, probabilities, and source field values are absent. Omitted border-origin comparisons create established potential missed contacts. Historical raster/edge artifacts are unavailable.

## Comparison

V2 independently selects the same compute-only boundary, representation qualifiers, preservation/loss criteria, provenance limitation, and rejection of dynamical-transition semantics.

`CASE_B_AGREEMENT = SUBSTANTIVE_AGREEMENT`

