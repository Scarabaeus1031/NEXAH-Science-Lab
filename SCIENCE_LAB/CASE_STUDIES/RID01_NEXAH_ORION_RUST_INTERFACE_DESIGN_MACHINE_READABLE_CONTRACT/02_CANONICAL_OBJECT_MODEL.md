# Canonical Object Model

The minimum model has two record families:

1. `ProvenanceRecord`, which is a lineage root and therefore has no self-referential `provenance_ref`.
2. every other registered record, which requires `kind`, global `id`, immutable `revision_id`, `provenance_ref` and kind-specific `data`.

Registered records include source state, graph/embedding/frame/metric, measurement records, views, rules/events/results, comparison records, reconstruction/decision, return-family records, execution and history.

Local graph members—vertex, edge, relation, constraint, anchor, ray and junction—have parent-scoped local IDs. They cannot exist canonically outside the registered graph revision that supplies their scope. All cross-record references use global IDs plus revisions where state/version matters.

## Independent records

Provenance, source state, graph, frame, metric, observation map, observable definition, calibration, unit, comparison criterion, operation rule and execution may be registered independently with provenance.

## Dependent records

Embeddings require graph/frame/metric; measurement events require state/map/observable; values require observable/event; readouts require values; views require a typed source; events require rules/executions; results require events; return assessments require states/criterion; history requires ordered events.

## Type admission ledger

- Required wire primitives: `ObjectId` serialized as validated `GlobalId`, parent-scoped local IDs, `RevisionRef`, `SchemaVersion` serialized by the top-level `schema_version` field, timestamp/logical order, provenance, tagged presence state and closed discriminators.
- Independent registered records: source state, graph, embedding dependencies, observation definitions, rules, criteria, execution, history and provenance.
- Derived records: anchor/ray/junction roles, measurement value/readout, operation specializations, invariant/difference/residual, ambiguity/abstention, reconstruction/decision and return-family records.
- `StateRef` is serialized as `RevisionRef` plus the registry rule “target kind = SOURCE_STATE”; `ExecutionRef` is a global ID plus “target kind = EXECUTION”. Duplicate wire wrappers are rejected as alias-only, while later Rust newtypes remain appropriate.
- No historical or expression label is admitted. No required candidate remains underdefined.

Identity is ID-and-revision identity. Equality and equivalence are outcomes of registered criteria, never inferred from identity or appearance.

