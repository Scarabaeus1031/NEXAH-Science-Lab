# E1 / E2 / E3 Typing

AREV-01's `E1` and `E2` remain two instances of the same formal kind: embeddings of one abstract graph. Their coordinates and visible metric angles may differ while graph structure remains fixed.

An `E3` that requires an observation map, event provenance, unit and uncertainty is not merely a third embedding. It is an instrumented or measurement-derived view sourced from the measurement branch.

The neutral type should be `MeasurementView` or `CompositeView`, selected by actual source dependencies. The label `E3` is not made canonical because its `E` prefix would obscure the branch distinction.

`E1_E2_SAME_FORMAL_KIND=YES_DISTINCT_EMBEDDING_INSTANCES`

`E3_INSTRUMENTED_VIEW_SAME_FORMAL_KIND_AS_E1_E2=NO_REQUIRES_OBSERVATION_AND_PROVENANCE`

`E3_CAN_BE_TYPED_AS_VIEW=YES_WITH_MEASUREMENT_OR_COMPOSITE_SOURCE`

No change to AREV-01 is required.
