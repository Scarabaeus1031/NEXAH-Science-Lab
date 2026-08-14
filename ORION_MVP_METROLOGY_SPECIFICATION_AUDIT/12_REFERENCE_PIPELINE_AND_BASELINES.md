# Reference Pipeline and Baselines

## Strongest conventional reference

```text
identified optical points -> calibrated reprojection/PnP factors
IMU samples              -> bias-aware preintegrated rotation factors
calibration priors        -> T_WC, T_BF, T_BI with uncertainty
all factors               -> SO(3) factor graph / fixed-lag smoother
posterior + quality       -> ACCEPT / ABSTAIN / REMEASURE
```

The reference includes robust outlier handling, calibrated noise/bias models,
timestamp/latency treatment, stage-independent calibration and tangent-space
uncertainty. Fixed lag and compute deadline are part of the external contract.
Smoothing is a bounded-latency reference, not silently compared with causal
real-time methods under unequal delay.

## Secondary competent baselines

- optical-only robust PnP/nonlinear reprojection fit;
- bias-corrected gyro integration during known dropout;
- complementary filter where accelerometer assumptions hold;
- error-state EKF;
- UKF where nonlinear uncertainty warrants it.

Each uses the same measurements/calibrations and gets appropriate tuning resources.
Weak defaults and denied extrinsics are prohibited. Optical-only and gyro-only are
diagnostic lower-information baselines, not straw competitors.

## Separation rule

```text
NEXAH_METHOD = UNDEFINED
```

No NEXAH estimator is created here. The measurement chain, ground truth, failure
conditions and conventional reference remain complete if the name NEXAH is
deleted. That independence is a design success.

