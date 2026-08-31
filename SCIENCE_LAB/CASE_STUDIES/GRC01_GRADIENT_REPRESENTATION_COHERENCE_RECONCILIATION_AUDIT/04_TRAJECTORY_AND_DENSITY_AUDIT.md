# 04 — Trajectory and Density Audit

## Typed distinction

A trajectory is an ordered map or sampled sequence through state space. A density estimate summarizes occupancy relative to a reference measure and estimator. Hence:

- `TRAJECTORY_EQUALS_DENSITY=NO`
- repeated occupancy is not causal attraction;
- density does not preserve temporal order, velocity, direction, dwell mechanism, or intervention response;
- a finite-sample KDE/histogram depends on bandwidth/binning, sampling measure, projection, duration, and transient handling.

For continuous-time trajectories, sampling by equal time steps and sampling by arc length generally induce different empirical densities. A projected density can merge distinct source states. Coordinate rescaling also changes density values through the reference measure/Jacobian unless the density is transformed appropriately.

## Historical status

V3 and V4 visibly overlay trajectories and density-like fields, so their image content is `D`. No matching estimator definition, array, bandwidth, burn-in rule, seed, or run manifest was located. Their density is therefore not upgraded to `B` or `C` in GRC-01.

The separate Builder Lab lineage begins from an unseeded synthetic scalar landscape rather than trajectory samples. Its field cannot be retroactively treated as an empirical state density.

## Stability claim

High empirical occupancy can result from slow motion, sampling choices, projection, or an attractor measure. It is not by definition structural stability. Therefore `DENSITY_EQUALS_STABILITY=NO`.

