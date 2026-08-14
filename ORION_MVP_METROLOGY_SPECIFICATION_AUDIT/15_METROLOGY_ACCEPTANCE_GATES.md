# Metrology Acceptance Gates

| Gate | Pass evidence | Current status |
|---|---|---|
| M1 frame contract | all frames, transform direction, access and uncertainty roles explicit | `PASS` |
| M2 ground truth | selected stage calibration closes `u_GT <= rho_GT tau_task`, including timing/mounting | `CONDITIONAL` |
| M3 optical identifiability | frozen fiducial/camera geometry passes pose-envelope rank, branch and conditioning audit | `CONDITIONAL` |
| M4 synchronization | hardware timing architecture and calibrated residual meet `tau_sync/omega_max` allocation | `CONDITIONAL` |
| M5 IMU calibration | actual IMU bias/noise/scale/temperature/extrinsic characterization meets dropout allocation | `CONDITIONAL` |
| M6 error budget | joint systematic/random budget closes below external requirement with margin | `CONDITIONAL` |
| M7 external task tolerance | independent owner fixes tolerance, coverage, latency and decision costs | `CONDITIONAL` |
| M8 reference pipeline | competent PnP + preintegration + fixed-lag factor-graph contract and baselines defined | `PASS` |

`PASS` here means the design text for that gate is complete, not that hardware has
been verified. All eight gates must pass in a later independent review before any
experiment authorization. M2–M7 require external or selected-component evidence
that this audit is forbidden to invent.

No weighted gate score is allowed. One unresolved critical gate blocks the chain.
In particular, good optical geometry cannot compensate for weak truth, and a good
error budget cannot create an external task tolerance.

