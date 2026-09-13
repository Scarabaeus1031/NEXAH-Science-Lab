# Time-Dependent Coupling Formalization

## Scope and conventions

Bodies are B0=BODY, B1=ARMS and B2=CLUB. This is a synthetic rigid-body chain, not a validated human model. Generalized coordinates are z; unit quaternions q_i encode orientations. Freeze active/passive rotation, handedness, expression frame and multiplication convention before implementation.

    q_i_rel = inverse(q_i) tensor q_(i+1)
    phi_i = Log_SO3(q_i_rel) in R^3
    nu_i = omega_(i+1)^J - omega_i^J

The logarithm uses a selected continuous branch, with sign/branch continuity and an explicit rule near pi. Relative angular velocity is expressed in one joint frame; vectors in different frames cannot be subtracted directly.

## Compliant coupling

The resisting torque on the distal body is

    tau_i^(p->d) = -K_i(t) phi_i - C_i(t) nu_i

with equal/opposite proximal torque after frame transformation. K_i(t) and C_i(t) are symmetric positive-semidefinite 3x3 matrices. The prompt's scalar relation is the 1-DOF case, up to its missing resisting-force sign.

Binary gates are limiting schedules such as K_i(t)=g_i(t)K_i0 with g_i in {0,1}. The primary model uses bounded continuous g_i(t) in [0,1] with declared smoothness and rate limits.

## Dynamics and constraints

    M(z) z_ddot + h(z,z_dot) = B u + J(z)^T lambda + f_ext + f_joint
    Phi(z,t) = 0

Ground/contact support must state whether fixed, compliant, frictional or unilateral. Constraint reactions are outputs, not hidden energy sources. Unilateral contact needs complementarity or a declared compliant law. Quaternion states obey a convention-consistent kinematic ODE and are normalized or integrated on the manifold.

## Operational terms

- BRAKE: applied torque with negative instantaneous power over the declared interval. Deceleration alone is not proof of braking torque.
- TRANSFER: internal exchange quantified by torque, relative power and body energy/momentum changes; it creates no total-system momentum.
- TORQUE_RELEASE: commanded actuator torque becomes zero.
- COMPLIANCE_RELEASE: K(t) and/or C(t) decrease; bodies remain coupled absent a disconnect.
- DISENGAGEMENT: hybrid guard plus topology/reset map.
- IMPACT: separate guard and impulse/reset law.
- RESIDUAL: evolution over a declared post-event interval.

## Momentum, power and energy

    L_i^O = I_i^W omega_i + r_(COM_i/O) cross (m_i v_COM_i)
    v_head = v_COM_2 + omega_2 cross r_(head/COM_2)
    E_el,i = 1/2 phi_i^T K_i(t) phi_i
    P_K,i = 1/2 phi_i^T K_dot_i(t) phi_i

Joint power uses torque dotted with a consistently expressed angular velocity; report pair transfer power, signed work, positive supplied work and absorbed work separately.

For E=T+V_g+sum(E_el), up to frozen signs:

    E_dot = P_act + P_ext + P_K
            - sum(nu_i^T C_i nu_i) - P_other_loss

Varying stiffness is not free. Equal-work comparisons include the stiffness port and state whether extracted energy is regenerated, stored or dissipated. Impact energy jumps are audited separately.

## Candidate relation

On a preregistered interval and beyond numerical tolerance: effective stiffness decreases, proximal angular-speed magnitude decelerates, and distal angular-speed magnitude accelerates. This conjunction is neither necessary nor sufficient for causal transfer. The controlled contrast in file 06 is the test; torque/power/energy ledgers check mechanism consistency.

FORMAL_STATUS=SPECIFIED_NOT_IMPLEMENTED

PHYSICS_STATUS=CONVENTIONAL_MECHANICS

CLAIM_STATUS=FALSIFIABLE_SYNTHETIC_HYPOTHESIS
