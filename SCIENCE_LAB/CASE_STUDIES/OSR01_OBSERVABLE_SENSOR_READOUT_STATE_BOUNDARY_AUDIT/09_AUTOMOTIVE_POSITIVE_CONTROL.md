# Automotive Positive Control

This is a standard-mechanics explanatory control only.

## Typed vehicle state

A registered state may contain engine angular velocity `omega_e`, selected gear `g`, effective gear ratio `i_g`, wheel radius `R`, vehicle speed `v`, clutch state `c` and a named frame.

- Tachometer: targets engine angular velocity, executes a measurement and displays rpm.
- Speedometer: targets vehicle translational speed, executes a measurement and displays km/h.
- Gear indicator: reads a discrete selected transmission state and displays a label.

Under an explicitly idealized engaged driveline with no slip,

```text
v = omega_e R / i_g.
```

For `R=0.30 m`:

- at the same `v=15 m/s`, ratios `i_g=4` and `i_g=2` correspond to `omega_e=200 rad/s` and `100 rad/s`;
- at the same `omega_e=200 rad/s`, those ratios correspond to `v=15 m/s` and `30 m/s`.

Thus neither speed nor rpm identifies the complete transmission state, and the two observables are not equal.

`AUTOMOTIVE_CONTROL_VALID=YES_UNDER_STATED_IDEAL_ASSUMPTIONS`

`RPM_EQUALS_SPEED=NO`

`GEAR_EQUALS_DIMENSION=NO`

`CLUTCH_EQUALS_GATE=NO`

`DISPLAY_EQUALS_STATE=NO`
