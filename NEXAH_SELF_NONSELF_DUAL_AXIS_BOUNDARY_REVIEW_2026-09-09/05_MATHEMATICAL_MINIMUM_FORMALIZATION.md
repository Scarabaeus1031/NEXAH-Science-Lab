# Mathematical Minimum Formalization

## Geometry and state

Let `a_1(t), a_2(t) ∈ S²` be unit axis directions expressed in the same declared frame. For directed axes,

`θ(t) = atan2(||a_1 × a_2||, a_1 · a_2) ∈ [0,π]`.

If axes are unsigned, declare that fact and use `|a_1·a_2|`, giving an acute equivalence angle. An axis without frame, origin, direction convention, and uncertainty is incomplete.

Let the composite state be `x=(q, qdot, z)`, where `q` are generalized coordinates and `z` may hold actuator/controller states. Let `e` be environment state, `u_c` authorized control, `w` exogenous/uncontrolled input, `f_ext` external/contact generalized force, and `B(t)` the boundary/contact mode and exchange contract.

## Dynamics and coupling

`M(q) qddot + C(q,qdot)qdot + G(q) = S u_c + J(q)^T λ + f_ext + τ_K(φ,K) + w`.

For a small-coordinate relative deformation `φ`, one admissible coupling is

`V_K = 1/2 φ^T K(t) φ`, `τ_K = -K(t)φ - D(t)φdot`.

Its stored-energy rate contains the stiffness-programming port

`P_K = 1/2 φ^T Kdot(t) φ`.

Any experiment/model must account for `P_K`; varying stiffness is not free energy. The energy ledger is

`Edot = P_act + P_ext + P_K - P_diss + P_other`,

with every retained port defined by sign, frame, units, and measurement/model source.

## Boundary and SELF/NON-SELF bookkeeping

Define a time-varying assignment map with uncertainty:

`A_B(t): (x,e,u_c,w,y) → {SELF_MODEL, NONSELF_MODEL, INTERFACE, UNRESOLVED}`.

Candidate readings:

- `SELF_MODEL = {estimated internal state xhat, authorized control u_c}`;
- `NONSELF_MODEL = {environment estimate ehat, exogenous input w, unmodeled residual r}`;
- `INTERFACE = {B(t), allowed flows, contact state, sensing/actuation channels}`.

This is controller bookkeeping, not ontology. Observations generally mix both sides:

`y_k(t) = h_k(x(t-τ_k), e(t-τ_k), B(t-τ_k), c_k) + ν_k(t)`.

The estimator must preserve ambiguity rather than force a binary identity.

## Pressure/contact and release

For surface `Γ`, normal pressure `p(r,t)` yields

`F_c = ∫_Γ p n dA + ∫_Γ t_tan dA`,  
`M_c = ∫_Γ (r-r_0) × (p n + t_tan) dA`.

Thus pressure is not the wrench, torque, load path, or energy. `P(t)` is admissible only after its type is declared: scalar pressure, pressure field, contact resultant, or nonphysical annotation.

Let release be the first guard crossing

`t_r = inf{t : g_r(x,xhat,B,p,u_c) ≤ 0 and q_r(previous mode,new mode)=true}`.

Release changes a mode, constraint, or policy; it does not by itself guarantee a return.

Define terminal residual and learning update:

`r_T = y_T - y*`,  
`ξ_{n+1} = Π_Ξ[ξ_n + L(r_T, history_n)]`.

`Π_Ξ` is a bounded update/projection; `L` must be specified before “persistent return” means anything operational.

## X° and coordinate invariance

Use `X°` only as one of:

- a declared corridor `θ(t) ∈ Θ(body,task,contact,t)`;
- a coordinate/transform parameter;
- an event-switch threshold with hysteresis and uncertainty.

A passive 90° frame rotation changes coordinates, not the physical outcome. A single optimal angle is not supported; feasible/advantageous corridors are plant-, body-, task-, contact-, and objective-dependent.

