# Case B — Final Blind Reconstruction

## Evidence-first reconstruction

`BasinTransitionGraph.compute` consumes only the integer label raster. It scans down and right neighbors from origins excluding the last row and column, records unequal-label pairs as sorted tuples in a set, and returns a sorted unique list. Maxima, plotting, and NetworkX graph construction are outside this edge.

The result is an undirected, unweighted, simple label-pair set without isolated-node inventory. It is a region-adjacency extraction, not observed temporal dynamics. Geometry, membership, multiplicity, direction, weights, probabilities, and source-field information are lost. The loop bounds create potential missed last-row-right and last-column-down contacts. Historical input/output instances are unavailable.

## Comparison with V3

V3 gives the same atomic boundary, source and target contracts, deterministic contact criterion, structural losses, border-origin limitation, many-to-one classification, provenance limits, and rejection of dynamical-transition semantics.

`CASE_B_AGREEMENT = SUBSTANTIVE_AGREEMENT`
