# Sensor and Observation Map

An observation map is a rule such as

```text
S_c:X -> Z
```

where `c` records sensor configuration, frame, range, resolution or other declared conditions. A physical sensor may realize such a rule; a synthetic projection or algorithmic extractor may do so without a physical instrument.

The map/rule is distinct from:

- the target observable definition;
- one execution of the rule;
- the output value;
- a view displaying the output.

Two maps can target the same observable with different ranges or error models. One map can emit a raw signal that requires calibration before it is expressed as a registered quantity.

EMP-02 supplies a closed control: the projection rule, image extraction and inverse reconstruction are separable, and a bad segmentation rule can corrupt inference even when the modeled relation is known.

`OBSERVATION_MAP_EQUALS_OBSERVABLE=NO`

`SENSOR_EQUALS_MEASUREMENT_EVENT=NO`

`SENSOR_EQUALS_VIEW=NO`

`OBSERVATION_MAP_EQUALS_CALIBRATION=NO`
