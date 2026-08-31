# Rust-Facing Interface Blueprint

This is language-neutral pseudostructure, not Rust source or an API commitment.

```text
Registered<T> {
  object_id: ObjectId,
  revision: RevisionRef,
  value: T,
  provenance: ProvenanceRecord
}

OperationRule<I, O> {
  rule_id, version, domain_contract, parameters
}

OperationEvent<I, O> {
  event_id, execution_id, sequence,
  rule_ref, input_refs, result_ref,
  occurred_at, provenance
}

View {
  view_id,
  source: GeometrySource | MeasurementSource | CompositeSource,
  representation_rule_ref,
  declared_losses,
  provenance
}

ReturnAssessment {
  earlier_state_ref, later_state_ref,
  compared_fields, criterion_ref,
  state_equal_or_equivalent,
  event_equal, execution_equal,
  history_equal, provenance_equal
}
```

## Module boundaries for later design

- `identity`: object/revision/state references.
- `structure`: relations, graph and constraints.
- `geometry`: embeddings, frames, metrics and transforms.
- `observation`: maps, observables, measurement events/values.
- `representation`: readouts, views and source union.
- `operations`: rules, events, results and executions.
- `assessment`: comparisons, invariants, differences, residuals, ambiguity and return assessments.
- `lineage`: histories and provenance.

Cross-module construction must use validated references. Serialization, canonical hashes, error types and ORION envelope mappings remain contract work, not implied implementation.

`RUST_SOURCE_CREATED=NO`

