# Error Budget

The bookkeeping identity

```text
sigma_total^2 ~= sigma_GT^2 + sigma_camera^2 + sigma_fiducial^2
                + sigma_cal^2 + sigma_sync^2 + sigma_IMU^2
                + sigma_mechanical^2
```

is not an independence claim. Shared calibration, temperature, motion and timing
create covariance and bias; the final budget must use sensitivity coefficients and
a joint covariance or conservative bounds.

| Source | Mechanism / affected quantity | Pathway | Time/type | Independently measurable? | Required pre-test bound |
|---|---|---|---|---|---|
| encoder | quantization, accuracy/interpolation -> `R_GT` | traceable angular calibration | systematic + random | yes | allocated `u_GT` share |
| stage | backlash, wobble, runout/compliance -> `R_GT` | bidirectional metrology under load | pose/direction dependent | yes | ground-truth allocation |
| mounting | `T_SB` eccentricity/repeatability | datum survey/remount study | systematic/step change | yes | ground-truth allocation |
| pixel localization | centroid/corner noise, blur -> PnP | static target/reprojection study | random + motion dependent | yes | optical allocation |
| intrinsics/distortion | projection bias -> pose | independent camera calibration/validation | systematic/drift | yes | optical allocation |
| fiducial geometry | point-coordinate/warp error -> pose | dimensional metrology | systematic/thermal | yes | optical allocation |
| camera extrinsic | `T_WC` error -> world orientation | calibration/closure trajectories | systematic/drift | yes | calibration allocation |
| IMU extrinsic | `T_BI` error -> fused orientation | multi-axis alignment calibration | systematic/remount | conditional | inertial allocation |
| gyro noise | integrated angle noise | stationary/rate characterization | random, grows with time | yes | dropout-duration allocation |
| gyro bias/scale | drift/rate bias | stationary + known-rate rotations | slow/systematic | yes | dropout-duration allocation |
| accelerometer | bias/dynamic acceleration -> false tilt | static/motion characterization | mixed | yes if used | exclude or allocate |
| timing | offset/drift/jitter -> angle error | common-motion time calibration | systematic + random | yes | `tau_sync/omega_max` rule |
| temperature | sensor/geometry drift | monitored calibration range | slow/systematic | conditional | environment allocation |
| numerical | solver tolerance/linearization | deterministic verification | deterministic | yes | negligible allocation |

Likely dominant sources are not declared from intuition: component-independent
bounds must show them. No source may be assigned zero uncertainty. Error-budget
closure requires the combined upper uncertainty to meet the owner-defined
adequacy/coverage requirement with margin.

## Propagation chains

```text
pixels + intrinsics + geometry + extrinsics
    -> PnP pose distribution -> fusion -> e_R distribution -> action

gyro noise/bias + T_BI + timing
    -> preintegrated rotation -> dropout drift -> e_R distribution -> action
```

Local covariance is suitable for small errors/well-conditioned geometry. Near
PnP ambiguity, long dropout, large rotations or non-Gaussian outliers, use
manifold-aware sigma points, particles, profile likelihood or conservative sets.

