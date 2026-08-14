# Prior Art and Conventional Solutions

## Strongest solutions by candidate

| Candidate | Strongest conventional solution | What remains after admitting it? |
|---|---|---|
| spacecraft attitude continuity | star tracker + gyros/IMU in a multiplicative/error-state Kalman filter, validity/Fault Detection Isolation and Recovery, safe-mode/reacquisition logic; smoothing for ground analysis | possibly calibration/integrity of declared uncertainty during realistic outages; novelty unresolved |
| stabilized camera/antenna | encoder-based gimbal control, calibrated camera target tracking, IMU feed-forward, EKF/factor graph and loss-of-lock/reacquisition logic | usually product integration; no generic unresolved estimator question shown |
| hybrid optical tracker qualification | calibrated PnP/rigid-body tracking, EKF/fixed-lag factor graph, occlusion handling and validity output | standardized measurement of hybrid dropout integrity may be useful, but no external acceptance threshold yet |

`SOURCE_FACT`: NASA describes IMU-propagated Kalman filtering during star-tracker
loss ([NASA GNC](https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/)).
Factor graphs, visual-inertial estimation, PnP, EKF/UKF and fault monitoring are
therefore not ORION contributions.

## Novelty assessment

- application problem: established;
- state/measurement mathematics: established;
- conventional solution: mature;
- fiducial+IMU+encoder bench: standard systems integration;
- calibrated `ACCEPT/ABSTAIN/REMEASURE` behavior under a frozen natural outage
  population: potentially useful evaluation emphasis, not demonstrated novelty.

The scientific remainder is `UNCLEAR`, not presumed. A competent domain team may
judge the question already answered or operationally unimportant. ORION must match
or be falsified by the strongest conventional solution; there is no NEXAH method.

