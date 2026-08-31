# Measurement Branch Schema

```text
StateRef
  -> ObservationMap
  -> ObservableDefinition
  -> MeasurementEvent
  -> MeasurementValue
  -> Readout
```

The schema keeps rule, definition, occurrence, value and display separate. A measurement event requires state, observation map, observable, execution, order and time. A measurement value requires its observable and event plus a tagged value, unit applicability and uncertainty status. Calibration is separately versioned and may be referenced when applicable.

Units are records with symbol, quantity kind and scale convention. Uncertainty is `PRESENT(method,value[,confidence])`, `UNKNOWN`, or `NOT_APPLICABLE`; it is never a truth flag. A readout requires at least one measurement-value source and a display rule.

`MEASUREMENT_VALUE_WITHOUT_EVENT=SCHEMA_INVALID`

`READOUT_WITHOUT_MEASUREMENT_SOURCE=SCHEMA_INVALID`

`SAME_READOUT_IMPLIES_SAME_STATE=NO`

