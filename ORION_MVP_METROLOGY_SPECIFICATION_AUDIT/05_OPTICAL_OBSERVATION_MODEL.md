# Optical Observation Model

## Measurement equation

Let known fiducial point `j` have coordinates `P_j^F`. For a calibrated camera:

```text
p_j^C(t) = R_CW R_WB(t) (R_BF P_j^F + t_BF) + t_CW
u_j(t)   = project(K,D,p_j^C(t)) + epsilon_j(t).
```

`K` is the intrinsic matrix, `D` the frozen distortion model and `epsilon_j`
includes localization noise/outliers. Point identities are known; ambiguity is
not deliberately introduced.

## Geometry contract

- General PnP requires at least four usable correspondences; the final design
  should contain redundant points beyond the solver minimum.
- The layout must be asymmetric, non-collinear and span the image in the declared
  working-distance/view envelope.
- Prefer depth variation/noncoplanarity where manufacturable; if planar, explicitly
  audit mirror/multiple-solution behavior, shallow views and cheirality.
- Freeze metric point coordinates and `T_BF` from independent metrology.
- Visibility logic, minimum usable points, blur/saturation rejection and robust
  outlier handling are specified before test access.

Geometry identifiability requires a design-only Jacobian/rank and conditioning
analysis over the full planned pose envelope. A full-rank result at one nominal
pose is insufficient; near-degeneracy can create false practical observability.

## Camera requirement flow-down

The future global-shutter camera must satisfy derived—not vendor-led—requirements
for frame rate, exposure, pixel pitch/resolution, field of view, lens distortion,
working distance, trigger/timestamp interface and thermal stability. Require that
predicted orientation uncertainty from pixel/extrinsic error fits its allocated
share of `tau_task`.

The causal propagation begins with the projection Jacobian:

```text
Sigma_pose,opt ≈ (J^T Sigma_u^-1 J)^-1
```

when local linear/Gaussian assumptions hold. Nonlinear/multimodal cases require
sampling or profile-likelihood analysis in a later design, not fabricated here.

