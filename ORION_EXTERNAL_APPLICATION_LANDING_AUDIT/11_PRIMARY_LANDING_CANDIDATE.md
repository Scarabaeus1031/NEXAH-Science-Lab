# Primary Landing Candidate

## Candidate

`SPACECRAFT_ATTITUDE_KNOWLEDGE_CONTINUITY_UNDER_OPTICAL_ATTITUDE_SENSOR_OUTAGE`

This candidate is primary because its task, optical/inertial observations,
outages, validity flags, reacquisition and consequences exist independently and
are documented by official space-engineering sources.

`SOURCE_FACT`: ECSS requires mission pointing and safe-attitude capability, while
leaving numerical performance to tailored project requirements
([ECSS-E-ST-60-30C](https://ecss.nl/standard/ecss-e-st-60-30c-satellite-attitude-and-orbit-control-system-aocs-requirements/)).
ECSS star-sensor requirements define correct, false and invalid attitude-solution
probabilities and recovery/settling concepts
([ECSS-E-ST-60-20C](https://ecss.nl/wp-content/uploads/2019/05/ECSS-E-ST-60-20C_Rev.2%2815May2019%29.pdf)).
NASA documents natural star-tracker loss mechanisms and IMU/Kalman propagation
([NASA GNC](https://www.nasa.gov/smallsat-institute/sst-soa/guidance-navigation-and-control/)).

## Why this is not a confirmed landing

1. No mission, AOCS group or instrument owner has supplied `tau_task`, `t_max`,
   validity probabilities or action consequences.
2. The reduced fiducial-camera bench does not reproduce star catalog matching,
   celestial backgrounds, radiation, glare or flight dynamics.
3. A single-axis stage validates only metrology and one-dimensional propagation,
   not spacecraft `SO(3)` attitude performance.
4. Star-tracker/gyro Kalman filtering and safe/reacquisition logic are mature; no
   unresolved incremental research value is established.
5. No inherited process population maps mission outage distributions to the bench.

Verdict: the external problem is real and the laboratory analogy plausible, but
external owner validation is mandatory before adopting the application name or
requirements.

