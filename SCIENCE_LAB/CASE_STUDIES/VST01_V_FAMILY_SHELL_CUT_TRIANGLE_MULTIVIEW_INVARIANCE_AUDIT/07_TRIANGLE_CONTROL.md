# Triangle Control

A V branch pair has two branches. A triangle additionally requires a third side connecting two distinct points.

`V_EQUALS_TRIANGLE=NO`

`V_PLUS_SHELL_IMPLIES_TRIANGLE=CONDITIONAL`

The conditional is satisfied only if:

1. both rays share the registered origin;
2. both intersect the same shell `r=R` at distinct points;
3. the connecting chord is admitted.

Under those assumptions, equal radii support the standard isosceles relation. VST-01 does not verify that EXP20-B meets the assumptions.

