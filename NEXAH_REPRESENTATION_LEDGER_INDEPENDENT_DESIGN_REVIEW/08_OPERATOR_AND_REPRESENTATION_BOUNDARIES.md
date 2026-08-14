# Operator and Representation Boundaries

## Operator findings

- Case A bundles differentiation, Hessian construction, threshold selection, and classification.
- Case B conflates edge extraction with plotting/NetworkX graph construction.
- Case C conflates transform/inverse generation, metric/certificate calculation, and classification-record construction.
- Case D bundles a full representation-decoder-alignment-certificate pipeline and an aggregate cross-study claim.

The schema permits `component_edges` but gives no ordering, input/output compatibility, component versions, or rule for when a component must be exposed. Reviewers can validly choose incompatible granularities.

## Representation findings

Core types are adequate as broad search facets but insufficient as scientific contracts. Free-form subtype does not reliably encode:

- scalar grid shape/coordinates/units;
- candidate list class semantics;
- partition label domain and adjacency convention;
- simple versus multigraph, directedness, weights, labels, isolated nodes;
- raw classifier arguments versus already computed record.

A large ontology is unnecessary. A required versioned `representation_contract_ref` or compact structured profile is sufficient. Until then, `REPRESENTATION_TYPES_SUFFICIENT = PARTIAL`.

