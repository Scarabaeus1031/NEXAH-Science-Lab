# Application-Domain Survey

| Domain | Independent problem | Initial disposition |
|---|---|---|
| spacecraft/payload attitude | optical attitude sensors can lose valid solutions; inertial propagation and safe/reacquisition decisions are mission-critical | serious candidate |
| stabilized imaging / antenna pointing | pan/tilt pointing, encoders, inertial stabilization and target/feature loss occur operationally | serious candidate, owner-specific |
| optical rigid-body tracking qualification | pose error and latency have standardized test methods; occlusion is natural | serious metrology candidate |
| UAV/autonomous navigation | visual-inertial state estimation and visual degradation are real; EuRoC supplies synchronized sensors/truth | reject as primary: full 6DOF and no inherited task tolerance |
| industrial robot/rotary-axis metrology | standards cover pose/axis accuracy and repeatability | reject as research landing: fusion/dropout decision is not native |
| AR/VR tracking | optical-inertial tracking and prediction timing are native | reject as primary: full 6DOF; OpenXR defines timing semantics, not an application error limit |
| medical/instrument tracking | pose can be safety-critical and occlusion/remeasurement meaningful | reject pending a named clinical owner/regulatory task; single axis is not representative |
| telescope/scientific pointing | external pointing/stability requirements exist project by project | merge with spacecraft/stabilized pointing candidate |
| surveying/laboratory positioning | traceability and accuracy are native | reject: temporary optical-inertial fusion/dropout is not generally the task |
| generic robotics/machine vision | broad fit | reject as too unconstrained to supply external thresholds |

`SOURCE_FACT`: EuRoC contains stereo images, 200 Hz IMU data, calibration and
motion-capture/laser-tracker truth, while documenting synchronization limitations
([ETH dataset](https://projects.asl.ethz.ch/datasets/euroc-mav/),
[primary paper](https://doi.org/10.1177/0278364915620033)).

`SOURCE_FACT`: ISO 230-2 defines direct tests of positioning accuracy and
repeatability for linear and rotary NC axes
([ISO 230-2](https://www.iso.org/standard/55295.html)); ISO 9283 defines industrial
robot performance criteria and tests
([ISO 9283](https://www.iso.org/standard/22244.html)).

`AUDIT_INFERENCE`: those standards justify stage/robot metrology but do not by
themselves create an optical-dropout decision problem.

