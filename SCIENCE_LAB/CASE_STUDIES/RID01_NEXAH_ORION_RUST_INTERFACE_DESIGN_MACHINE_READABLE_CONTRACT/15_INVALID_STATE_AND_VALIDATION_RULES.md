# Invalid State and Validation Rules

JSON Schema enforces shape; registry validation enforces cross-record identity and order.

## Schema-level rules

1. Every non-provenance record requires provenance.
2. Every kind selects one closed payload shape; unknown fields fail.
3. measurement values require observable and measurement event.
4. readouts require at least one measurement value.
5. views require exactly one typed source variant.
6. angles require embedding, metric, two rays and event.
7. augmented graph origin requires source graph and augmentation event.
8. comparison outcomes require criterion and event.
9. reconstruction result fixes original-event identity to false.
10. reset fixes history preservation to true.

## Registry/cross-reference rules

11. every ID is globally unique; every `(id,revision)` resolves internally or in the declared external registry.
12. local IDs are unique within their parent graph revision and edge/relation members resolve locally.
13. provenance references resolve to `PROVENANCE_RECORD`.
14. rule/event/result operation kinds match.
15. event source/result refs resolve to correct revisions; results cite that event.
16. logical order is strictly increasing within an execution/history.
17. restart prior/new execution IDs differ.
18. repeat original/repeated event IDs differ.
19. history is append-only; reset/restart never remove prior entries.
20. criterion domain, frame, metric, units and observable kinds are compatible.
21. raw JSON null is rejected; omission is limited to schema-optional fields.
22. unresolved or redacted provenance is explicit and never replaced by fabricated sources.

A future Rust implementation must fail closed on any violation, unknown major version, unknown discriminator, hash mismatch, unresolved required reference or canonicalization failure.

