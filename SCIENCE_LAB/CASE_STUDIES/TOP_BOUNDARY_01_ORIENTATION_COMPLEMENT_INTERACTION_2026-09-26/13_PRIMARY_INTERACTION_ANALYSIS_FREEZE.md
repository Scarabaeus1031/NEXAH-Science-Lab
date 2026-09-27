# 13 — Primary Interaction Analysis Freeze

**Execution ID:** `TOP-BOUNDARY-01-DRY-03`  
**Authorization:** Human Owner resumed the parked case on `2026-09-26`  
**Scope:** complete digital interaction analysis; no physical execution

## Primary question

For every registered orientation, does the four-state contrast

```text
Delta_12 = R(B1+B2) - R(B1) - R(B2) + R(0)
```

correctly separate an additive linear boundary response from the known
coherent interference cross term?

## Frozen four-state matrix

| B1 | B2 | State |
|---:|---:|---|
| 0 | 0 | closed reference `R(0)` |
| 1 | 0 | first finite slit only `R(B1)` |
| 0 | 1 | second finite slit only `R(B2)` |
| 1 | 1 | both finite slits `R(B1+B2)` |

The matrix is evaluated at `0, 45, 90, 135, 180, 225, 270, 315 degrees`
using `8x` fractional aperture occupancy on the existing `257 x 257` grid.

## Arms and predictions

| Arm | Readout | Frozen prediction |
|---|---|---|
| `A_LINEAR_ISOTROPIC` | linear blurred aperture intensity | `Delta_12 = 0` to floating-point tolerance |
| `A_LINEAR_DISPERSION` | three fixed-axis translated linear channels | `Delta_12 = 0` to floating-point tolerance |
| `B_COHERENT_FOURIER` | squared magnitude of summed Fourier amplitudes | nonzero structured `Delta_12` equal to `2 Re(F1 conjugate(F2))` |

The two linear arms are null controls. The coherent arm is a standard positive
control. Agreement does not constitute a new optical result.

## Frozen checks

1. every arm has exactly eight orientation records and all four states;
2. maximum absolute linear-arm interaction is at most `1e-12`;
3. coherent interaction is nonzero at every orientation;
4. coherent `Delta_12` agrees with the analytical cross term with normalized
   RMSE at most `1e-10`;
5. signed full maps are retained before scalar summaries;
6. orientation-return error of the interaction map is reported, not forced to
   zero;
7. a deterministic signal-scale sweep `{1, 3, 10, 30, 100, 300, 1000}` reports
   the first simulated scale whose mean interaction-estimation NRMSE is below
   `0.10`; it is a planning diagnostic, not an exposure recommendation.

## Outcome vocabulary

| Outcome | Rule |
|---|---|
| `SYNTHETIC_INTERACTION_OPERATOR_VALIDATED` | checks 1–4 pass |
| `LINEAR_NULL_FAILURE` | either linear arm exceeds `1e-12` |
| `COHERENT_IDENTITY_FAILURE` | nonzero or analytical cross-term check fails |
| `INVALID` | records, outputs or provenance are incomplete |

## Claim boundary

This execution validates the four-condition operator and analysis pipeline in
declared synthetic models. It cannot validate real masks, light sources,
detectors, water, glass, film, color perception or an apparatus-level effect.

