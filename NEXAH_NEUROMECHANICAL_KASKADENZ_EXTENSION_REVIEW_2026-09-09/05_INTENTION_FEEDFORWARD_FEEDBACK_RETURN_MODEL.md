# Intention, Feedforward, Feedback and Return Model

## Purpose and type boundary

This is a bounded hybrid delay-control specification around the predecessor's frozen synthetic mechanics. Neural/control variables, mechanical variables, observations, information records and Human authority are different types; arrows mean declared dependencies, not anatomical identity.

## State and authority

| Symbol | Type | Meaning | Nonclaim |
|---|---|---|---|
| `I_H` | Human authority input | intention/consent/STOP token | not inferred neural activity |
| `r` | task record | target and tolerance in a declared frame | not automatically a gaze target |
| `z(t)` | control state | plan/state-estimate/controller memory | not a named brain region |
| `Q(t), Q_dot(t)` | mechanical state | generalized configuration and velocity | not a complete human body |
| `q_i(t)` | segment orientation | BODY/ARMS/CLUB orientation with fixed convention | no anatomical rigid fusion |
| `u_ff(t)` | actuator command | prepared feedforward input | not measured EMG |
| `u_fb(t)` | actuator command | causal delayed correction | not synonymous with reflex |
| `y_k(t)` | information | channel-specific observation | not mechanical energy |
| `c(t)` | hybrid state | ground/device/impact contact mode | not a continuous force by itself |
| `K(t), C(t)` | plant parameter | effective coupling stiffness/damping | not direct tissue identification |

## Candidate dynamics

Let `d_k >= 0` be a frozen latency for sensory channel `k` and `Y_t` the history available causally at time `t`.

    z_dot(t) = f_neural(z(t), r, I_H, Y_t)

    u(t) = u_ff(t; z_plan, r) + u_fb(t; Y_t, r, z(t))

    M(Q) Q_ddot + C_m(Q,Q_dot) Q_dot + G(Q)
      = B u + J(Q,c)^T F_contact + tau_elastic + tau_other

    y_k(t) = h_k(Q(t-d_k), Q_dot(t-d_k), c(t-d_k),
                 impact(t-d_k), observer_frame_k) + eta_k(t)

Contact/release/impact use declared guards and reset maps:

    if g_e(Q,Q_dot,c,t)=0: (Q+,Q_dot+,c+) = R_e(Q-,Q_dot-,c-)

This notation permits coupled and parallel feedback loops. It does not force every box in the narrative sequence to wait for the previous box.

## Segment relations and mechanical lock

For adjacent bodies, using the predecessor's fixed frame and quaternion conventions:

    q_i_rel = inverse(q_i) tensor q_(i+1)
    phi_i = Log_SO3(q_i_rel)
    tau_i^(p->d) = -K_i(t) phi_i - C_i(t) nu_i

The mechanical operator record remains:

    BOUNDARY -> ANCHOR -> LOAD -> COUNTERROTATION
    -> BRAKE -> TRANSFER -> RELEASE -> RESIDUAL

This is a typed event/phase record. It is not proof that a biological movement decomposes uniquely into those labels.

## Energy and information ledgers

    V_K = 1/2 phi^T K(t) phi

    V_K_dot = phi_dot^T K phi + 1/2 phi^T K_dot phi

    P_K = 1/2 phi^T K_dot phi

`P_K` remains an explicit actuator/parameter-work port. A timing advantage fails the ledger if it depends on omitted stiffness-setting work. Mechanical power, signed work, positive supplied work, absorbed work, damping/contact loss and event jumps remain separate.

Information flow is recorded independently:

    INFO_k = {source, sample_time, available_time, observer_frame,
              transform, uncertainty, destination, use}

An observation does not inject mechanical energy merely by being informative. If it changes `u`, the resulting actuator power is accounted in the mechanical ledger.

## Intention and orientation binding

Human intention authorizes a target record; it is not estimated from gaze. Gaze/bearing may contribute a frame-bound observation or landmark selection. Multiple views may project one motion differently, so every observation records source frame, transform and aperture. `INTENTION BUILDS THE CLOCK` is admissible only as a mnemonic for Human-selected target/phase segmentation, not as a neural or physical law.

## Return and revision

Same-movement feedback is causal and delay-bound:

    u_fb(t) = pi_fb({y_k(s): s + d_k <= t}, r, z(t))

Between-trial revision is a separate map:

    e_n = compare(y_result,n, r_n)
    rho_n = residual(Q_n, y_n, e_n, declared_frame)
    z_plan,n+1 = R(z_plan,n, rho_n, uncertainty_n, Human_acceptance_n)

`R` may return `NO_CHANGE`, `INSUFFICIENT_INFORMATION` or `HUMAN_STOP`. It is not assumed to learn, converge or improve.

## Status

    INTENTION_MODEL_STATUS = HUMAN_AUTHORITY_BOUND_INPUT_SPECIFIED
    FEEDFORWARD_MODEL_STATUS = STANDARD_ABSTRACT_CONTROL_SPECIFIED_NOT_IMPLEMENTED
    FEEDBACK_RETURN_STATUS = DELAYED_MULTI_CHANNEL_AND_TRIAL_RETURN_SPECIFIED_NOT_IMPLEMENTED
    NEW_PHYSICS = NO
    NEW_NEUROSCIENCE = NO

