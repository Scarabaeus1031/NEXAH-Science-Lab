# Observation-Operator Audit

For sensor `i`, require an explicit model
`y_i(t)=h_i(x_t,u_t,eta_t)+epsilon_i(t)` and calibration parameters.

| Channel | Conceptual operator | State information | Audit status |
|---|---|---|---|
| calibrated optical fiducials | `z_j = project(K, D, R(q)p_j+t)` | absolute pose relative to calibrated camera; orientation if rigid geometry and correspondence are known | primary |
| gyroscope | `y_g = omega_B + b_g + noise` | short-term angular-rate propagation; bias causes drift | primary |
| accelerometer | `y_a = R(q)^T(a_W-g_W)+b_a+noise` | gravity direction only when linear acceleration is known/negligible; yaw absent | primary but condition-dependent |
| magnetometer | `y_m = S R(q)^T B_W+b_m+disturbance` | heading relative to known field after hard/soft-iron calibration | optional and incompatible with nearby magnetic actuation |
| force/pressure | transducer response to contact/load | constrains force/deflection only through a validated mechanical model | exclude from MVP |
| temperature | local thermal response | nuisance/error covariate, not orientation | calibration monitor only |
| light intensity/color | radiometry/label identity | correspondence/visibility, not orientation by itself | optional label/quality channel |

The observation model must include sensor-frame extrinsics and latency. A channel
is not “multimodal information” merely because it produces numbers. Temperature,
force and light become informative for the state only through a separately
validated coupling or expanded task.

Conventional camera pose estimation already maps known 3D points to calibrated
2D projections; EPnP handles planar and non-planar sets with `n >= 4`
([Lepetit, Moreno-Noguer & Fua](https://doi.org/10.1007/s11263-008-0152-6)).
This is the direct optical baseline, not a NEXAH operation.

