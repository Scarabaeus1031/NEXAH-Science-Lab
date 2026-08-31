# 10 — Rolling Contact Control

For an ideal rigid wheel of radius `R` rolling without slipping on a stationary surface, the contact point is instantaneously at rest in the ground frame and

`v_CM=ωR`

with signs set by the declared orientation convention.

This is a kinematic constraint coupling center translation to wheel rotation through radius. Dimensional units remain distinct: `v` is length/time and `ω` is angle/time.

```text
ROTATION_TO_TRANSLATION_COUPLING=SUPPORTED_STANDARD_MECHANICS
IDEAL_ROLLING_RELATION_SUPPORTED=YES
ROLLING_RELATION=v=omega*R
ROTATION_EQUALS_TRANSLATION=NO
omega_EQUALS_v=NO
R_EQUALS_OPERATOR=NO
WHEEL_EQUALS_TRANSPORT=NO
CONTACT_EQUALS_TRANSPORT=NO
```

The relation does not apply unchanged under slip, deformation, arbitrary contact geometry, or a moving surface; those require additional mechanics.
