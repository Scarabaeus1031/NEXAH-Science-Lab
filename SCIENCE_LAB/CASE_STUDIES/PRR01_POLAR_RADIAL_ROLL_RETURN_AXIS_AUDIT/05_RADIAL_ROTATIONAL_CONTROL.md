# 05 — Radial / Rotational Control

In cylindrical/polar coordinates, radial and angular changes are different coordinates:

- radial change: `r→r'`;
- angular change: `θ→θ'`.

A point can rotate with fixed `r`; it can move radially with fixed `θ`; or a constraint can couple both. Coupling is a relation, not identity.

`RADIAL_EQUALS_ROTATIONAL=NO`  
`ROLL_EQUALS_RADIAL=NO`  
`ROTATION_ABOUT_AXIS_EQUALS_TRANSLATION_ALONG_AXIS=NO`

For a helix, screw, cam, rolling wheel, or constrained mechanism, an equation can link angular and linear variables. The link depends on geometry/contact/pitch and does not create a universal operator.

