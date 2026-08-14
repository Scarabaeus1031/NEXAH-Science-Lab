# Uncertainty and Calibration

## Orientation error

Use the geodesic `SO(3)` distance:

```text
c   = clamp((trace(R_GT^T R_hat)-1)/2, -1, 1)
e_R = acos(c).
```

Compute internally in radians. Report degrees only as a labeled conversion. Clamp
for floating-point stability. Near zero/pi, use a stable rotation-log or quaternion
implementation; with quaternions use `abs(q_GT dot q_hat)` so sign ambiguity does
not create error. Euler components are secondary diagnostics only.

## Native uncertainty and common interface

Each estimator returns `R_hat` plus a methodologically appropriate object: tangent-
space covariance, confidence/credible region, particle set, conformal set or
calibrated probability. Do not force false equivalence between them.

The common decision interface is

```text
p_adequate(t) = declared probability/support that e_R <= tau_task,
action in {ACCEPT, ABSTAIN, REMEASURE}.
```

The owner eventually fixes `alpha`; an `ACCEPT` declaration must target

```text
P(e_R <= tau_task | declared adequate) >= 1-alpha.
```

## Calibration assessment

On held-out independent trajectories report coverage/reliability by regime,
selective coverage conditional on non-abstention, overconfidence, underconfidence,
abstention rate, unsafe acceptance and remeasurement rate. Calibration data cannot
be reused for confirmatory scoring. Low mean point error does not compensate for
catastrophic overconfidence.

