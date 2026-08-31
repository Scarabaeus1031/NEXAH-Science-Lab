# 05 — Density Gradient Audit

## Standard mathematics (`A`)

For a differentiable scalar field `ρ` on a domain with a specified Riemannian/Euclidean metric, the gradient `grad ρ` is the vector satisfying

`<grad ρ, v> = dρ(v)` for every tangent vector `v`.

In Euclidean Cartesian coordinates its components are the familiar partial derivatives. The gradient points along the steepest local increase measured by the chosen metric. It is local and covariant: components change with coordinates while the geometric vector can remain the same under an admissible change of chart with the metric transformed consistently.

## Required records

Domain, reference measure, density estimator, estimator parameters, metric, coordinates/frame, grid spacing, derivative scheme, boundary handling, differentiability/smoothing, and zero/noise policy are required for a reproducible numerical gradient.

## Noncollapses

- `DENSITY != DENSITY_GRADIENT`
- `SCALAR_FIELD != VECTOR_FIELD`
- `VECTOR != VECTOR_COMPONENTS`
- `GRADIENT != TRAJECTORY`
- `GRADIENT != FLOW`
- `GRADIENT != FORCE`
- `GRADIENT != CAUSAL_DIRECTION`
- `GRADIENT != GLOBAL_GEOMETRY`

## Historical decomposition

| statement | class | decision |
|---|---|---|
| `∇ρ` gives steepest local increase of defined `ρ` under the metric | A | supported definitionally |
| `ρ` is an empirical state-density estimate | B only if estimator/run is identified | underdefined for supplied visuals |
| high `ρ` means structural stability | E/F | not established |
| `∇ρ` aligns with stabilization flow | C needed | not established |
| `∇ρ` is a guidance/navigation signal | E; requires outcome test | not established |

The archived synthetic-field code computes finite differences with `np.gradient`, but its prior audit records omitted physical grid spacing and unseeded source generation. That is `B` for its own field, not evidence that the supplied density-gradient visual is reproduced.

Final answers:

`DENSITY_EQUALS_STABILITY=NO`  
`DENSITY_GRADIENT_EQUALS_STABILITY_GRADIENT=NO`  
`GRADIENT_ALIGNS_WITH_FLOW=NOT_ESTABLISHED`  
`GRADIENT_PREDICTS_TRANSITION=NO`  
`GRADIENT_IS_NAVIGATION_SIGNAL=NO`

