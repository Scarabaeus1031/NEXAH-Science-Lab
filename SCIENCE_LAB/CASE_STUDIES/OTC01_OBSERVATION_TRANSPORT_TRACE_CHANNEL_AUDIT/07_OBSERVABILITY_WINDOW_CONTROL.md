# Observability Window Control

## Neutral definition

An `ObservabilityWindow` is a declared range of source/channel/sensor conditions
within which differences relevant to a stated measurement question remain
distinguishable under a specified criterion.

It must name:

- the question and observable;
- channel and sensor configuration;
- spatial/temporal sampling;
- detection threshold, noise criterion and dynamic range;
- saturation and below-threshold rules;
- calibration, uncertainty, validity interval and provenance.

## Result

`OBSERVABILITY_WINDOW_STATUS=NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE`

It is a useful interface/derived record composed from existing constraints,
observation map, calibration, uncertainty and provenance. It is neither a “truth
window” nor proof that middle settings are more real.

- Underexposure can suppress distinguishable signal below the detection/noise
  criterion.
- Saturation/clipping maps multiple larger inputs to the same maximum code.
- High contrast can be introduced by transfer or display mapping and does not
  imply high information or truth.
- “Optimal exposure” is relative to the declared question and loss criterion.
