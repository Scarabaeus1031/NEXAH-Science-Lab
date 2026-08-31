# Zero-readout Control

A displayed or measured zero is a typed value under a declared observable, calibration, unit and readout rule. It can arise from:

- a true zero of one observable;
- reference subtraction or offset calibration;
- a reset of one field;
- projection onto an insensitive component;
- rounding/resolution;
- display convention.

Therefore:

```text
READOUT=0
!= whole state equals reference state
!= system equals initial state
!= history is empty
!= nothing happened.
```

Example: after events `[e1,e2]`, a relative readout can be zero because final and reference scalar values match; the events remain registered.

`ZERO_READOUT_CONTROL_PASSED=YES`

`ZERO_READOUT_EQUALS_ZERO_STATE=NO_IN_GENERAL`

`ZERO_READOUT_EQUALS_EMPTY_HISTORY=NO`

`ZERO_READOUT_EQUALS_NOTHING_HAPPENED=NO`
