# Order and Commutativity Ledger

| Pair | Judgment | Condition/reason |
|---|---|---|
| `augment_then_embed` vs abstract `embed_then_augment` | conditional | same identities and compatible embedding extension |
| `embed_then_geometry_dependent_augment` | required order | perpendicular/location construction needs embedding and metric |
| `transform_then_view` vs `view_then_transform_on_view` | conditional | only with explicit equivariance and no crop/occlusion/resampling loss |
| `measure_then_render` | required order for measurement readout | rendering cannot create the measurement event/value |
| `reset_then_measure` vs `measure_then_reset` | generally noncommutative | measurement samples different state/event order |
| `return_then_compare_history` | distinct ordered operations | state return does not answer history equality |

Every event stores an execution ID and sequence index or predecessor relation. Apparent endpoint equality cannot license event reordering.

`OPERATION_ORDER_ALWAYS_COMMUTES=NO`

`GEOMETRY_DEPENDENT_AUGMENT_REQUIRES_EMBEDDING_FIRST=YES`

`TRANSFORM_VIEW_COMMUTES=CONDITIONAL_ON_EQUIVARIANT_VIEW_RULE`

`MEASURE_RENDER_COMMUTES=NO_IN_GENERAL`

`RESET_MEASURE_COMMUTES=NO_IN_GENERAL`

