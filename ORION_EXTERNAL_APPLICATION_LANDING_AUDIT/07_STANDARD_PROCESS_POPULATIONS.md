# Standard Process Populations

| Source population/procedure | What is inherited | Fit and limitation |
|---|---|---|
| ECSS AOCS/star-sensor requirements | pointing/knowledge error classes, validity probabilities, recovery and real-time distinctions | strong requirement vocabulary; no universal mission trajectory/tolerances |
| ASTM E3124 optical-tracker latency | standardized latency measurement procedure | active and relevant; not dropout/fusion population |
| ASTM E3064 / reinstatement work item | pose-error artifact/motion procedures | direct optical metrology; withdrawn status and no IMU/dropout |
| ISO 230-2 | repeated single-axis positioning tests and uncertainty treatment | strong stage-metrology control, not application/fusion benchmark |
| EuRoC MAV | real stereo/IMU trajectories, calibrations and independent truth | strong VIO comparator dataset; full 6DOF and no external ACCEPT threshold |
| TUM VI | synchronized visual/IMU sequences with motion-capture truth for some sequences | established VIO stress data; not a pointing/dropout decision contract |

Sources: [ECSS AOCS](https://ecss.nl/standard/ecss-e-st-60-30c-satellite-attitude-and-orbit-control-system-aocs-requirements/),
[ECSS star sensor](https://ecss.nl/wp-content/uploads/2019/05/ECSS-E-ST-60-20C_Rev.2%2815May2019%29.pdf),
[ASTM E3124](https://store.astm.org/Standards/E3124.htm),
[ISO 230-2](https://www.iso.org/standard/55295.html),
[EuRoC](https://projects.asl.ethz.ch/datasets/euroc-mav/),
[TUM VI](https://cvg.cit.tum.de/data/datasets/visual-inertial-dataset).

`AUDIT_INFERENCE`: useful inherited controls exist, but there is no single
established population matching spacecraft optical-attitude outage, the reduced
fiducial bench and an external decision contract. Process-population status is
therefore `PARTIAL`; trajectories must not be designed after seeing method
performance.

