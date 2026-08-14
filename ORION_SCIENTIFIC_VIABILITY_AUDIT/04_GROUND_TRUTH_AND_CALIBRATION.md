# Ground Truth and Calibration

## Independent reference

The cleanest Stage-A reference is a calibrated multi-axis rotary stage with
traceable encoders. It commands and records orientation independently of ORION's
camera, IMU and fusion algorithm. For free motion, use an external multi-camera
motion-capture system observing a separate rigid marker body, or a metrology-grade
optical tracker. Do not call a laboratory IMU “truth” when evaluating inertial
fusion.

Reference expanded uncertainty should be no more than one third—and preferably
one tenth—of the smallest angular error or decision threshold being evaluated.
The ratio, confidence level and propagation into scored error must be fixed from
calibration certificates rather than assumed. Motion-capture accuracy is setup-
dependent; capture volume, geometry, speed, cameras and calibration all matter
([Vicon accuracy discussion](https://www.vicon.com/resources/blog/vicon-study-of-dynamic-object-tracking-accuracy/)).

## Minimum calibration stack

1. reference-frame and mechanical zero;
2. rotary-stage/ground-truth uncertainty and repeatability;
3. camera intrinsics and lens distortion;
4. fiducial or beam geometry and screen plane;
5. camera-to-world and sensor-to-body extrinsics;
6. IMU gyro/accelerometer bias, scale, non-orthogonality and thermal behavior;
7. magnetometer hard-/soft-iron and frame calibration, if retained;
8. force zero/scale only if force enters the model;
9. clock offset, drift and latency;
10. estimator uncertainty/calibration against held-out reference motion.

Every calibration parameter needs an acquisition procedure, validity interval,
uncertainty and invalidation/recalibration trigger. Calibration and test motion
must be separated. Independent ground truth is feasible for the reduced bench
prototype; it is not demonstrated for the current compass design.

