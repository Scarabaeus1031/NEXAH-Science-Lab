# Observation / Measurement Branch

```text
StateRef
  -> ObservationMap
  -> ObservableDefinition
  -> MeasurementEvent
  -> MeasurementValue + Unit/Uncertainty/Calibration where applicable
  -> Readout
```

`ObservationMap` is a rule. `ObservableDefinition` names what may be obtained. `MeasurementEvent` records an occurrence. `MeasurementValue` is an event-bound result. `Readout` formats or aggregates values. A source-typed `View` may represent the readout but is not the readout itself.

Required boundaries:

- `STATE_EQUALS_OBSERVABLE=NO`
- `OBSERVABLE_EQUALS_MEASUREMENT_EVENT=NO`
- `MEASUREMENT_EVENT_EQUALS_MEASUREMENT_VALUE=NO`
- `MEASUREMENT_VALUE_EQUALS_READOUT=NO`
- `READOUT_EQUALS_VIEW=NO_IN_GENERAL`
- `SAME_READOUT_EQUALS_SAME_STATE=NO`

