# Minimum Viable Scientific Prototype

## Bench configuration

The smallest defensible platform is:

1. rigid, nonmagnetic probe body;
2. asymmetric calibrated fiducial with at least four points;
3. synchronized six-axis IMU rigidly mounted to it;
4. global-shutter calibrated camera;
5. calibrated two- or three-axis rotary stage with independent encoders;
6. shared trigger/timestamp acquisition;
7. rigid metrology fixture and environmental log.

No five-star housing, constant weights, compass needle, magnetic stabilization,
force/pressure/temperature sensor or triple beams are needed. Temperature may be
logged if IMU/geometry drift makes it relevant.

## What the MVP can answer

- whether optical pose meets a prespecified orientation tolerance;
- whether optical+IMU fusion improves dynamic/dropout estimation over direct
  optical and inertial baselines;
- which state directions become unobservable under each dropout;
- whether uncertainty supports safe `USE/ABSTAIN/REMEASURE` decisions.

It cannot establish NEXAH distinctness, full compass viability, free-motion
dynamics or general translation principles.

## Acceptance prerequisites—not authorization

Before any experiment: select the external pointing task, freeze the coordinate
frames/observation equations and uncertainty target, obtain component calibration
specifications, conduct a design safety review and preregister comparator and
dropout rules. This audit authorizes none of those actions or a build.

The MVP exists conceptually and is intentionally a conventional metrology bench.
That simplicity is necessary to separate estimator behavior from decorative or
mechanical confounds.

