# Physical State and Minimal Task

## Smallest defensible state

For a rigid probe whose translation is fixed by a rotary-stage fixture, use

```text
x_t = [q_WB(t), omega_B(t), b_g(t)]
```

where `q_WB` is body orientation in a laboratory world frame, `omega_B` is body
angular velocity and `b_g` is gyro bias. Quaternion sign is representational;
orientation lives on `SO(3)`. Position and translational velocity are excluded
from the minimum state. Add them only if the probe is later allowed to translate.

Gravity, the local magnetic field, temperature and applied torque are calibrated
inputs or nuisance variables, not automatically state components. Deflection,
force and pressure belong in an expanded mechanical task only after an explicit
dynamics model connects them to orientation.

## Direct, derived and reference quantities

- Direct measurements: pixels/marker centroids, angular-rate and specific-force
  samples, timestamps and optional encoder readings.
- Derived quantities: orientation, angular velocity after filtering, covariance,
  observability rank/conditioning and decision confidence.
- Redundant for the minimum task: color/intensity, temperature, force and pressure
  unless they model a demonstrated error or separate target.
- External truth required: orientation and commanded motion; preferably angular
  velocity as a derivative/check, not as truth from the evaluated gyro.

## Strongest minimal scientific task

Estimate `q_WB(t)` and determine whether its prospective angular-error bound is
small enough for a fixed pointing tolerance during controlled optical or IMU
dropout. The action is `USE`, `ABSTAIN` or `REMEASURE`.

Orientation reconstruction alone is a standard sensor-fusion demonstration. The
scientific test begins when dropout conditions, observability predictions,
calibrated uncertainty and decision errors are compared prospectively against
independent ground truth. This remains established methodology, but it is a real,
falsifiable measurement problem.

