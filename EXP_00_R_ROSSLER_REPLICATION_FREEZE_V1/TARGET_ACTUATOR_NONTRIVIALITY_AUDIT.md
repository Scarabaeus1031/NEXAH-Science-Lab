# Target / Actuator Nontriviality Audit

**Result: PASS with an actuator-specific interpretation. No registered trajectories or outcomes were inspected.**

## Coupling acknowledged

The target is selected from the training distribution's high-(x) quartile and the actuator enters the (x)-equation. This is a deliberate coupling and must not be described as actuator invariant. At an infinitesimal horizon, positive (u) directly increases (dot x), so a one-coordinate terminal target would risk a tautological ranking.

## Why the frozen task is not structurally identical to “push x positive”

The objective is squared standardized three-dimensional distance to a target ball, not raw terminal (x). The controlled Rössler equations propagate (x)-forcing into (y) and (z):

\[
\dot y=x+ay,\qquad \dot z=b+z(x-c).
\]

For the local Jacobian (J_F) and (B=e_x), the first controllability directions are (B), (J_FB), and (J_F^2B). Their controllability determinant is

\[
\det[B,J_FB,J_F^2B]=z(x-c-a),
\]

which is generically nonzero away from (z=0) and (x=c+a). Thus x-channel forcing generally changes all three local state directions over a finite horizon. The best sign and magnitude can depend on phase, natural flow, (z), overshoot, and the target's (y,z) coordinates.

The symmetric five-action set also makes “positive is always best” a falsifiable implementation outcome, not a coded rule. No representation has access to a sign heuristic.

## Target occupancy by construction

The candidate subset contains approximately the upper quartile of training states. The radius is its within-subset 25th-distance percentile, so the ball is nonempty and does not intentionally cover the full attractor. This occupancy property follows from the frozen quantile construction and does not require registered outcome inspection.

## Horizon reasoning

The near-planar (x,y) rotation has characteristic angular rate near one radian per time unit, corresponding to a period around (2\pi\). (H=1.0) is therefore roughly one-sixth of a rotation: long enough for indirect coupling into (y,z), yet short of a complete orbit. RK4 uses 200 steps at `dt=0.005`. Sensitivities 0.5 and 1.5 are fixed without outcome-based selection.

## Remaining limitation

A positive result applies only to this high-(x), scalar-x-actuated task. If future outcomes show one action mechanically dominates nearly everywhere, that negative design finding must be retained and will weaken interpretability under the frozen falsification rules.

