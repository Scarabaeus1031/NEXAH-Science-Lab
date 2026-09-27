# NEXAH Compare — IEEE Projection Fidelity Evidence

- Status: `PASS`
- Decision: `IEEE_PROJECTION_FIDELITY_CONFIRMED`
- Claim ceiling: `BOUNDED_IEEE_REPRESENTATION_FIDELITY_AUDIT`
- Record type: `computation_result`
- Record ID: `computation:ieee-projection-fidelity:sha256:67e4a9e51610a56fe42a7a46b2c451a42991e3e42a18c35bca9356371362675b`
- Protocol: `ieee-projection-fidelity-v1`
- Development: `ieee9`
- Evaluation: `ieee14`
- Evaluation refit: `false`

## Held-out evaluation comparison

| Representation | Stored scalars | Pair-distance NRMSE | Path-length relative error | Turn-angle MAE (degrees) |
|---|---:|---:|---:|---:|
| `FULL8` | 8 | 0 | 0 | 0 |
| `Q_ONLY7` | 7 | 0.0101601538017 | 0.0104765619556 | 0.435235002264 |
| `Q_PLUS_R8` | 8 | 1.0435499073e-16 | 0 | 4.043848095e-14 |
| `PCA7` | 7 | 0.00601971361323 | 0.00627728861748 | 0.356297877076 |

## Quotient–residual checks

- Q+R standardized reconstruction max error: `3.5527136788e-15`
- Q+R raw reconstruction max error: `1.42108547152e-14`
- Q+R pair-distance max error: `8.881784197e-16`
- Q-only kernel-counterfactual max distance: `1.11022302463e-16`
- Q+R kernel-event detection rate: `1`

## What this establishes

Within the declared campaigns and tolerance, the quotient-only view hides the tested antisymmetric kernel direction, while the explicitly typed residual restores the full standardized coordinate state and the tested geometry.

`Q_PLUS_R8` is an eight-scalar coordinate transformation and exact reconstruction control. It is not a seven-dimensional compression result.

## Nonclaims

- no stability prediction or early warning
- no risk, causal, or control claim
- no physical AXIS08 identity
- no universal compression superiority
- Q_PLUS_R8 stores eight scalars and is not compression

## Numerical and evidence boundary

- Floating-point comparisons are bounded by the declared protocol tolerance.
- This computation result is not an independently observed outcome.

Inspection, interpretation, adoption, rejection, and continuation remain Human-owned.

This document is a faithful projection of `analysis.json` and `computation_result.json`. It is not an ORION Orientation Report, an independent observation, a Human decision, or a THE EYE A2 comparison result.
