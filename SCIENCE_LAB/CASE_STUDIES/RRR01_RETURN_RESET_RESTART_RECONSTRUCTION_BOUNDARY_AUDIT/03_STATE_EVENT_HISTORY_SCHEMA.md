# State / Event / History Schema

## Existing typed records

| Record | Required fields |
|---|---|
| `SourceObject` | source ID, schema/version, provenance |
| `State` | state ID/revision, source ID, typed field values, time/index |
| `OperationRule` | rule ID/version, domain, codomain, parameters |
| `OperationEvent` | event ID, execution ID, rule ID, input state ID, time/order |
| `ResultState` | result state ID, event ID, typed values |
| `Execution` | execution ID, start conditions, event sequence reference |
| `History` | ordered event IDs and transitions |
| `ProvenanceRecord` | source/rule/event/result lineage and evidence |
| `Observation` | observation map/configuration and source reference |
| `View` | source-kind, source IDs and rendering rule |

## Componentwise return assessment

For a later state compared with an earlier one, report:

```text
state_equal
state_equivalent
view_equal
readout_equal
event_equal
execution_equal
history_equal
provenance_equal
```

This is a report shape, not a new ontology. Each field cites its equality/equivalence criterion.

`STATE_RETURN_EQUALS_HISTORY_RETURN=NO`

`STATE_RETURN_EQUALS_EVENT_RETURN=NO`

`SAME_RESULT_EQUALS_SAME_PROVENANCE=NO`
