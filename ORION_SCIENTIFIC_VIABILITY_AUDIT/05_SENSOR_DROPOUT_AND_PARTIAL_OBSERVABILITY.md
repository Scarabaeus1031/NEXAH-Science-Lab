# Sensor Dropout and Partial Observability

Use only conditions whose consequences follow from the measurement model.

| Available set | Orientation identifiability | Expected behavior | Correct decision option |
|---|---|---|---|
| optical + IMU | full orientation under valid fiducials/excitation | bounded fusion error | use or abstain by calibrated bound |
| optical only | full pose per frame when visible/well-conditioned | no inertial bridging; motion blur matters | use when reprojection/geometry valid |
| IMU only, short gap | relative orientation propagated | uncertainty grows with gyro bias | time-limited use, then remeasure |
| accelerometer only, quasi-static | gravity direction | yaw unobservable; acceleration confounds tilt | `UNKNOWN` for full orientation |
| gyro + accelerometer | roll/pitch reference plus relative yaw | absolute yaw drifts | use only for yaw-insensitive task |
| magnetometer + IMU | orientation possible with excitation and clean field | vulnerable to local distortion | reject when field residuals fail |
| optical dropout + magnetic disturbance | no reliable absolute yaw after enough time | state becomes task-unidentifiable | `REMEASURE/UNKNOWN` |
| no absolute sensor | only propagation/prior | uncertainty must expand | `UNKNOWN` after fixed bound crossing |

Dropouts must be imposed by a prospective availability mask with identical data
for all methods. Include natural occlusion and explicit missing packets separately;
do not conflate them with corruption. Report time-to-tolerance-failure, angular
error, uncertainty coverage, unsafe acceptance and unnecessary abstention.

Partial observability is scientifically meaningful because the physical sensor
operators lose different state directions. Legitimate failure is required: a
method that always emits an orientation when yaw is unobservable fails the audit.

