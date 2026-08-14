# Pre-experiment Identifiability Gate

No data are generated here. Before any future experiment, analytical rank,
symmetry and excitation checks must establish:

| Quantity | Identifiability requirement | Failure mode |
|---|---|---|
| fiducial pose | projection Jacobian full rank for claimed motion/views; unique admissible branch | collinearity, planar mirror solution, poor conditioning |
| camera extrinsic `T_WC` | fixed world datum plus calibration poses spanning relevant DOF | trajectory/extrinsic gauge coupling |
| body/fiducial `T_BF` | independent metric geometry or separately excited hand-eye chain | pose absorbed into geometry |
| stage/body `T_SB` | bidirectional encoder poses and mechanical datums | zero/backlash/mount confounding |
| IMU alignment `R_BI` | multiple non-collinear rotations for full 3D; axis projection only in Stage 1 | unexcited cross-axis terms |
| gyro bias | stationary intervals and change in rate | bias/rate confounding |
| gyro scale | known nonzero rates, preferably multiple magnitudes/directions | scale/true-angle confounding |
| time offset | variable angular velocity observed by encoder/camera/gyro | constant-speed offset/angle-zero confounding |
| dropout drift | bias/noise calibrated before masked interval | truth leakage or unbounded bias |

Stage-1 single-axis data cannot jointly identify full three-axis extrinsics and IMU
error matrices. The specification avoids false identifiability by limiting its
claim and requiring separate calibration excitation.

The gate passes only after frozen fiducial coordinates, stage/camera placement,
motion envelope and calibration sequences yield acceptable rank/conditioning and
no unresolved gauge. Current status is `CONDITIONAL`, because those physical
design parameters do not yet exist.

