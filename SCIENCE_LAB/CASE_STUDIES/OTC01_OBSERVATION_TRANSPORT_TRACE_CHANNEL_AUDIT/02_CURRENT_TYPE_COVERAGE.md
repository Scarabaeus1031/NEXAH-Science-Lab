# Current Type Coverage

| Required distinction | Frozen coverage | Assessment |
|---|---|---|
| Source/state | RID state/entity/source evidence; OLS identity/state | Existing |
| Signal generation | Operation/event + relation + provenance | Composition sufficient |
| Path and medium | Context, state, frame, relation, constraints | Composition sufficient |
| Boundary/aperture | Geometry/constraint + parameters + frame | Derived record sufficient |
| Instrument transformation | ObservationMap/operation/transform/render rule | Existing composition |
| Sensor response | ObservationMap + configuration/calibration | Existing composition |
| Temporal/spatial/dynamic window | Parameters, constraints, event time, uncertainty | Derived records sufficient |
| Measurement event/value | RID measurement branch | Existing |
| Readout | RID Readout with measurement sources and display rule | Existing |
| Trace | View/readout/event/result/history + provenance | Derived record sufficient |
| Interpretation | Decision/claim/evidence/uncertainty, kept downstream | Existing composition |
| Loss history | View declared losses + provenance/history + explicit ledger | Composition sufficient |

The frozen contract intentionally separates definition, occurrence, value and
display. `SAME_READOUT_IMPLIES_SAME_STATE=NO` and equal view bytes do not imply
equal sources. OTC-01 adds an explicit order of references for reviewability,
not a new information-bearing primitive.

## Preserved RPR boundary

```text
VIEW_CHANGE ≠ FRAME_CHANGE ≠ REGIME_CHANGE ≠ STATE_RESPONSE
            ≠ REALIZED_FORM_CHANGE
ENTITY_IDENTITY ≠ CONTEXTUAL_ROLE
```
