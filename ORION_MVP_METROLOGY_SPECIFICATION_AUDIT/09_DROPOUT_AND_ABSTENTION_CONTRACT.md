# Dropout and Abstention Contract

## Operating regimes

Analyze separately:

1. static holds: zero/bias/calibration closure;
2. slow bidirectional rotation: optical geometry and basic synchronization;
3. bounded dynamic rotation: latency and fusion;
4. controlled dropout interval: propagation and uncertainty growth.

The first meaningful test is static plus slow single-axis rotation. Dynamic and
dropout claims proceed only after those assumptions close.

## Dropout conditions

| Condition | Available observations | Expected information | Legitimate output |
|---|---|---|---|
| `D0` | optical + gyro/IMU | absolute optical angle plus inertial propagation | estimate or abstain by quality |
| `D1` | IMU only | relative angle; drift grows with bias/time | estimate for bounded gap, then `UNKNOWN/REMEASURE` |
| `D2` | optical only | per-frame pose while visible; no inertial bridge | estimate or abstain on geometry/blur |
| `D3` | partial optical + IMU | pose only if remaining geometry passes rank/quality rules | estimate or `UNKNOWN` |

Masks, onset, duration and restoration behavior must follow an external visibility
or sensor-availability rationale. Do not create many arbitrary patterns.

## Abstention triggers

Permit `UNKNOWN`/`REMEASURE` for insufficient point visibility, degenerate optical
conditioning, innovation/residual inconsistency, uncertainty above the decision
bound, expired calibration, excessive timing uncertainty, sensor saturation or
formal loss of observability. Triggers are method-appropriate but frozen before
evaluation. Forced guessing is an unsafe acceptance, not a valid estimate.

