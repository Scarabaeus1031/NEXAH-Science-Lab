# Mechanical Design Audit

## Existing design findings

| Feature | Assessment | Reason |
|---|---|---|
| five-star outer housing | neutral/aesthetic, potentially harmful | not needed for sensing; complicates mounting and metrology |
| dual gimbal | potentially useful only for a later free-motion plant | adds friction, backlash, stops and coupled modes to the MVP |
| central sapphire pivot | low-friction bearing candidate, not “frictionless” | preload, wear, stiction and shock sensitivity require measurement |
| three unequal constant weights | statically balanceable but physically arbitrary | the listed mass-radius products are approximately equal at 120°, but constants add no function and may create anisotropic inertia |
| magnetic needle | conventional heading display, harmful near magnetometer | introduces hard-iron/permanent-field disturbance |
| low center of mass | gravity restoring torque | does not remain “absolutely horizontal” under vehicle acceleration |
| wire-connected moving platform | harmful unless managed | cable torque and fatigue bias motion |

The source specifications conflict: one coordinate file lists 90/80 mm gimbal
rings, while the manufacturing document lists 110/90 mm. Claims of ±0.01 mm,
fixed settling time, 0.087–0.41% “drift buffer” and workshop readiness lack a
tolerance stack, damping model and validation basis. A two-axis gimbal plus a
tilting central needle can also be kinematically ambiguous or overconstrained.

## Required mechanical characterization

Friction/stiction, backlash, static and dynamic balance, inertia tensor, natural
frequencies, damping, cross-axis coupling, stop impacts, mounting compliance,
repeatability, cable torque, sensor alignment and temperature drift all need
traceable tests. The photorealistic image and schematic are not evidence of a
manufactured assembly.

For the MVP, replace the compass with a rigid asymmetric fiducial/IMU body on a
calibrated rotary stage. Reintroduce a gimbal only if free-motion dynamics becomes
an independently justified later question.

