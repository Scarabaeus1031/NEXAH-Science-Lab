# Mathematical Audit of the Curtain Tensor

## Rank-one tensor

For `C(x)=v(x)⊗n(x)=v nᵀ`,

`||C||_F² = tr(CᵀC) = ||v||² ||n||²`.

Therefore, if `||n||=1`, then

`||C||_F = ||v||`.

The spectral and nuclear norms of this rank-one matrix also equal `||v|| ||n||`; other entrywise norms need not. A displayed “Curtain norm” must name the norm and confirm normalization. If the visual displays only `||C||_F` with unit normals, it contains no scalar magnitude information beyond speed.

The **full tensor** retains directions of `v` and `n` up to rank-one factor/scaling ambiguities, so it can contain more orientation information than `||v||`; that does not make it a deformation or coherence tensor.

## Required baselines

| candidate | operational quantity | information absent from `||v||` |
|---|---|---|
| speed | `||v||` | none; primary baseline |
| normal flux | `v·n` | signed crossing tendency |
| Jacobian | `∇v` | local linearized dynamics |
| strain rate | `S=(∇v+∇vᵀ)/2` | instantaneous extension/compression |
| normal strain | `nᵀSn` | normal deformation rate |
| shear | `||(I-nnᵀ)Sn||` or declared alternative | tangential-normal coupling |
| curvature | geometry of `Γ` from derivatives/mesh | surface shape, not flow coherence |
| finite-time stretching | largest eigenvalue of flow-map Cauchy–Green tensor over declared interval | path-integrated deformation |
| null surfaces | random/geometrically matched surfaces | specificity/chance control |

Established FTLE/LCS work defines finite-time transport structures through the flow map and stretching/flux properties, not through `v⊗n` by appearance; see [Shadden, Lekien & Marsden](https://authors.library.caltech.edu/records/0ytty-xq745) and [Haller’s review](https://doi.org/10.1146/annurev-fluid-010313-141322).

## Gate geometry

`Γ_gate={x:g(x)=0}` is a regular codimension-one surface only where `g` is differentiable and `∇g≠0`. A transverse crossing satisfies

`g(x(t_k))=0`, `d/dt g(x(t_k))=∇g(x(t_k))·f(x(t_k),t_k) != 0`.

`Γ_gate ≈ Σ_- ∩ Σ_+` is not a definition. In three dimensions, the generic intersection of two regular surfaces is a curve, not a surface. “Approximate intersection” additionally requires a distance, tolerance and construction rule.

No repository source was found that computes “coherence deformation,” anisotropic transport surfaces, Curtain norm, Aperture Zones or Tube Corridors from the requested primary. Those meanings remain unbound annotations.

