# 16 — Minimal Model and Neutral Relabel Decision

## Minimal model

The recoverable structure is typed by:

`FRAME, AXIS, RADIUS, ANGLE, ROTATION, DIRECTION, COUPLING, CONTACT, TRANSLATION, RETURN_RELATION`.

Shaft, wheel, clutch, and Cardan joint are domain-specific physical realizations/components, not new universal core types. Angular velocity and trace are fields needed when recording motion/execution, not evidence of a new operator.

The model explains:

- stick/pole as axis/reference/connector representations;
- R/2R as radius/diameter when registered;
- radial and angular coordinates as distinct;
- forward/backward as frame-relative;
- roll as rotation–translation coupling under contact constraints;
- shaft/coupling/clutch/Cardan roles as standard mechanisms;
- EMP-03 return as a separately typed involutive radial relation;
- vehicle/ground descriptions as frame changes.

`MINIMAL_MODEL_SUFFICIENT=YES`.

## Neutral relabel

```text
A = reference frame
L = axis
r = radial coordinate
theta = angular coordinate
C = coupling
S = rotating member
W = wheel
G = ground contact
T = translation state
```

The mechanism and return relation remain understandable after removing NEXAH, ROLL, RAD, FORWARD, RETURN, K, KK, AUTO, CLASS, and STICK. Their surviving content is generic geometry/mechanics.

`NEUTRAL_RELABEL_SURVIVES=YES`.

Quaternion, hidden dimension, universal spine, prime control, and new operator are unnecessary.

