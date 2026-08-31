# OSR-01 Measurement / View Application

ETRI-01 uses exact formal geometry. It does not measure the unavailable screenshot or execute a sensor procedure.

```text
geometric angle object
  -> exact derived geometric magnitude
  -> optional future measurement event
  -> numeric measurement value with uncertainty
  -> rendered label
  -> view
```

Only the first two steps are used here. A rendered `45°` label in a diagram would be a readout/view element, not the geometric angle object. A future pixel estimate would require observation-map, event, unit and uncertainty provenance.

`OSR_BOUNDARY_PRESERVED=YES`

`MEASUREMENT_EVENT_PERFORMED=NO`

`MEASUREMENT_EVENT=NONE`

`EXACT_VALUES_STATUS=DERIVED_GEOMETRIC_VALUES_NOT_SENSOR_MEASUREMENTS`

`DISPLAYED_ANGLE_EQUALS_GEOMETRIC_ANGLE_OBJECT=NO`
