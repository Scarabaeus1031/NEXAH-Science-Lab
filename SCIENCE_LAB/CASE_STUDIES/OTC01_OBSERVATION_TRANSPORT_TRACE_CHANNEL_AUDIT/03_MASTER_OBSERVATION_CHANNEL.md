# Master Observation Channel

## Minimal defensible record

```text
source_state_ref
  -> signal_generation_event_ref
  -> propagation_context {path_ref, medium_state_ref}
  -> interactions[]
  -> boundary_records[]
  -> instrument_transform_ref
  -> integration_window {time, space, dynamic_range, threshold}
  -> sensor_response_ref
  -> measurement_event/value refs
  -> readout_ref
  -> trace/view_ref
  -> optional interpretation_ref
```

Every arrow means typed dependency or documented transformation, not identity,
necessity or a universal physical law. Each stage carries provenance, applicable
frame/time, uncertainty and declared loss. A stage may be absent only when its
absence is explicit and justified.

## Required separations

- A source is the relevant physical system/state; a signal is what it generates
  or modifies for the bounded observation.
- A medium is a stateful context; transport is the applicable propagation or
  transfer process through it.
- A boundary is a declared interface; an aperture is one controlled opening.
- An instrument transformation changes what reaches the sensor without thereby
  changing the source.
- Sensor response is not a measurement value; a measurement value is not a
  readout; a readout is not the source state.
- A trace is a provenance-bearing representation of an observation history. An
  interpretation is a downstream claim constrained by that history.

The linear layout is a review order. Real channels may branch, contain feedback,
or omit a stage. Such cases must be typed explicitly rather than forced into the
diagram.
