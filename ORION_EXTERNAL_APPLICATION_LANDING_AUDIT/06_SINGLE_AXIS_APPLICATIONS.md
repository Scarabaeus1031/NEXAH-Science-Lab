# Single-Axis Applications

## Strong matches

- antenna azimuth or elevation alignment/tracking;
- single-axis gimbal/pan pointing;
- rotary-stage or rotary-axis metrology;
- one-axis sensor/attitude test-table qualification.

`SOURCE_FACT`: ISO 230-2 applies direct positioning-accuracy/repeatability tests to
both linear and rotary machine axes
([ISO 230-2](https://www.iso.org/standard/55295.html)). ETSI EN 301 360 specifies
antenna pointing capability and stability requirements for its terminal class
([ETSI standard](https://www.etsi.org/deliver/etsi_EN/301300_301399/301360/02.01.01_60/en_301360v020101p.pdf)).

## Adversarial fit

The single-axis MVP is externally natural for antenna/gimbal/rotary metrology, but
temporary optical-inertial dropout is not automatically the limiting problem.
Modern systems may solve the axis task directly with an encoder. Adding a camera
and IMU without an owner requirement would only create a standard demonstrator.

Spacecraft attitude and general hybrid tracking require 3DOF/6DOF. A single-axis
test can validate timing, bias propagation, optical angle and uncertainty
bookkeeping, but cannot validate the external mission task. It is an accepted
metrology precursor only.

Classification:

```text
SINGLE_AXIS_FIRST_STAGE_EXTERNALLY_RELEVANT = PARTIAL
```

It becomes `YES` only for a named pan/azimuth task owner who confirms optical-
inertial continuity is needed beyond encoder-only control.

