# Single Axis versus 3-DOF

## Recommendation

Prefer a single encoded axis for the first stage. Use a rigid body with an
asymmetric multi-point fiducial and IMU, and rotate bidirectionally through static,
slow, variable-speed and bounded dropout segments.

The minimum configuration is one nonmagnetic rigid body, one independently
metrologized asymmetric fiducial, one rigidly mounted six-axis IMU, one calibrated
global-shutter camera, one independently encoded single-axis stage and a shared
timestamp/trigger path. No additional sensor or degree of freedom is admitted
without a new requirement.

## What single axis establishes

- frame sign/order and encoder reference;
- optical angle/pose consistency on one known subgroup;
- camera/encoder/IMU time offset and latency under variable speed;
- gyro bias/scale projected onto the excited axis;
- uncertainty growth and time-to-tolerance under optical dropout;
- calibration closure and `ACCEPT/ABSTAIN/REMEASURE` mechanics for a genuine
  one-axis task, if externally justified.

## What it does not establish

- general `SO(3)` observability or roll/pitch/yaw coverage;
- full `R_BI` and cross-axis scale/non-orthogonality;
- noncoplanar optical conditioning over all views;
- accelerometer gravity/linear-acceleration separation;
- multi-axis rotational dynamics and coupling.

A three-DOF stage should follow only if Stage 1 closes the metrology chain and an
external task requires it. It needs independently calibrated multi-axis truth,
axis non-orthogonality/runout, richer excitation and a reopened error budget.

Thus `SINGLE_AXIS_FIRST_STAGE_PREFERRED = YES`; any resulting claim must be named
“single-axis metrology validation,” not full orientation-platform validation.
