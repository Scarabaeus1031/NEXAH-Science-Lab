# AXIS08-QRR-01 Phase B — IEEE results

Decision: `IEEE_TRANSFER_REPRESENTATION_FIDELITY_CONFIRMED`

Scope: bounded representation-fidelity audit on the committed IEEE-9
development and IEEE-14 evaluation campaigns. This is not a stability,
early-warning, risk or control study.

## Primary gates

All preregistered gates passed without evaluation refit:

| Gate | Result |
|---|---:|
| raw-source reproduction maximum error | `0.0` |
| `Q_PLUS_R8` standardized reconstruction maximum error | `3.55e-15` |
| `Q_PLUS_R8` raw reconstruction maximum error | `5.68e-14` |
| `Q_PLUS_R8` pair-distance maximum error | `1.33e-15` |
| `Q_ONLY7` kernel-counterfactual maximum distance | `2.22e-16` |
| `Q_PLUS_R8` kernel-event detection | `1.0` |
| IEEE-14 refit | `false` |

The first system-Python attempt stopped at import because NumPy was absent; it
performed no data calculation. The unchanged preregistered script then ran in
the bundled scientific Python environment.

## Fidelity comparison

The table reports normalized all-pairs distance RMSE against the standardized
eight-component reference and cumulative path-length error.

| Case | Representation | Scalars | Distance NRMSE | Path error | Turn-angle MAE |
|---|---|---:|---:|---:|---:|
| IEEE-9 development | `Q_PLUS_R8` | 8 | `5.75e-17` | `0.0%` | `5.53e-14°` |
| IEEE-9 development | `Q_ONLY7` | 7 | `4.70%` | `7.07%` | `1.63°` |
| IEEE-9 development | `PCA7` | 7 | `1.40e-7` | `1.02e-4%` | `8.50e-4°` |
| IEEE-14 evaluation | `Q_PLUS_R8` | 8 | `2.38e-16` | `3.20e-14%` | `1.48e-13°` |
| IEEE-14 evaluation | `Q_ONLY7` | 7 | `1.23%` | `1.13%` | `0.247°` |
| IEEE-14 evaluation | `PCA7` | 7 | `0.426%` | `0.454%` | `0.260°` |

IEEE-9 retains 17 converged frames and two explicit failed frames. IEEE-14
retains all 19 converged frames. Failed frames were not imputed or bridged.

## Interpretation

The positive result is the declared decomposition:

```text
eight-component state -> seven-coordinate quotient + explicit residual
```

Together, quotient and residual are an orthogonal change of coordinates and
retain the tested geometry and full reconstruction. Without the residual, the
operator is provably blind to its antisymmetric kernel direction and produces
measurable, though modest, geometry loss on IEEE-14.

The comparison also prevents an inflated claim: `Q_ONLY7` is not the strongest
seven-dimensional compressor here. Frozen PCA7 preserves IEEE-14 pair
distances better (`0.426%` versus `1.23%` NRMSE). AXIS08's contribution in this
test is therefore interpretability and an explicit loss certificate, not
compression superiority. `Q_PLUS_R8` stores eight scalars and is not a
compression method.

The maintained seven-feature IEEE view happens to preserve the IEEE-14 path
geometry exactly relative to this eight-feature reference because the added
maximum-voltage coordinate is constant along that evaluation campaign. This
does not hold on IEEE-9 and is a campaign-specific observation, not a general
invariance claim.

## Relation to Translation Fidelity

Phase B provides a domain-bound worked example of the Fidelity principle:
representation change can be audited as an explicit split between retained
coordinates and a named residual. It advances the mechanism and evidence
chain, while leaving the broader Translation Fidelity publication result and
its unresolved replay boundary unchanged.

## Claim boundary

Supported: exact quotient-residual reconstruction and bounded geometry-fidelity
measurements for the committed IEEE-9/14 load-scale campaigns under frozen
IEEE-9 fitting.

Not supported: electrical stability prediction, early warning, risk, causal
inference, control, physical AXIS08 identity, universal optimality or a new
mathematical theorem.

