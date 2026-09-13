# SELF/NON-SELF Boundary and Dual-Axis Schemas

## Boundary record

Every event record must contain:

| field | minimum content |
|---|---|
| identity | trial, timestamp, model/version, operator |
| SELF_MODEL | estimated internal variables; authorized commands; confidence |
| NONSELF_MODEL | estimated environment; exogenous/uncontrolled inputs; residual |
| INTERFACE | `B(t)` mode; permitted sensing/actuation/material/energy flows |
| contact | geometry, pressure/traction type, wrench, units, calibration |
| observation | channel, latency `τ_k`, frame, uncertainty, missingness |
| decision | comparator, guard, release `t_r`, authority |
| return | target, residual, success tolerance, terminal time |
| next trial | bounded updated state/parameter and provenance |

The assignment may change with time and may remain `UNRESOLVED`. External force can be predicted, and an internal state can be uncontrolled; therefore “inside = controlled” and “outside = uncontrolled” are only candidate conveniences, never definitions.

## Dual-axis record

Record `a_1,a_2`, frames/origins, direction convention, `θ(t)`, `θdot`, coupling `K(t),D(t)`, contact mode, pressure/wrench, `u_c`, actuator work, `P_K`, braking onset, release event, delayed observations, endpoint residual, and next-trial update.

## Four bounded conditions

1. **Rigid coupling:** relative coordinate constrained within declared tolerance.
2. **Constant compliant:** constant `K,D`; no time-varying stiffness work.
3. **Variable coupling, no targeted braking:** declared `K(t),D(t)` schedule; no state-targeted braking/release policy.
4. **Variable coupling + load/counterrotation/brake/release:** same admissible plant/input budget, with typed contact load, counterrotation coordinate, targeted braking, and explicit release guard.

The key contrast is **4 versus 3**. Primary estimand: change in preregistered task loss at equal accounted total input/work and matched initial state. Secondary estimands may include peak endpoint error, release timing variance, contact impulse, dissipation, robustness to perturbation, and residual learning.

No advantage is attributable to “pressure,” “counterrotation,” or “release” unless the nested contrast and ledger isolate that factor.

