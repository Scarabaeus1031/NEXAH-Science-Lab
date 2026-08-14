# Final ORION Scientific Viability Audit

## Decision

The current ORION Compass concept requires major redesign before it can be treated
as a scientific platform. A real measurement problem survives—orientation
observability and calibrated decisions under optical/IMU dropout—but the clean
instrument for that question is a conventional rigid fiducial/IMU body on an
independently encoded rotary stage.

The existing compass geometry is not required. Its five-star housing is aesthetic;
the `pi/phi/sqrt(2)` mass choices are statically balanceable but physically
arbitrary; the current ring dimensions conflict across source files; and numerical
“drift buffer” claims lack an error model. A sapphire pivot is not frictionless,
gravity leveling fails under linear acceleration, and gimbals introduce backlash,
stiction, resonance and cable torque.

Triple-beam orientation is locally feasible only with calibrated asymmetric
geometry and reliable correspondence, but it offers no demonstrated advantage
over an established asymmetric multi-point fiducial. Color/coding normally solves
spot identity, so unknown correspondence should not be manufactured. Passive
magnetic stabilization is unjustified for the MVP and conflicts directly with a
clean magnetometer channel.

## Scientific remainder

The minimal state is body orientation, angular velocity and gyro bias. Optical
fiducials provide an absolute pose reference when visible; gyros bridge short
gaps; accelerometers constrain gravity direction under known dynamics; and a
magnetometer is optional only in a magnetically clean system. Force, pressure,
temperature and light do not independently constrain the minimal state without a
validated coupling.

Independent encoder or motion-capture truth is feasible. The strongest comparator
is a conventional factor-graph/fixed-lag smoother, with competent EKF/UKF,
complementary, optical PnP and selective-decision baselines. NEXAH method
distinctness is not established: present terms translate to ordinary likelihood,
dynamics, non-identifiability, uncertainty and abstention machinery.

## Authorization boundary

This audit does not authorize a build or experiment. The next action is a
design-only metrology specification for the reduced nonmagnetic fiducial+IMU
rotary-stage MVP, including an external pointing tolerance, observation equations,
ground-truth uncertainty and synchronization contract. The full compass must not
be built first.

```text
PHYSICAL_STATE_WELL_DEFINED = YES
MINIMAL_TASK_WELL_DEFINED = YES
INDEPENDENT_GROUND_TRUTH_FEASIBLE = YES
OPTICAL_ORIENTATION_RECONSTRUCTION_FEASIBLE = YES
ROLL_OBSERVABLE = CONDITIONAL
UNKNOWN_CORRESPONDENCE_NONTRIVIAL = NO
PARTIAL_OBSERVABILITY_SCIENTIFICALLY_MEANINGFUL = YES
SENSOR_DROPOUT_TESTABLE = YES
ERROR_BUDGET_CONTROLLABLE = UNCLEAR
TIME_SYNCHRONIZATION_CONTROLLABLE = YES
MAGNETIC_STABILIZATION_SCIENTIFICALLY_JUSTIFIED = NO
MAGNETIC_SENSING_COMPATIBLE_WITH_STABILIZATION = NO
MECHANICAL_COMPASS_GEOMETRY_REQUIRED = NO
PI_PHI_SQRT2_WEIGHTING_PHYSICALLY_JUSTIFIED = NO
STRONGEST_CONVENTIONAL_COMPARATORS_DEFINED = YES
NEXAH_METHOD_DISTINCTNESS_ESTABLISHED = NO
DOWNSTREAM_DECISION_LOSS_EXTERNALLY_DEFINABLE = PARTIAL
MINIMUM_VIABLE_PROTOTYPE_EXISTS = YES
FULL_HARDWARE_BUILD_AUTHORIZED = NO
EXPERIMENT_AUTHORIZED = NO
NEXAH_CANONICAL_CHANGE_AUTHORIZED = NO

FINAL_DECISION = ORION_REQUIRES_MAJOR_REDESIGN
NEXT_ACTION = WRITE_A_DESIGN_ONLY_METROLOGY_SPECIFICATION_FOR_A_NONMAGNETIC_FIDUCIAL_IMU_ROTARY_STAGE_MVP_WITH_EXTERNAL_POINTING_TOLERANCE_AND_GROUND_TRUTH_UNCERTAINTY
```
