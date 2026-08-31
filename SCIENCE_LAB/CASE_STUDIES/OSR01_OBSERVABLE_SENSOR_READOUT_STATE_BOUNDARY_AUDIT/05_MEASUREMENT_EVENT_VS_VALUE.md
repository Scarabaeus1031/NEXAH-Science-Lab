# Measurement Event versus Value

A `MeasurementEvent` records one occurrence:

```text
event_id, time/revision, observation_map_id,
observable_id, instrument/configuration, source provenance
```

A `MeasurementValue` records an outcome associated with that event:

```text
value, unit, uncertainty/resolution, quality/status,
event_id, observable_id
```

Repeated events can target the same observable and produce different values because state, noise, configuration or timing differs. An event can also fail, abort or return no valid value. Therefore event and value cannot collapse.

Two records with the same numeric value can remain distinct measurements because their event, observable, unit, uncertainty or provenance differs.

`OBSERVABLE_EQUALS_MEASUREMENT_EVENT=NO`

`MEASUREMENT_EVENT_EQUALS_MEASUREMENT_VALUE=NO`

`MEASUREMENT_VALUE_REQUIRES_EVENT_OR_PROVENANCE=YES`

`SAME_NUMERIC_VALUE_EQUALS_SAME_MEASUREMENT=NO`
