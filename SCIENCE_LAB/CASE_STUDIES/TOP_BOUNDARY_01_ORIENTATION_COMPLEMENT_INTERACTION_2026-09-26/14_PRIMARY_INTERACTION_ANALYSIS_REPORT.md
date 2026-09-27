# 14 — Primary Interaction Analysis Report

**Execution ID:** `TOP-BOUNDARY-01-DRY-03`  
**Outcome:** `SYNTHETIC_INTERACTION_OPERATOR_VALIDATED`  
**Physical evidence:** `NONE`

## Outcome first

The complete four-state interaction operator was evaluated at all eight
orientations using the converged `8x` fractional-aperture representation.

All frozen controls passed:

| Check | Result | Limit |
|---|---:|---:|
| records present | `24 / 24` | complete |
| maximum linear-arm `abs(Delta_12)` | `1.1565e-15` | `<= 1e-12` |
| coherent cross-term identity NRMSE | `6.6200e-16` | `<= 1e-10` |
| coherent interaction nonzero | all 8 orientations | required |

The operator therefore distinguishes the additive null arms from the coherent
positive control exactly as preregistered.

## Four-state result

For each orientation the analysis retained:

```text
R(0), R(B1), R(B2), R(B1+B2)
```

and calculated the full signed map

```text
Delta_12 = R(B1+B2) - R(B1) - R(B2) + R(0).
```

The two linear arms close to floating-point precision. In the coherent arm,
the measured synthetic interaction agrees with

```text
2 Re(F1 conjugate(F2))
```

to numerical precision. This verifies the bookkeeping against the established
Fourier-optics identity; it does not discover that identity.

## Relation versus representation

The coherent interaction strength relative to the joint record is effectively
orientation invariant in the native frames:

```text
NRMSE(Delta_12 / joint intensity)
  cardinal orientations = 0.5773502911
  diagonal orientations = 0.5773503135
```

After returning each signed interaction map to the `0-degree` frame, the
cardinal return error is approximately `2.94e-08`, whereas the diagonal return
error is approximately `0.5193`.

This is the cleanest result of the digital sequence:

```text
interaction relation strength: stable across orientation
map representation after diagonal return: grid/interpolation sensitive
```

The relation and its rendered/registered view must therefore remain separate,
exactly as required by AREV-01, GARC-01 and OSR-01.

## Signal-scale planning

The deterministic planning sweep used the existing synthetic detector-noise
model. Mean error of the estimated coherent interaction was:

| simulated signal scale | mean interaction-estimation NRMSE |
|---:|---:|
| 1x | 17.6439 |
| 3x | 5.8803 |
| 10x | 1.7648 |
| 30x | 0.5885 |
| 100x | 0.1764 |
| 300x | 0.0589 |
| 1000x | 0.0177 |

`300x` is the first tested synthetic scale below ten-percent mean error. This
is not a camera exposure recommendation: the model does not include full-well
capacity, clipping, shot-noise scaling, laser stability or apparatus losses.
It establishes only that the earlier `1x` synthetic capture regime was
underpowered for interaction estimation.

## Scientific interpretation

The calculation shows that `Delta_12` is a useful primary discriminator:

- it vanishes for a declared additive linear chain;
- it isolates the known coherent cross term without inventing a new object;
- its scalar strength can remain invariant while its sampled view changes;
- its experimental estimate requires much higher effective SNR than the first
  dry-run model supplied.

It does not show that all boundary interactions are interference, that the
diagonal direction is physically privileged, or that a real apparatus will
match the synthetic model.

## Artifacts

- `interaction_primary/results.json` — complete machine-readable return;
- `interaction_primary/interaction_metrics.csv` — 24 arm/orientation rows;
- `interaction_primary/signal_scale_metrics.csv` — planning sweep;
- `interaction_primary/interaction_arrays.npz` — full signed maps and states;
- `interaction_primary/primary_interaction_residual.png` — derived visual;
- `src/run_primary_interaction_analysis.py` — generator;
- `tests/test_primary_interaction_analysis.py` — operator controls.

## Decision

```text
FOUR_STATE_OPERATOR = VALIDATED_SYNTHETICALLY
LINEAR_NULL_ARMS = PASS
COHERENT_POSITIVE_CONTROL = PASS
RELATION_VIEW_SEPARATION = OBSERVED_IN_SYNTHETIC_CHAIN
ORIGINAL_SYNTHETIC_SNR = INADEQUATE
PHYSICAL_RESULT = NONE
NEXT_GATE = PHYSICAL_EQUIPMENT_BINDING
```

