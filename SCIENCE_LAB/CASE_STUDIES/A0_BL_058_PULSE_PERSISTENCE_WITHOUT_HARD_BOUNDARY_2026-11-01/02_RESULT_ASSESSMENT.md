# A0-BL-058 — result assessment

Date: `2026-11-01`  
Status: `BOUNDED_RESULT / AWAITING_OWNER_DISPOSITION`

## Frozen result

`BOUNDARY_LOCKED_SMOOTH_EVENT`  
Qualifier: `PHASE_COHERENT_ONLY`

| Quantity | Result |
|---|---:|
| median `t*`-versus-`t0` tracking slope | `0.905000` |
| `t*` span over 12 smooth-boundary variants | `8.480000` |
| sampling `t*` span (`dt=0.01/0.02/0.04`) | `0.020000` |
| maximum high-order Fourier `t*` error | `0.060000` |
| phase-control event-time shift | `2.920000` |
| phase-control curvature-amplitude change | `70.2974%` |
| Alpha/Beta reciprocal-product error | `2.220446049e-16` |

Six of the seven boolean checks are true. The deliberately discriminating
carrier-persistence check is false: the detected event does not remain at one
carrier time across the smooth-boundary grid.

## Interpretation

Replacing the hard cutoff with a logistic window removes the discontinuity but
does not make the local event intrinsic to one carrier time. Across translated
and widened smooth boundaries, the detected event follows the boundary. The
median tracking slope exceeds the frozen `0.75` threshold, while the total
event-time span exceeds the persistence limit by more than an order of
magnitude.

The result is not explained by coarse sampling: the event time changes by only
`0.02` across the three frozen step sizes. It is also reproduced by the two
windowed high-order Fourier representations within `0.06`, below the frozen
`0.25` limit. Fourier representation therefore preserves this declared event;
it does not make the event carrier-intrinsic.

The deterministic phase control shifts the event by `2.92` and changes its
curvature peak by `70.3%` while preserving harmonic amplitudes. Thus amplitude
spectrum alone is insufficient; the displayed event depends on phase order.

## Ablation notes

- without the exponential term, the maximum falls to the analysis-window edge
  at `t=18`, so no comparable interior event survives;
- without the sinusoid, the event remains at the boundary center `t=25`;
- without quadratic drift, the event remains at `t=24.74`.

These are descriptive controls. They do not create an alternative positive
carrier-pulse classification.

## Claim ceiling

Established: within the frozen analytic model, the strongest smooth event is
boundary-locked, sampling-stable, high-order-Fourier-stable and phase-order
sensitive. The Alpha/Beta display channels remain exact reciprocals.

Not established: physical breathing, material dilation, energy transfer,
resonance field, consciousness, biology, universal Alpha/Beta roles, a
privileged Fourier basis, prediction, utility or cross-domain mechanism.
