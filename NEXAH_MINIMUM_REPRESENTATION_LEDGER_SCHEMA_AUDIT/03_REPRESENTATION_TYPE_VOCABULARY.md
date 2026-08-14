# Representation-Type Vocabulary

## Core vocabulary

`MODEL`, `ARRAY`, `FIELD`, `FEATURE_SET`, `PARTITION`, `GRAPH`, `SIMULATION_OUTPUT`, `STATISTICAL_SUMMARY`, `CLASSIFICATION`, `MEASUREMENT`, `VISUALIZATION`, `DECISION`.

These twelve types cover the verified examples without pretending to encode a scientific ontology. A required `subtype` supplies narrow semantics such as `scalar_grid`, `critical_candidate_coordinates`, or `undirected_region_adjacency`.

An extension uses:

```yaml
representation_type: EXTENSION
subtype: org.example/trajectory-v1
```

Extension identifiers must be namespaced and cannot change core validation rules. `ANALYTICAL` and `PARAMETRIC_MODEL` collapse into `MODEL`; scalar/vector variants collapse into `FIELD` plus subtype; trajectory can be `ARRAY` or a namespaced extension depending on its actual contract. This avoids a premature ontology.

Representation is a type; `field_run_004.npy` is an artifact. A graph class is not evidence that any particular graph was generated.

