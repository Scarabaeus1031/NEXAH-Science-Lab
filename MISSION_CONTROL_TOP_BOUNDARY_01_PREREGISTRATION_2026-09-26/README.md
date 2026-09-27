# Mission Control — TOP-BOUNDARY-01 Preregistration Receipt

**Receipt date:** `2026-09-26`  
**Status:** `DIGITAL_RUN_COMPLETE / PARKED_AT_EQUIPMENT_GATE / PHYSICAL_NOT_EXECUTED / NO_SCIENTIFIC_RESULT`  
**Owning case:**
[`TOP_BOUNDARY_01_ORIENTATION_COMPLEMENT_INTERACTION_2026-09-26`](../SCIENCE_LAB/CASE_STUDIES/TOP_BOUNDARY_01_ORIENTATION_COMPLEMENT_INTERACTION_2026-09-26/00_README.md)

## Mission Control reading

The Science Lab has registered a bounded optics preregistration for orientation,
mask-complement closure and two-boundary interaction.

The case deliberately separates:

1. broadband/incoherent boundary and prism observations;
2. coherent single- and double-slit diffraction/interference.

The shared TOP role is bookkeeping and return. No common physical mechanism is
asserted.

## Current state

```text
CASE_ID                    = TOP-BOUNDARY-01
METHOD_CENTER              = TOP_EXISTING_ORIENTATION_INSTRUMENT
DOMAIN_AUTHORITY           = EXPERIMENTAL_OPTICS
PREREGISTRATION            = PRESENT
EQUIPMENT_BINDING          = ABSENT
EXECUTION                  = NOT_STARTED
PRIMARY_DATA               = NONE
SCIENTIFIC_RESULT          = NONE
NOVELTY_CLAIM              = NONE
TOP_THEORY_STATUS_CHANGE   = NONE
ACTIVE_EXPERIMENT_ALLOWED  = NO_UNTIL_EQUIPMENT_GATE
SYNTHETIC_DRY_RUN          = PASS_WITH_TYPED_ARTIFACTS
SUPERSAMPLING_CONVERGENCE  = CONVERGED_FOR_DRY_RUN
INTERACTION_LINEAGE        = ASSIGNED_TO_EXISTING_REPORT_FAMILY
PORTFOLIO_STATE            = PARKED_AT_EQUIPMENT_GATE
ACTIVE_GATE                = NONE
RESUME_AUTHORITY           = HUMAN_OWNER
```

## What was fixed

- eight orientations: `0, 45, 90, 135, 180, 225, 270, 315 degrees`;
- exact mask/complement pairs;
- separate and joint-boundary records;
- linear RAW/spectral evidence priority;
- orientation residual `rho_theta`;
- complement residual `epsilon_Q`;
- interaction residual `Delta_12`;
- calibration, localization and stop rules;
- explicit prior-art and claim boundaries.

## Next admissible action

Bind one real apparatus and its masks without changing the frozen primary
questions. Record exact source, wavelength/spectrum, mask dimensions, prism,
distances, detector, RAW settings, calibration procedure and tolerances.

If those fields cannot be bound, return:

```text
STOP_EQUIPMENT_NOT_BOUND
```

Mission Control may track the receipt and status. It does not own the optical
evidence and may not promote a future structured residual into new physics.

## Synthetic return

The bounded dry-run return is recorded in
[`02_DRY_RUN_RETURN.md`](02_DRY_RUN_RETURN.md). It changes no physical evidence
or theory status.

The supersampling return is recorded in
[`03_CONVERGENCE_RETURN.md`](03_CONVERGENCE_RETURN.md). The relation-lineage
assignment is recorded in
[`04_RELATION_LINEAGE_RECEIPT.md`](04_RELATION_LINEAGE_RECEIPT.md).

The complete case is returned and parked by
[`05_PARKING_AND_HANDOFF.md`](05_PARKING_AND_HANDOFF.md). The earlier equipment
binding recommendation is retained only as a possible future resume gate; it
is not currently active.

The Human Owner subsequently resumed the bounded digital analysis in
[`06_RESUME_RECEIPT.md`](06_RESUME_RECEIPT.md). This supersedes the parked state
for Dry Run 03 only; the physical equipment gate remains closed.

Dry Run 03 is returned in
[`07_PRIMARY_INTERACTION_RETURN.md`](07_PRIMARY_INTERACTION_RETURN.md). The
completed case is parked at the physical equipment gate by
[`08_REPARK_AT_EQUIPMENT_GATE.md`](08_REPARK_AT_EQUIPMENT_GATE.md).

The read-only comparison against canonical Mission Control `CURRENT/`,
including the permitted NEXAH status delta and the still-missing canonical
registration, is recorded in
[`09_MISSION_CONTROL_STATUS_IMPACT_REVIEW.md`](09_MISSION_CONTROL_STATUS_IMPACT_REVIEW.md).
