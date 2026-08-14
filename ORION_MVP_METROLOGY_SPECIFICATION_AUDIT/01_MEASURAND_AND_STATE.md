# Measurand and State

## Primary measurand

The physical measurand is rigid-body orientation relative to the laboratory frame:

```text
R_WB(t) in SO(3)
```

`R_WB` maps body-frame coordinates into world-frame coordinates. A unit quaternion
`q_WB` may represent it computationally, but `q` and `-q` are the same physical
orientation. “Absolute” is prohibited unless the declared `W` frame is named.

For the preferred first stage, motion is restricted to a known one-parameter
subgroup `R_WB(theta(t))` about the calibrated stage axis. The measurand remains an
orientation; the experiment does not thereby establish general `SO(3)` recovery.

## Minimum dynamic state

```text
x_t = [q_WB(t), omega_B(t), b_g(t)]
```

- `q_WB`: physical orientation;
- `omega_B`: physical body angular velocity;
- `b_g`: slowly varying gyro bias, a sensor nuisance state needed for propagation.

Translation is fixed by the stage and excluded. Accelerometer bias `b_a` is a
calibration/nuisance parameter in Stage 1 because the primary inertial observable
is gyro rate. If accelerometer data is later fused dynamically, `b_a` must enter
the estimated state and its observability must be re-audited.

Camera intrinsics, lens distortion, fiducial coordinates, rigid extrinsics, clock
parameters, gyro scale/misalignment and stage-axis parameters are calibration
parameters—not physical state. Covariance, residuals and interpolation states are
estimator-internal variables.

