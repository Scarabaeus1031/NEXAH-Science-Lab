# Minimum Test Specification

## Question

In the frozen synthetic BODY -> ARMS -> CLUB model, does scheduling coupling and proximal braking increase prerelease distal peak clubhead speed at equal accounted total input work?

Specification only; no execution is authorized or reported.

## Common inputs

One byte-identical manifest freezes masses, inertia tensors, geometry, initial state, quaternion convention, gravity, joints, ground/contact, torque/rate/coupling bounds, schedule family, integrator, step sizes, tolerances, event localization, horizon, evaluation window, seeds and any optimizer budget. No real-person calibration is permitted.

## Conditions

1. SIMULTANEOUS: simultaneous actuator onset, constant coupling, no special brake.
2. STAGGERED: frozen distal delays, constant coupling, no special brake.
3. BRAKE_FIXED_K: condition 2 plus proximal negative-power braking, constant coupling.
4. BRAKE_TIME_VARYING_K: condition 3 plus bounded continuous K_i(t), C_i(t).

All other inputs remain equal. Binary coupling is sensitivity-only.

## Fair work

    W_ctrl = integral(P_muscle_like + P_brake + P_K) dt

Also report positive supplied work, absorbed work, damping/contact dissipation and recovered/exported energy. Match signed W_ctrl to a preregistered tolerance; secondarily match positive work because equal net work can conceal different positive/negative work. If condition 4 cannot be matched within common bounds, return INCOMPARABLE_WORK_MATCH_FAILURE. Never rescale only the observed winner.

## Outputs

- q_i(t), omega_i(t), frames and conventions;
- full-origin L_i(t), plus labeled spin-only values if desired;
- actuator, brake, elastic, damping, constraint/contact and net tau_i(t);
- joint/body power and signed/positive/absorbed work;
- v_head(t), prerelease peak and elastic energy;
- stiffness-port power;
- event times, pre/post states and residual interval;
- continuous energy error and impact jump residual separately.

## Endpoint and contrasts

Primary endpoint: max norm(v_head) over the frozen interval ending just before impact/disengagement.

Primary contrast: condition 4 minus 3, isolating variable coupling conditional on the same stagger/brake design. Secondary: 2-1 and 3-2. The 4-1 contrast is descriptive only.

Pass only if work/input hashes pass, 4-3 is positive beyond numerical uncertainty, the sign survives two step refinements and small preregistered perturbations, residual tolerances pass, and traces exclude uncounted energy. Otherwise return NO_ADVANTAGE, NUMERICALLY_UNRESOLVED, MODEL_SENSITIVE or INCOMPARABLE.

## Controls

- reverse stagger order;
- move braking outside the transfer interval;
- set K_dot=0 while retaining other condition-4 controls;
- demonstrate that omitting P_K fails the ledger;
- binary coupling sensitivity;
- neutral-relabel bodies A/B/C.

Optimized schedules use equal budgets and independent evaluation draws. Freeze objective and schedule family before outcomes. Synthetic sweeps cannot establish population biomechanics.

MINIMUM_TEST_JUSTIFIED=YES_SPECIFICATION_ONLY

TEST_EXECUTED=NO
