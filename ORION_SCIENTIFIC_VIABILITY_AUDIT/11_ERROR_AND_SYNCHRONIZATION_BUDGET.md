# Error and Synchronization Budget

## Conceptual error budget

| Source | Mechanism | Likely importance | Control |
|---|---|---|---|
| camera pixels/spot centroid | quantization, blur, saturation | medium/high | subpixel fit, exposure control, residuals |
| camera calibration | intrinsics, distortion, extrinsics | high systematic | traceable target, held-out reprojection checks |
| beam/fiducial geometry | misalignment, thermal/mechanical drift | high systematic | rigid metrology and recalibration trigger |
| gyro bias/noise | integrated drift during optical loss | dominant for long dropout | bias state, thermal calibration, Allan analysis |
| accelerometer bias/dynamics | false tilt under linear acceleration | high during motion | excitation model and rejection/downweighting |
| magnetometer distortion | hard/soft iron, local fields | dominant if compass magnets remain | remove magnets or exclude channel |
| bearing friction/backlash | hysteresis and altered plant dynamics | high for free probe | torque/return/repeatability characterization |
| force-sensor error | zero, hysteresis, creep | irrelevant to MVP | exclude until task needs it |
| temperature drift | sensor/geometry changes | medium systematic | record, chamber/calibration if material |
| timing | clock offset, drift, latency, exposure | dominant in fast motion | hardware timestamps/trigger and latency calibration |
| ground truth | encoder/mocap calibration | must be subdominant | uncertainty certificate and propagation |

No numeric total is defensible before a pointing tolerance, motion envelope,
hardware selection and sampling schedule exist. The dominant expected MVP terms
are camera/extrinsic calibration and timestamp latency during dynamics, followed
by gyro bias during optical dropout. In the current compass, mechanics and magnetic
distortion could dominate everything.

## Synchronization contract

Use a shared hardware trigger/clock where possible. Preserve raw device timestamps,
estimate fixed offset and clock drift, record camera exposure midpoint/readout,
IMU group delay and transport latency, and resample only with a frozen continuous-
time model. Rolling-shutter readout requires row-time correction or a global-
shutter camera.

Run a dynamic time-offset calibration using a common motion visible to camera and
IMU. Propagate residual timestamp uncertainty into orientation uncertainty. A
method must not interpret lag-induced residuals as representation loss. Time
synchronization is controllable in a redesigned bench system, but not specified
in the current design.

