# UTG-FORMAL-01 — Lorenz Crossing Control Preregistration

Date: `2026-10-06`

Status before execution: `AUTHORIZED BOUNDED INTERNAL TEST`

## Question

Can the UTG Aperture / Transition candidate distinguish an observation
aperture, an event boundary, an observed crossing and an admissible transition
on one existing executable carrier without promoting the visual UTG framework
into a universal mechanism?

## Frozen carrier and objects

- state space `X = R^3`;
- time `T = [0,100]` with analysis after burn-in `t >= 10`;
- trajectory `s(t) = (x(t),y(t),z(t))` from canonical Lorenz-63 with
  `sigma=10`, `rho=28`, `beta=8/3`, initial state `(1,1,1)` and fixed-step
  RK4;
- event function `g(s,t)=x`;
- boundary `B={s | x=0}`;
- observation aperture `W={s | |x|<=1}`;
- observed crossing: strict sampled sign change of `x`, linearly interpolated
  to `B`;
- transversality: `dg/dt = sigma*y != 0` at the interpolated event;
- admissible gate `G`: negative-to-positive crossing with `dg/dt > 10^-9`;
- optional transition/return map `R`: identity on the interpolated section
  record. It records the event and does not alter Lorenz dynamics.

The reference integration step is `0.001`. Sampling controls use the same
reference trajectory at `0.005`, `0.01` and `0.02`; this isolates observation
resolution from chaotic trajectory divergence.

## Frozen controls

| Control | Expected classification | Admitted by `G` |
|---|---|---:|
| negative-to-positive transversal sign change | `TRANSVERSAL_CROSSING` | yes |
| positive-to-negative transversal sign change | `TRANSVERSAL_CROSSING` | no |
| same-side near miss | `NO_CROSSING` | no |
| boundary touch with same-side return | `TOUCH_OR_UNRESOLVED` | no |
| sign change with zero declared normal velocity | `NONTRANSVERSAL_SIGN_CHANGE` | no |

## Acceptance gates

The result is `PASS` only if:

1. all five frozen controls return their expected class and gate decision;
2. the Lorenz trajectory contains both admitted and direction-rejected
   transversal crossings after burn-in;
3. every interpolated event satisfies `|g| <= 10^-12`;
4. event direction agrees with the sign of `dg/dt` and no admitted event is
   nontransversal;
5. each coarser sampling control recovers the same event count as the
   reference trajectory;
6. for `dt=0.02`, nearest-event mean absolute time error is at most `0.001`
   and mean absolute `z` error is at most `0.05`;
7. the identity return map changes no interpolated event coordinate;
8. two executions produce byte-identical JSON and CSV outputs.

## Failure meaning

Failure rejects this classifier or its declared sampling bounds on this
carrier. Passing establishes only an object-specific control result. It does
not validate the Series XIV plate equation, a physical UTG mechanism, a new
property of Lorenz-63 or UTG as a whole.
