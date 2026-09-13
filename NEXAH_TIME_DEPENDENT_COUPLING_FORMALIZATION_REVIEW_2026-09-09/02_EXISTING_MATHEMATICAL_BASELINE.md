# Existing Mathematical Baseline

## Coverage

Established mathematics supplies every ingredient needed to pose the candidate. The absence is a frozen NEXAH-specific model and test, not missing mathematics.

| Structure | Baseline | Consequence |
|---|---|---|
| Unit quaternions / SO(3) | Unit quaternions double-cover 3-D rotations; q and -q encode one orientation | normalize and handle sign continuity; no new element |
| Relative rotation | q_rel=q_p^-1 tensor q_d, convention fixed | separates carrier and relative orientation |
| Angular velocity | convention-dependent quaternion differential equation | never differentiate quaternion components as ordinary angles |
| Noncommutative composition | generally q_R tensor q_S differs from q_S tensor q_R | composition needs frame/order declaration |
| Generalized coordinates | rigid-body configuration plus velocities | quaternions are only one coordinate choice |
| Constrained multibody dynamics | M(z)z_ddot+h=Bu+J^T lambda+f_ext | ground, joints and anchors need constraints/reactions |
| Momentum / impulse | spin plus orbital angular momentum; impulses act at events | internal transfer cannot create total-system momentum |
| Torque / power / work | P_j=tau_j dot omega_rel; W_j=integral P_j dt | sign and frame must be fixed |
| Elasticity / damping | tau=-K(t)phi-C(t)phi_dot | prompt equation is a 1-DOF special case with missing resisting sign |
| Proximal-distal sequence | known biomechanical hypothesis/pattern | plausible, not proven by a visual |
| Hybrid dynamics | flows plus guards and reset maps | impact/disengagement differs from smooth K(t) |
| Release | torque-off, stiffness ramp, disconnect and impact are distinct | each needs an operational definition |

## Currentness

The 2022 golf-kinematics systematic review reports that higher distal angular speed is common but the proximal-to-distal sequence is rarely verified and sensitive to computation method. This supports a cautious test, not a universal claim: [Golf Swing Biomechanics](https://pmc.ncbi.nlm.nih.gov/articles/PMC9227529/).

A 3-D six-segment forward-dynamics golf model already optimized torque-generator coordination for clubhead speed. Forward simulation and timing optimization are prior art: [MacKenzie & Sprigings, 2009](https://doi.org/10.1007/s12283-009-0020-9).

Golf joint work/power have been analyzed from relative angular velocity and torque: [Work and Power Analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC3899668/).

Quaternion/SO(3) kinematics are established: [Solà](https://arxiv.org/abs/1711.02508) and [Hashim](https://arxiv.org/abs/1909.06669).

Constrained multibody equations and biomechanical simulation are established: [Lidström](https://doi.org/10.1177/1081286511407111) and [OpenSim](https://pmc.ncbi.nlm.nih.gov/articles/PMC4397580/).

Continuous/discrete hybrid-system separation is established: [Goebel, Sanfelice & Teel](https://doi.org/10.1109/MCS.2008.931718).

Variable stiffness affects elastic energy and can exchange work through its control port: [Visser et al.](https://viactors.org/Documents/Papers/Visser-ICRA2010a.pdf) and [Stiffness Modulation](https://arxiv.org/abs/2012.11407).

EXISTING_MATHEMATICS_COVERAGE=COMPLETE_FOR_SPECIFICATION

NEW_MATHEMATICS_REQUIRED=NO

NEW_PHYSICS=NO
