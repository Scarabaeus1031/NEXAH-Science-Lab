# Legacy Chain Ledger Entries

All code locators resolve in canonical NEXAH at commit `724814ea40351141350a1822d7c559a308ac0cfa`. The archived PNG provenance is partial and the generator was unseeded; these are operator-level records, not claims of byte-reproducing historical images.

## LGC-01: field → critical candidates

- Source: `FIELD/scalar_grid`, concrete `X,Y,Z` instance `PROVENANCE_UNKNOWN`.
- Operator: deterministic `StabilityCriticalPoints.compute`, threshold `0.02`; recomputes `np.gradient`, skips boundary cells, uses Hessian determinant and `Zxx` sign.
- Target: `FEATURE_SET/critical_candidate_coordinates_by_class`.
- Preserved: emitted candidates retain `X,Y` coordinates and class exactly for a fixed in-memory input/execution.
- Loss: all nonselected cells, derivative magnitude, confidence, and continuous critical-set information; fixed spacing and threshold can miss/reclassify candidates.
- Uncertainty: discretization/classification `NOT_QUANTIFIED`.
- Invertibility: `MANY_TO_ONE`.
- Evidence: canonical code lines 23–61 plus legacy audit.
- Status: `PARTIALLY_VERIFIED` because code is verified but historical input/output provenance and convergence are not.

## LGC-02: maxima plus grid context → partition

- Source: `FEATURE_SET/maxima_coordinates` with contextual `X,Y,Z` grid.
- Operator: deterministic `StabilityBasinSegmentation.compute`; Euclidean distance and `np.argmin` over ordered maxima.
- Target: `PARTITION/nearest_maximum_integer_raster`.
- Preserved: each cell label refers to its selected maximum index while ordered maxima and raster coexist.
- Introduced: integer region IDs and nearest-seed geometry.
- Loss: field amplitude, derivatives, minima, saddles, flow, barriers; ties depend on seed order.
- Uncertainty: tie/classification and discretization `NOT_QUANTIFIED`.
- Invertibility: `MANY_TO_ONE`.
- Evidence: canonical code lines 18–40 and runner lines 70–74.
- Status: `PARTIALLY_VERIFIED`; it is not a dynamical attraction-basin proof.

## LGC-03: partition → adjacency graph

- Source: `PARTITION/nearest_maximum_integer_raster` plus maxima count.
- Operator: deterministic `BasinTransitionGraph.compute`; sorted, undirected, unweighted edges from differing down/right neighbors.
- Target: `GRAPH/undirected_region_adjacency_edge_set`.
- Preserved: basin IDs and contacts actually detected by the implemented scan.
- Loss: raster geometry, cell membership, boundary length, direction, frequency, probabilities, and field values. The nested `ny-1,nx-1` bounds leave last-row right contacts and last-column down contacts untested, so full four-neighbor adjacency is not claimed.
- Introduced: undirected/unweighted graph semantics.
- Uncertainty: boundary-discretization and omitted-border-contact risk `NOT_QUANTIFIED`.
- Invertibility: `MANY_TO_ONE`.
- Evidence: canonical code lines 17–38 and runner lines 77–81.
- Status: `PARTIALLY_VERIFIED`; it is region adjacency, not an observed transition graph.

The three entries are evidence-populated only at their bounded operator level. End-to-end historical artifact reproduction remains `PARTIAL`.

