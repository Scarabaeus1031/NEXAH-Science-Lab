# Ground-Truth Contract

## Definition

The reference orientation is

```text
R_GT(t) = R_WS(theta_E(t), kappa_S) R_SB
```

where `theta_E` is the independently timestamped encoder reading and `kappa_S`
contains calibrated axis, zero, eccentricity/runout and kinematic corrections.
Its uncertainty `Sigma_GT(t)` is expressed in the tangent space of `SO(3)` and
includes encoder, stage, mounting and timing contributions with correlations.

The encoder is independent only if its readout and calibration are unavailable to
the evaluated estimators and its sensor pathway is not reused as an input.

## Required uncertainty contributors

- resolution/quantization—never labeled accuracy;
- specified and calibrated angular accuracy;
- bidirectional repeatability, hysteresis and backlash;
- radial/axial runout, axis tilt and wobble;
- structural compliance and load-dependent deflection;
- `T_SB` mounting eccentricity/repeatability;
- thermal drift and warm-up state;
- encoder interpolation and electronics latency;
- timestamp offset, drift and jitter.

## Dominance requirement

Before component selection, an external metrology allocation must fix

```text
u_GT <= rho_GT * tau_task,   with rho_GT << 1,
```

at a named confidence/coverage level. No numeric `rho_GT` is invented here. The
future owner must select it so reference uncertainty is demonstrably subdominant
to the smallest scored error/tolerance, including timing at maximum angular rate.

Traceable calibration records, environmental range, validity interval and an
independent verification method are mandatory. An encoder data sheet alone does
not close this contract.

