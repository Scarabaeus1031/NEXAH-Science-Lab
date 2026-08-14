# Final ORION MVP Metrology Specification Audit

## Decision

The reduced ORION measurement chain is scientifically specifiable, but its
specification remains conditional. The measurand, minimum state, frame graph,
`SO(3)` error, optical/IMU models, dropout states, uncertainty interface, error-
budget structure and strongest conventional reference pipeline can all be defined
before collecting data.

The first stage should be single-axis. It can isolate encoder truth, optical
orientation, gyro propagation, timing and dropout drift with much less gauge and
mechanical uncertainty. It cannot validate general 3-DOF observability or full
IMU extrinsics; claims and calibration must remain restricted accordingly.

Six blocking items remain: no independent pointing tolerance/decision costs; no
selected stage with a traceable uncertainty budget; no frozen fiducial/camera
geometry; no hardware timing architecture; no actual IMU characterization; and
no closed combined uncertainty budget. Therefore no build, implementation,
preregistration or experiment is authorized.

## Measurement contract retained

- Measurand: `R_WB(t)` relative to declared laboratory frame `W`.
- State: `[q_WB, omega_B, b_g]`; accelerometer bias enters only if acceleration
  factors are later enabled.
- Truth: encoder-driven `R_WS(t) R_SB` with tangent-space uncertainty and no
  estimator access.
- Primary error: numerically stable geodesic distance on `SO(3)`.
- Observations: identified asymmetric fiducials plus bias-aware gyro/IMU samples
  on a common calibrated time scale.
- Actions: `ACCEPT`, `ABSTAIN`, `REMEASURE`, governed by an external tolerance and
  calibrated adequacy probability.
- Reference: robust optical reprojection/PnP plus IMU preintegration in a
  factor-graph/fixed-lag smoother, with competent simpler baselines.
- NEXAH: absent and undefined; the platform remains valid without it.

## Only permitted next action

Obtain a signed independent single-axis task/tolerance/latency/coverage contract.
Without it, component requirements and uncertainty allocations would be internally
chosen and the platform risks becoming only a standard tutorial demonstrator.

```text
MEASURAND_DEFINED = YES
STATE_MINIMAL = YES
COORDINATE_FRAMES_COMPLETE = YES
GROUND_TRUTH_INDEPENDENT = YES
GROUND_TRUTH_UNCERTAINTY_BOUND_DEFINED = YES
EXTERNAL_POINTING_TOLERANCE_DEFINED = CONDITIONAL
SO3_ERROR_METRIC_DEFINED = YES
OPTICAL_MODEL_DEFINED = YES
FIDUCIAL_GEOMETRY_IDENTIFIABLE = CONDITIONAL
IMU_MODEL_DEFINED = YES
IMU_BODY_CALIBRATION_DEFINED = YES
CAMERA_EXTRINSICS_DEFINED = YES
SYNCHRONIZATION_CONTRACT_DEFINED = YES
DROPOUT_CONDITIONS_DEFINED = YES
ABSTENTION_ALLOWED = YES
UNCERTAINTY_OUTPUT_REQUIRED = YES
ERROR_BUDGET_STRUCTURE_COMPLETE = YES
DOMINANT_ERROR_SOURCES_INDEPENDENTLY_MEASURABLE = UNCLEAR
STRONGEST_REFERENCE_PIPELINE_DEFINED = YES
NEXAH_METHOD = UNDEFINED
PLATFORM_VALID_WITHOUT_NEXAH = YES
SINGLE_AXIS_FIRST_STAGE_PREFERRED = YES
PRE_EXPERIMENT_IDENTIFIABILITY_ESTABLISHED = CONDITIONAL

M1_FRAME_CONTRACT = PASS
M2_GROUND_TRUTH = CONDITIONAL
M3_OPTICAL_IDENTIFIABILITY = CONDITIONAL
M4_SYNCHRONIZATION = CONDITIONAL
M5_IMU_CALIBRATION = CONDITIONAL
M6_ERROR_BUDGET = CONDITIONAL
M7_EXTERNAL_TASK_TOLERANCE = CONDITIONAL
M8_REFERENCE_PIPELINE = PASS

HARDWARE_BUILD_AUTHORIZED = NO
IMPLEMENTATION_AUTHORIZED = NO
EXPERIMENT_AUTHORIZED = NO
PREREGISTRATION_AUTHORIZED = NO
CANONICAL_NEXAH_CHANGE_AUTHORIZED = NO

FINAL_DECISION = ORION_MVP_SPECIFICATION_CONDITIONAL
NEXT_ACTION = OBTAIN_AN_INDEPENDENT_SIGNED_SINGLE_AXIS_POINTING_TOLERANCE_LATENCY_COVERAGE_AND_DECISION_COST_CONTRACT
```
