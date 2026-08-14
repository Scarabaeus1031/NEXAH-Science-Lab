# Coordinate-Frame Contract

## Convention and frames

`T_AB` maps homogeneous coordinates expressed in frame `B` into frame `A`;
`T_AB = [R_AB,t_AB]`. No transform is exact by default.

- `W`: fixed laboratory/world frame, realized by the stage-base datum and gravity
  convention; its origin and axes require a surveyed realization.
- `S`: moving rotary-stage output/platen frame.
- `B`: rigid-body frame, fixed to metrology datums on the probe.
- `I`: IMU sensor frame from its calibrated axis convention.
- `C`: camera optical frame.
- `F`: fiducial design/metrology frame.

## Transformation graph

```text
W <--T_WS(t)-- S <--T_SB-- B <--T_BI-- I
W <--T_WC----- C <--T_CF(t)-- F <--T_FB-- B
```

The arrows point in the coordinate-mapping direction implied by `T_AB`: from the
right-hand source frame `B` to the left-hand destination frame `A`.

Equivalent chains must close within uncertainty:

```text
T_WB,GT(t)  = T_WS(t) T_SB
T_WB,opt(t) = T_WC T_CF(t) T_FB
```

## Status contract

| Transform | Meaning | Status/access |
|---|---|---|
| `T_WS(t)` | dynamic platen pose in world | encoder + calibrated stage kinematics; scorer-only truth during evaluation |
| `T_SB` | body mount on platen | calibrated, fixed per assembly |
| `T_BI` | IMU-to-body extrinsic | calibrated, fixed only while mounting remains unchanged |
| `T_WC` | camera pose in world | calibrated, fixed with drift checks |
| `T_BF` / `T_FB` | fiducial-to-body extrinsic/inverse | construction plus independent metrology; uncertain |
| `T_CF(t)` | observed fiducial pose in camera | dynamically estimated by optical method |

Gauge freedom is removed by declaring `W` from independent stage-base datums, not
from the evaluated camera or IMU. Calibration covariances and correlations travel
with every transform. A closure residual is a diagnostic, not permission to tune
one chain using held-out truth.
