# A0 Ullinium methods 1–5 — frozen engineering preregistration

Date: `2026-11-11`
Status: `FROZEN BOUNDED ENGINEERING VERIFICATION / NOT A LAB RUN`

## Question

For the same labelled graph-gluing task, how do five encodings compare on
exact source reconstruction, fail-closed corruption detection and serialized
payload size?

## Frozen population

- Graph families: cycle, tree, rectangular ladder grid, planar fan and
  connected general graph.
- Population: `2,000` deterministic trials per family; `10,000` total.
- Source sizes: independently selected from `6..14` vertices, with even sizes
  for the ladder grid.
- Overlap selectors, rotated evenly through the population: one vertex, one
  edge, or one length-two path.
- Display randomization: quotient-vertex relabelling and randomized overlap
  orientation.
- Seed: `20261111`.

## Frozen methods

1. `ADJACENCY_ONLY`: the anonymous displayed quotient graph.
2. `PROPERTY_GRAPH`: display vertices and edges with source-origin properties.
3. `BIPARTITE_INCIDENCE`: source occurrence and source-edge nodes with explicit
   projection/incidence links to the display.
4. `Cospan_PUSHOUT`: both source graphs plus explicit vertex and edge maps into
   the displayed pushout.
5. `NEXAH_RETURN_RECEIPT`: displayed quotient plus layer return maps, seam
   preimages, source digest, claim boundary and return status.

No method may consult hidden trial state during decoding. Methods 2–5 receive
the same SHA-256 source digest. Method 1 deliberately has no provenance.

## Metrics

- exact labelled reconstruction of both source graphs;
- detection of a single deterministic provenance-map corruption;
- detection of a false seam binding;
- canonical UTF-8 JSON payload bytes;
- deterministic payload record count.

Runtime is descriptive only and is not a gate.

## Validity gates

The comparison is valid only if:

- `ADJACENCY_ONLY` exact reconstruction is at most `0.01`;
- methods 2–5 reconstruct exactly at rate `1.0`;
- methods 2–5 detect the injected corruption at rate `1.0`;
- methods 2–5 detect the false seam at rate `1.0`;
- every family and every overlap selector has its declared trial count.

## Falsifier and allowed conclusion

The claim that method 5 supplies a distinct reconstruction or robustness
advantage is falsified when it does not exceed the best standard method on
those metrics. A larger method-5 payload is recorded as governance overhead,
not hidden as a win.

Allowed conclusions are:

- `METHOD_ADVANTAGE`;
- `EQUIVALENT_RECOVERY_WITH_EXPLICIT_GOVERNANCE_OVERHEAD`;
- `NO_DISTINCT_METHOD_ADVANTAGE`;
- `FALSIFIED_OR_INVALID`.

## Claim ceiling

This is a deterministic software-encoding benchmark under Structure Freeze.
It is not a Lab run and does not establish a new mathematical theorem,
physical mechanism, Ullinium theory, Study, Finding, paper result or
publication authority.
