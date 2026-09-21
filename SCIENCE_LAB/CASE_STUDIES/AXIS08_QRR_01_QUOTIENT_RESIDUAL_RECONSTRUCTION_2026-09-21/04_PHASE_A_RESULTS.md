# AXIS08-QRR-01 Phase A Results

Decision: `PHASE_A_EXACT_RESIDUAL_SUFFICIENCY_CONFIRMED`

## Primary result

All preregistered algebraic gates passed without retuning:

| Test | Result |
|---|---:|
| Synthetic family × weight cells | 10/10 PASS |
| `Q + delta` maximum reconstruction error | `8.881784197001252e-16` |
| `Q` kernel-counterfactual maximum distance | `8.881784197001252e-16` |
| `Q + delta` kernel-event detection | `1.0` in every cell |
| E8 roots reconstructed | 240/240 for both weights |
| E8 maximum reconstruction error | `0.0` |
| Zero-sum weights | rejected fail-closed |

The numerical values match the formal model: quotient-only records cannot
distinguish movement along the declared kernel direction. Adding the single
residual coordinate restores an invertible coordinate transform.

## Held-out reconstruction comparison

Across five synthetic families and two frozen weights, median normalized MSE:

| Representation | Stored scalars | Median held-out NMSE | Range |
|---|---:|---:|---:|
| `FULL8` | 8 | `0` | `0` |
| `Q_PLUS_DELTA8` | 8 | `1.59e-33` | `1.03e-33`–`3.11e-33` |
| `PCA7` | 7 | `0.00459` | `2.36e-5`–`0.12479` |
| `RANDOM7` | 7 | `0.12007` | `0.07829`–`0.14053` |
| `DROP8_TO7` | 7 | `0.12550` | `0.09770`–`0.18010` |
| `Q_ONLY7` | 7 | `0.14696` | `2.64e-5`–`0.31386` |

This is not a superiority result. `Q_PLUS_DELTA8` stores eight scalars and is
therefore an exact reconstruction control, not a seven-dimensional compression
method. PCA-7 is a strong generic reconstruction comparator on some families,
but it does not name the lost kernel coordinate or guarantee its semantic
meaning.

## Relation to Translation Fidelity

The earlier Translation Fidelity studies measured a robustness–information
trade-off among certificates. QRR-01 adds a mechanistic control: for one
declared quotient, the lost direction is known exactly and a sufficient
residual is constructible. It therefore strengthens interpretation of
fidelity loss without implying that every lossy representation has a known or
one-dimensional residual.

## IEEE disposition

IEEE/PEGASE was not executed. Existing current documentation describes a
maintained seven-feature IEEE geometry state, not a domain-justified AXIS08
eight-component state. Phase B remains gated. No eighth feature, paired
coordinate or weight may be introduced from visual convenience or after
examining desired outcomes.

Current transfer decision:

`HOLD_IEEE_TRANSFER_PENDING_DOMAIN_JUSTIFIED_EIGHT_COMPONENT_STATE`

Historical note: this was the Phase A disposition. The later, separately
preregistered Phase B gate identified the source-derived minimum/maximum
bus-voltage envelope and executed the bounded IEEE audit. See
`06_PHASE_B_IEEE_RESULTS.md`.

## Claim boundary

Supported: exact residual sufficiency for the declared affine quotient and
bounded deterministic comparison under the frozen Phase A data.

Not supported: novel linear algebra, universal compression advantage,
physical coupling, E8 physics, power-system transition detection, early
warning, risk, control or operational IEEE utility.
