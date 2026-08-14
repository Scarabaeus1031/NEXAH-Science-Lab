# Extrinsic Calibration

## IMU-to-body: `T_BI`

`R_BI` maps IMU axes to the body frame. Translation `t_BI` is irrelevant to pure
angular-rate rotation but is required when accelerometer lever-arm effects are
modeled. Calibrate orientation with independently known rotations about multiple
non-collinear axes or a traceable mechanical datum plus validation motions.

A single-axis trajectory identifies only the projection/alignment relevant to that
axis; it cannot establish the complete three-axis `R_BI`, scale and non-orthogonality
matrix jointly. Full `SO(3)` use therefore requires a separate multi-axis
calibration stage. Mount removal, impact or temperature-induced movement
invalidates the calibration.

## Camera/world and body/fiducial

- `T_WC`: calibrated from a traceable target tied to `W`, using poses that span
  the working volume; held fixed only with drift/closure checks.
- `T_BF`: obtained from fiducial manufacture/metrology and body datums, then
  verified optically across independent orientations.
- `T_SB`: mount alignment between platen and body, calibrated bidirectionally and
  re-established after remounting.

Each transform requires a covariance (including correlations), calibration data
separate from evaluation data, residual/closure acceptance rule, environmental
validity range and recalibration trigger.

World-frame gauge is fixed by stage/base metrology. Estimating `T_WC`, `T_SB` and
trajectory simultaneously without such a fixed reference leaves gauge freedom;
truth and method estimates could then agree only by shared calibration.

