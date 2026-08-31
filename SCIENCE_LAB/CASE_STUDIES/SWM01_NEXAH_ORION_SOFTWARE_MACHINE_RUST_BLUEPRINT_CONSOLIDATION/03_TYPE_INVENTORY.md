# Type Inventory

Classification concerns software-schema roles, not metaphysical primitives.

| Candidate | Classification | Reason |
|---|---|---|
| `ObjectId` | `REQUIRED_PRIMITIVE` | stable object identity |
| `StateRef` | `REQUIRED_PRIMITIVE` | typed reference to source and revision |
| `RevisionRef` | `REQUIRED_PRIMITIVE` | separates revision identity from object identity |
| `Graph` | `DERIVED_TYPE` | composite vertices/relations |
| `Relation` | `REQUIRED_PRIMITIVE` | registered structural assertion |
| `Constraint` | `DERIVED_TYPE` | rule-scoped restriction over typed objects |
| `Anchor` | `DERIVED_TYPE` | identified geometric/relational role |
| `Ray` | `DERIVED_TYPE` | anchor, direction and frame |
| `Edge` | `DERIVED_TYPE` | endpoint relation with direction policy |
| `Junction` | `DERIVED_TYPE` | node plus incident relations |
| `Embedding` | `REQUIRED_PRIMITIVE` | explicit source-to-coordinate realization |
| `Frame` | `REQUIRED_PRIMITIVE` | coordinate reference contract |
| `Metric` | `REQUIRED_PRIMITIVE` | declared comparison/evaluation rule |
| `Transform` | `DERIVED_TYPE` | geometry-specialized `OperationRule` |
| `ObservationMap` | `REQUIRED_PRIMITIVE` | state-to-observation rule |
| `ObservableDefinition` | `REQUIRED_PRIMITIVE` | quantity/feature semantics independent of values |
| `MeasurementEvent` | `REQUIRED_PRIMITIVE` | occurrence identity and conditions |
| `MeasurementValue` | `REQUIRED_PRIMITIVE` | event-bound typed value |
| `Calibration` | `DERIVED_TYPE` | versioned parameters and validity range |
| `Unit` | `DERIVED_TYPE` | quantity-kind representation contract |
| `Uncertainty` | `DERIVED_TYPE` | method-qualified value metadata |
| `Readout` | `DERIVED_TYPE` | values plus display transformation |
| `View` | `REQUIRED_PRIMITIVE` | represented output with declared source |
| `ViewSource` | `REQUIRED_PRIMITIVE` | closed source-kind discriminator |
| `OperationRule` | `REQUIRED_PRIMITIVE` | versioned domain/codomain rule |
| `OperationEvent` | `REQUIRED_PRIMITIVE` | application occurrence |
| `ResultObject` | `REQUIRED_PRIMITIVE` | event-linked output identity |
| `Partition` | `DERIVED_TYPE` | rule/result with membership and coverage |
| `Residual` | `DERIVED_TYPE` | declared remainder under a comparison/model |
| `Ambiguity` | `DERIVED_TYPE` | typed alternatives/cause/status record |
| `Reconstruction` | `DERIVED_TYPE` | result of a reconstruction event |
| `Execution` | `REQUIRED_PRIMITIVE` | bounded ordered event container |
| `History` | `REQUIRED_PRIMITIVE` | ordered event/state lineage |
| `ProvenanceRecord` | `REQUIRED_PRIMITIVE` | source/rule/event/result evidence lineage |
| `ReturnAssessment` | `DERIVED_TYPE` | field- and criterion-specific comparison |
| `Decision` | `DERIVED_TYPE` | result of authorized decision event, including abstain |

No listed candidate is merely an alias, rejected or underdefined after predecessor definitions are applied. Historical labels remain outside this inventory.

