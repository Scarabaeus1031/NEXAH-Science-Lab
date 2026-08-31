# Operation Rule / Event / Result Schema

`OperationKind` is closed: `TRANSFORM`, `AUGMENT`, `PARTITION`, `RENDER`, `COMPARE`, `RECONSTRUCT`, `DECIDE`, `RESET`, `RESTART`, `REPEAT`.

An `OperationRule` contains kind and a matching discriminated specification. An `OperationEvent` requires rule revision, source revisions, result revisions, execution, logical order and timestamp. An `OperationResult` requires event, source and result references. All three have different global IDs.

Specialized specs prevent noun/verb collapse:

- `TransformSpec` defines a map, not a transformed embedding.
- `AugmentationSpec` defines added objects and dependency kind, not an augmented graph.
- `PartitionSpec` defines a criterion, not a partition result.
- `RenderSpec` defines representation/loss policy, not a view.
- `CompareSpec` requires a comparison criterion.

Cross-record validation requires event kind to equal rule kind and result kind to equal event kind. Event order is preserved by execution plus logical order and history entries.

