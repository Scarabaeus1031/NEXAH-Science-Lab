# Scope and Authorization Boundary

This is a design-only audit of the reduced ORION MVP measurement contract. It
defines what a future system would measure, relative to which frames, with what
uncertainty structure and against which acceptance gates.

It does not authorize or perform hardware procurement/building, CAD/CNC work,
software or firmware implementation, simulation, synthetic-data generation,
preregistration or experimentation. Canonical NEXAH and all previous ORION/T02
artifacts remain unchanged.

The allowed apparatus is only a nonmagnetic rigid body, asymmetric fiducial, IMU,
global-shutter camera and independently encoded rotary stage. Five-star geometry,
special-constant weighting, triple beams, magnetic stabilization and symbolic
NEXAH terminology are excluded.

The platform must be valid without NEXAH. Its purpose is measurement truth:

```text
physical orientation -> calibrated observations -> uncertainty
                     -> estimate -> external decision
```

This document set is a specification audit, not a frozen specification. Any gate
marked `CONDITIONAL` blocks all downstream authorization.

