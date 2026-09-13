# Energy, Work and Impulse Ledger

| item | equation/account | required evidence | invalid shortcut |
|---|---|---|---|
| actuator work | `W_act=∫u_c^T qdot dt` in matched coordinates | torque/force, velocity, timing | calling command amplitude “energy” |
| external work | `W_ext=∫f_ext^T v_ext dt` | force, application point/velocity, frame | GRF magnitude alone |
| variable stiffness work | `W_K=∫(1/2 φ^T Kdot φ)dt` | deformation and `K(t)` | treating stiffness modulation as free |
| elastic storage | `ΔV_K` | constitutive model and state | confusing storage with generation |
| dissipation | `W_diss≥0` for passive damper/friction model | signed model/measurement | unexplained loss/gain |
| contact pressure | surface integral to force/moment | calibrated area/field | pressure as energy reservoir |
| linear impulse | `J_ext=∫F_ext dt=Δp_total` | force-time trace | internal torque changes total momentum |
| angular impulse | `∫M_ext dt=ΔH` about declared point | external moment and reference | counterrotation creates total angular momentum |
| release | pre/post event ledger plus constraint work | event guard, mode, impulse | release implies added energy |

At an impulsive contact event,

`M(q)(qdot⁺-qdot⁻)=J(q)^TΛ + J_other`,

with restitution/compliance and all external impulses declared. Sequential braking may transfer energy between segments and reshape timing; any performance gain must close under the full ledger and equal accounted input.

Four-condition comparisons must match plant, initial state/energy distribution, task boundary, allowed actuation, contact model, and accounted actuator/stiffness work. Otherwise condition effects are confounded.

