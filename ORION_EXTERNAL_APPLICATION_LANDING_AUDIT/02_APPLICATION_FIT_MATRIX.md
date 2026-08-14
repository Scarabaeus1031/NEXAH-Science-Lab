# Application-Fit Matrix

Qualitative ratings: `HIGH`, `MEDIUM`, `LOW`, or `PROJECT_SPECIFIC`.

| Criterion | Spacecraft attitude continuity | Stabilized camera/antenna | Hybrid optical tracker qualification |
|---|---|---|---|
| orientation task-critical | HIGH | HIGH | HIGH as measurand |
| optical observation natural | HIGH: star sensor | MEDIUM/HIGH: target/scene/fiducial | HIGH |
| inertial observation natural | HIGH | HIGH | MEDIUM/HIGH for hybrid tracker |
| natural dropout | HIGH: glare/FOV/rate/loss of solution | HIGH: occlusion/blur/target loss | HIGH: occlusion/visibility |
| independent ground truth | HIGH in rate-table/optical-stimulus lab | HIGH via encoders/metrology | HIGH via reference artifact/system |
| external tolerance | PROJECT_SPECIFIC; metric classes standardized | some explicit antenna standards; otherwise project-specific | user-specific, not fixed by test method |
| external latency/reacquisition | PROJECT_SPECIFIC; metrics exist | PROJECT_SPECIFIC | latency measurement standardized, limit user-specific |
| external reliability/coverage | metric classes standardized, values project-specific | mostly project-specific | not supplied by generic tracking test |
| abstention meaningful | HIGH: invalid flag/safe mode | HIGH: inhibit/hold | MEDIUM: reject pose |
| remeasurement meaningful | HIGH: reacquire stars/new solution | HIGH: reacquire target/repoint | HIGH: restore visibility/retrack |
| mature conventional solution | VERY HIGH | VERY HIGH | VERY HIGH |
| remaining research value | UNCLEAR: integrity under outages | LOW/UNCLEAR | UNCLEAR: hybrid dropout integrity |
| single-axis first stage | PARTIAL: metrology only | HIGH for pan/azimuth | PARTIAL: latency/calibration only |

`AUDIT_INFERENCE`: no candidate closes every external field. Spacecraft attitude
has the strongest independently existing failure-and-decision structure; tracker
qualification best matches the apparatus; antenna pointing best matches one axis.
That three-way split is evidence against declaring a completed landing.

