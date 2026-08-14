# Synchronization Contract

Use one reference time scale `t_ref`, preferably a hardware clock/trigger visible
to camera, IMU acquisition and encoder capture. Preserve raw timestamps.

```text
t_C = a_C t_ref + d_C + jitter_C
t_I = a_I t_ref + d_I + jitter_I
t_E = a_E t_ref + d_E + jitter_E
Delta t_i = t_i - t_ref.
```

The contract distinguishes fixed offset `d`, clock-rate drift `a-1`, random
jitter, transport latency and sensor group delay. Camera time is exposure midpoint;
global shutter remains required. IMU measurements refer to defined integration
intervals; encoder interpolation is part of ground-truth uncertainty.

Timing induces first-order angular error

```text
delta_theta_sync ≈ |omega| |Delta t|,
```

so the future timing bound is derived from the maximum declared angular rate and
the synchronization share `tau_sync` of the external tolerance:

```text
u_Delta_t <= tau_sync / omega_max.
```

No numeric requirement exists until `tau_task`, its error allocation and motion
envelope are externalized.

Offset is identified with bidirectional, variable-speed motion jointly visible in
camera, gyro and encoder. Constant speed alone confounds angular zero with time
offset; one direction alone can confound backlash/latency. Calibration must test
drift across run duration and propagate residual time uncertainty into `Sigma_GT`
and estimator uncertainty.

