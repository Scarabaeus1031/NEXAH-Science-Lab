# Representation Typing V2

V2 retains a small class vocabulary: `MODEL`, `ARRAY`, `FIELD`, `FEATURE_SET`, `PARTITION`, `EDGE_SET`, `GRAPH`, `RECORD`, `STATISTICAL_SUMMARY`, `CLASSIFICATION`, `MEASUREMENT`, `VISUALIZATION`, `DECISION`, and `EXTENSION`.

Each representation has a versioned `contract_id`, a narrow subtype, and only the qualifiers needed by the four cases:

- grid rank and coordinate arrays;
- scalar, integer-label, coordinate-pair, edge-pair, record, or status value kind;
- directed, weighted, labeled, simple, and isolated-node properties;
- temporal flag.

Artifacts are optional. This allows analytical or unavailable historical instances without fabricated files. Each artifact independently states `KNOWN`, `PROVENANCE_UNAVAILABLE`, `UNKNOWN`, or `NOT_APPLICABLE` and supplies a locator only when known.

The qualifiers are not a universal ontology. The contract text remains the controlling source/target type definition.

