# RID / OLS Type Assessment

| Candidate | Classification | Composition |
|---|---|---|
| SIGNAL_SOURCE | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | Entity/state + event/relation + provenance |
| PROPAGATION_PATH | DERIVED_RECORD_SUFFICIENT | Frame/context + geometry/relations + time |
| MEDIUM_STATE | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | State + context + parameters/constraints |
| BOUNDARY | EXISTING_TYPE_SUFFICIENT | Geometry/constraint/frame records |
| APERTURE | DERIVED_RECORD_SUFFICIENT | Boundary + opening geometry + transmission parameters |
| TRANSFER / TRANSFORMATION | EXISTING_TYPE_SUFFICIENT | ObservationMap/operation/transform/render rule |
| TEMPORAL_INTEGRATION_WINDOW | DERIVED_RECORD_SUFFICIENT | Event time + interval + sampling/configuration |
| SPATIAL_RESOLUTION | DERIVED_RECORD_SUFFICIENT | Frame/metric + sampling rule + uncertainty |
| SENSOR_RESPONSE | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | ObservationMap + configuration/calibration |
| DYNAMIC_RANGE | DERIVED_RECORD_SUFFICIENT | Calibration/response bounds + criterion |
| SATURATION | DERIVED_RECORD_SUFFICIENT | Response status + bound + event provenance |
| DETECTION_THRESHOLD | DERIVED_RECORD_SUFFICIENT | Criterion + calibration/noise/uncertainty |
| OBSERVABILITY_WINDOW | NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE | Named interface over existing bounds and criteria |
| TRACE | DERIVED_RECORD_SUFFICIENT | Readout/view + event/result/history + provenance |
| INFORMATION_LOSS_LEDGER | NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE | Review record linking declared losses by stage |

## Assessment

OLS supplies identity, context, perspective, position, relation, state,
transition, evidence, uncertainty and provenance. RID supplies typed observation
definitions/events/values, readouts, tagged view sources, transformations,
comparisons and immutable lineage/history.

The existing vocabulary can therefore encode the channel if composition is
explicit. A convenience `ObservationChannelRecord`, `ObservabilityWindow` and
loss ledger would make authoring/review clearer, but their fields are references
to existing typed content. OTC-01 does not justify changing the canonical schema.

```text
NEW_OLS_PRIMITIVE_REQUIRED=NO
RID_SCHEMA_GAP_FOUND=NO
```
