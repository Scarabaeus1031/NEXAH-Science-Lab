# Shell-Intersection Geometry

This is a conditional standard-geometry control, not a recovered EXP result.

Let two rays from a common origin `O` have angular separation `Delta_theta`, with `0 <= Delta_theta <= pi`. Let both meet the constant-radius shell `r=R`, `R>0`, at `P1` and `P2`.

By the definition of the shell:

`|OP1|=|OP2|=R`.

Therefore, once the chord `P1P2` is admitted, triangle `OP1P2` is isosceles. Bisecting the central angle gives half-chord length `R sin(Delta_theta/2)`, hence:

`c=|P1P2|=2R sin(Delta_theta/2)`

and:

`c/R=2 sin(Delta_theta/2)`.

Degenerate cases `Delta_theta=0` and `Delta_theta=pi` require ordinary geometric interpretation; they do not create a nontrivial V family.

`CONSTANT_RADIUS_SHELL_SUPPORTED=YES_AS_STANDARD_MODEL`

`SHELL_INTERSECTIONS_RECOVERED=NO_SOURCE_OBJECT_UNAVAILABLE`

