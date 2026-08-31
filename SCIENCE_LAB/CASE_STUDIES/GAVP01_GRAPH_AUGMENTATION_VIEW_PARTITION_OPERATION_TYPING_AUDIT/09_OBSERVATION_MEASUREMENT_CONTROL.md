# Observation / Measurement Control

Take the exact geometric apex angle from `(G,E1)`.

```text
geometric angle object
 -> ObservableDefinition(apex-angle magnitude)
 -> ObservationMap
 -> MeasurementEvent
 -> MeasurementValue(unit, uncertainty/provenance)
 -> Readout
 -> View
```

No physical or pixel measurement is executed in GAVP-01. Values computed from the declared coordinates are classified as derived geometric values, not instrument measurements.

```text
geometric angle != observable definition
observable definition != measurement event
measurement event != measurement value
measurement value != readout
readout != view
```

`OBSERVATION_EQUALS_MEASUREMENT=NO`

`READOUT_EQUALS_VIEW=NO_IN_GENERAL`

`MEASUREMENT_EVENT_PERFORMED=NO`

`COMPUTED_COORDINATE_VALUE_STATUS=DERIVED_GEOMETRY_NOT_INSTRUMENT_MEASUREMENT`
