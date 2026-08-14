# Final ORION External Application Landing Audit

## Decision

An independently existing problem has been found, but an ORION landing has not
been confirmed. The strongest candidate is spacecraft attitude-knowledge
continuity during temporary optical attitude-sensor loss. The task exists without
ORION/NEXAH; standards define pointing/knowledge error classes, validity
probabilities and recovery concepts, and official NASA guidance documents natural
star-tracker loss plus IMU/Kalman propagation.

The missing fields are decisive. No mission/task owner has supplied a numerical
pointing tolerance, latency, required reliability, acceptable outage population
or decision consequences. The reduced fiducial bench is only a laboratory analogue
and omits star identification, celestial scene effects and flight dynamics. Its
single-axis stage is a metrology precursor, not spacecraft-attitude validation.

Two alternatives were retained: stabilized camera/antenna pointing has stronger
single-axis relevance but weaker optical-dropout motivation; hybrid optical-
inertial tracker qualification matches the apparatus and standardized pose/latency
tests but lacks an external task threshold. These mismatches prevent declaring a
completed landing.

The strongest conventional methods are already mature. The only possible residual
question—calibration/integrity of uncertainty and validity decisions during a
natural outage population—is `UNCLEAR` until a domain owner states that current
qualification practice does not answer it.

## Evidence boundary

- `SOURCE_FACT`: ECSS defines mission-tailored AOCS pointing/knowledge and
  star-sensor correct/false/invalid-solution metrics
  ([AOCS](https://ecss.nl/standard/ecss-e-st-60-30c-satellite-attitude-and-orbit-control-system-aocs-requirements/),
  [star sensor](https://ecss.nl/wp-content/uploads/2019/05/ECSS-E-ST-60-20C_Rev.2%2815May2019%29.pdf)).
- `SOURCE_FACT`: NASA describes optical-sensor loss from field of view, rate, light
  and glare, with IMU-propagated Kalman filtering
  ([NASA GNC](https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/)).
- `AUDIT_INFERENCE`: these facts justify owner outreach, not requirement adoption,
  hardware construction or experiment authorization.

The only permitted next action is external review of the unsigned blank contract
by an independent spacecraft AOCS/star-sensor qualification owner. If no such
owner confirms the task and bench relevance, reclassify ORION as a standard
metrology demonstrator or stop this application path.

```text
INDEPENDENT_APPLICATION_FOUND = PARTIAL
APPLICATION_EXISTS_WITHOUT_NEXAH = YES
APPLICATION_EXISTS_WITHOUT_ORION = YES
EXTERNAL_POINTING_REQUIREMENT_FOUND = PARTIAL
EXTERNAL_LATENCY_REQUIREMENT_FOUND = PARTIAL
EXTERNAL_RELIABILITY_REQUIREMENT_FOUND = PARTIAL
NATURAL_SENSOR_DROPOUT_EXISTS = YES
INDEPENDENT_GROUND_TRUTH_FEASIBLE = YES
STANDARD_PROCESS_POPULATION_FOUND = PARTIAL
STRONGEST_CONVENTIONAL_SOLUTION_DEFINED = YES
NONTRIVIAL_RESEARCH_QUESTION_REMAINS = UNCLEAR
SINGLE_AXIS_FIRST_STAGE_EXTERNALLY_RELEVANT = PARTIAL
APPLICATION_SELECTION_CHERRY_PICKING_RISK = HIGH
INDEPENDENT_TASK_OWNER_IDENTIFIED = NO
SIGNED_EXTERNAL_CONTRACT_EXISTS = NO
NEXAH_METHOD = UNDEFINED
HARDWARE_BUILD_AUTHORIZED = NO
IMPLEMENTATION_AUTHORIZED = NO
EXPERIMENT_AUTHORIZED = NO
PREREGISTRATION_AUTHORIZED = NO

PRIMARY_APPLICATION = SPACECRAFT_ATTITUDE_KNOWLEDGE_CONTINUITY_UNDER_OPTICAL_ATTITUDE_SENSOR_OUTAGE
FINAL_DECISION = EXTERNAL_ORION_LANDING_PLAUSIBLE_BUT_UNCONFIRMED
NEXT_ACTION = SEND_THE_UNSIGNED_BLANK_CONTRACT_TO_AN_INDEPENDENT_SPACECRAFT_AOCS_OR_STAR_SENSOR_QUALIFICATION_OWNER_FOR_ACCEPT_REVISE_OR_REJECT_REVIEW
```
