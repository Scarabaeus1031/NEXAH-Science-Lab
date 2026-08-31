# Readout and View Boundary

A readout is a display transformation

```text
D:(m1,...,mk) -> rendered representation
```

with declared source measurement values, formatting, unit conversion, rounding, thresholds and layout where applicable.

The same measurement may support different readouts—for example raw precision, rounded text and a gauge. Conversely, one glyph such as `100` can display different observables and units.

A `View` is broader. Its source-kind must be one of:

- `EmbeddingSource`;
- `MeasurementSource`;
- `CompositeSource`.

A readout is normally measurement-derived and may be used as or within a view, but not every view is a readout.

`MEASUREMENT_VALUE_EQUALS_READOUT=NO`

`READOUT_EQUALS_VIEW=NO_IN_GENERAL`

`SAME_READOUT_IMPLIES_SAME_STATE=NO`

`VIEW_EQUALS_TRUTH=NO`

View can be geometry-derived, measurement-derived, or composite.
