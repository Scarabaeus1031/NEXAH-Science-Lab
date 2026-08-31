# Standard Geometry Control

For two unit directions `u1,u2` from common origin `O` meeting `r=R`:

`P1=O+R*u1`, `P2=O+R*u2`.

Then `|OP1|=|OP2|=R`. If the chord `P1P2` is admitted, `OP1P2` is isosceles and:

`c=2R sin(Delta_theta/2)`.

This control passes analytically. Six numerical spot checks also matched Cartesian point distance to floating-point tolerance.

For the historical admitted triangle motif:

- `COMMON_ORIGIN_CONFIRMED=YES_IMAGE_PLANE_VERTEX_ONLY`;
- `COMMON_RADIUS_CONFIRMED=NO`;
- `CHORD_PRESENT_OR_CONSTRUCTED=VISIBLE_BASE_SEGMENT_NOT_SHELL_CHORD`;
- `ISOSCELES_TRIANGLE_ADMISSIBLE=IMAGE_PLANE_ONLY_FOR_INDIVIDUAL_RENDERING_WITHIN_UNCERTAINTY`.

No constant-radius shell is recovered from the three TERRA renderings.

