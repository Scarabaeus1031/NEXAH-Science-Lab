# External Pointing-Tolerance Contract

The decision threshold `tau_task` must come from an application owner, established
instrument requirement or independently specified control/pointing need. It may
not be chosen from observed PnP, IMU, smoother or future NEXAH performance.

For the geodesic orientation error `e_R(t)`, define truth adequacy:

```text
A_t = 1[e_R(R_GT(t), R_hat(t)) <= tau_task].
```

The owner contract must also state:

- whether tolerance applies instantaneously, for a percentile, continuously over
  an interval, or after a settling time;
- motion/temperature/visibility operating envelope;
- latency deadline and maximum permitted dropout duration;
- confidence level `1-alpha` for an adequacy declaration;
- independent costs/ordering of unsafe `ACCEPT`, `ABSTAIN`, `REMEASURE` and delay;
- whether a one-axis tolerance is a genuine external task or only a calibration
  milestone.

No such owner-issued tolerance currently exists. The measurement equations can be
specified symbolically, but the decision layer and numerical error allocation
remain conditional. A tutorial-style internally convenient threshold cannot
substitute for this gate.

The owner must also fix a common loss, for example only at the structural level:

```text
L(ACCEPT,x)    = c_error * e_R + c_unsafe * 1[e_R > tau_task]
L(ABSTAIN,x)   = c_abstain
L(REMEASURE,x) = c_measure + post_measurement_loss.
```

No coefficient is assigned here, and all methods receive identical actions and
costs.

`EXTERNAL_POINTING_TOLERANCE_DEFINED = CONDITIONAL`.
