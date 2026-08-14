# Candidate Shortlist

## 1. Spacecraft attitude-knowledge continuity under optical-sensor outage

- **External task:** maintain valid attitude knowledge or enter safe/reacquisition
  behavior when a star sensor loses/corrupts its solution.
- **Independent requirement:** mission pointing/knowledge error, validity
  probability and recovery time, using ECSS classes and mission values.
- **State:** full 3D attitude, angular rate and gyro bias.
- **Observations:** star sensor plus gyros/IMU; the fiducial bench is only an analogue.
- **Failure:** glare, field-of-view loss, excessive rate or invalid star match.
- **Decision:** use propagated attitude, flag invalid/safe, reacquire.
- **Truth:** calibrated rate table and optical star stimulus; flight truth is harder.
- **Comparator:** multiplicative/error-state Kalman filter plus FDIR/safe-mode logic.
- **Remainder:** uncertainty integrity during outages; whether this is unresolved is
  `UNCLEAR`.

## 2. Stabilized camera/antenna pan-axis continuity

- **External task:** maintain or reacquire commanded pointing.
- **Independent requirement:** product/mission pointing and latency; ETSI supplies
  requirements for a specific satellite-terminal class.
- **State:** pan/azimuth first; later two axes.
- **Observations:** axis encoder, IMU, target/scene camera.
- **Failure:** occlusion, blur, target loss, vibration.
- **Decision:** use/hold, inhibit, reacquire/re-home.
- **Truth:** calibrated encoder/autocollimator/angle metrology.
- **Comparator:** encoder servo plus camera tracking and conventional Kalman fusion.
- **Remainder:** likely systems engineering; no generic research gap shown.

## 3. Hybrid optical-inertial rigid-body tracker qualification

- **External task:** quantify pose, latency and validity during visibility loss.
- **Independent requirement:** ASTM procedures define pose/latency measurement;
  user supplies pass limits.
- **State:** 6DOF generally; orientation subset for first stage.
- **Observations:** fiducials/camera and IMU.
- **Failure:** occlusion, saturation, blur and marker loss.
- **Decision:** publish pose, invalidate, reacquire.
- **Truth:** independent metrology artifact/reference tracker.
- **Comparator:** PnP plus EKF/fixed-lag factor graph.
- **Remainder:** hybrid uncertainty/validity qualification may be useful, but task
  threshold and novelty are unconfirmed.

