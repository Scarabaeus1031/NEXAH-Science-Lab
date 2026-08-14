# IMU Observation Model

## Gyroscope

```text
omega_m(t) = M_g omega_I(t) + b_g(t) + n_g(t),
dot(b_g)   = w_bg.
```

`M_g` contains scale-factor, non-orthogonality and residual axis-misalignment
terms; `n_g` is rate noise and `w_bg` a declared bias-evolution model. Required
characterization includes turn-on bias, in-run bias instability, angle/random
walk representation, saturation, bandwidth/group delay and temperature dependence.

## Accelerometer

If used:

```text
a_m(t) = M_a R_IW(t) (a_W(t)-g_W) + b_a(t) + n_a(t).
```

Accelerometer-derived tilt is valid only when translational acceleration and
rotational lever-arm acceleration are modeled or negligible. Arbitrary linear
acceleration is observationally confounded with gravity. For the single-axis
Stage 1, accelerometer data is a diagnostic/quasi-static check, not required for
the primary fusion state.

## State rule

Retain `[q,omega,b_g]` as the minimal Stage-1 state. Treat calibrated `M_g`, IMU
latency and `R_BI` as nuisance/calibration parameters. Add `b_a` to the estimator
state only if accelerometer factors are enabled; doing so triggers a new
identifiability check.

No data-sheet noise density is accepted as end-to-end orientation uncertainty.
Characterization must cover the actual sample rate, filtering, temperature and
mounting after hardware selection.

