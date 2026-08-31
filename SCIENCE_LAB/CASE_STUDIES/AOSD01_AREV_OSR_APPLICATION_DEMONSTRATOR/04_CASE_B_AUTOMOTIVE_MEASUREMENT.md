# Case B — Automotive Instrument / Dashboard

This is an idealized standard-mechanics control only.

## Typed state

`VehicleState` contains vehicle speed `v`, engine angular velocity `omega_e`, effective gear ratio `i_g`, wheel radius `R`, selected gear, clutch state and named reference frames as applicable.

## Separate measurement chains

```text
VehicleState
 -> speed ObservationMap
 -> vehicle-speed ObservableDefinition
 -> speed MeasurementEvent
 -> MeasurementValue(value, km/h, uncertainty)
 -> speed Readout
 -> dashboard View
```

```text
VehicleState
 -> rpm ObservationMap
 -> engine-speed ObservableDefinition
 -> rpm MeasurementEvent
 -> MeasurementValue(value, rpm, uncertainty)
 -> rpm Readout
 -> dashboard View
```

Under an explicitly idealized engaged driveline with no slip,

```text
v = omega_e R / i_g.
```

With `R=0.30 m`, equal `v=15 m/s` can correspond to `omega_e=200 rad/s` at `i_g=4` and `100 rad/s` at `i_g=2`. Equal `omega_e=200 rad/s` can correspond to `v=15 m/s` and `30 m/s` under those ratios.

`RPM_EQUALS_SPEED=NO`

`SAME_SPEED_CAN_HAVE_DIFFERENT_RPM=YES_UNDER_DIFFERENT_GEAR_RATIOS`

`SAME_RPM_CAN_HAVE_DIFFERENT_SPEED=YES_UNDER_DIFFERENT_RATIOS_OR_WHEEL_CONDITIONS`

`DASHBOARD_VIEW_EQUALS_MECHANICAL_STATE=NO`
