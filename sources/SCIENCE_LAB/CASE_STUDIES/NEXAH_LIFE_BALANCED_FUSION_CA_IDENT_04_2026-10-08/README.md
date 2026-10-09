# CA-IDENT-04 · Balanced Fusion Audit

Status: `EXECUTED AGAINST LOCK / BALANCED FUSION NO GAIN / INTERNAL`

## Outcome

| View | Dimensions | Accuracy | Macro-F1 | Transient recall |
|---|---:|---:|---:|---:|
| Shadow Memory | 18 | 0.98 | 0.7763 | 0/1 |
| Radial Fourier | 4 | **1.00** | **1.0000** | **1/1** |
| Cube magnitude | 8 | 0.98 | 0.7852 | 0/1 |
| Legacy all-view fusion | 110 | 0.99 | 0.9869 | 1/1 |
| Balanced Memory + Fourier | 22 | 0.98 | 0.7700 | 0/1 |
| Balanced Memory + Fourier + Cube | 30 | 0.97 | 0.7632 | 0/1 |

Both preregistered gates fail. Equalizing view contributions after coordinate
standardization does not improve on radial Fourier. Cube magnitude changes the
balanced core by `-0.0068` macro-F1, so no Cube increment is observed.

## What we learn from the failure

CA-IDENT-03 could not be explained simply by the 72 Cube-face coordinates
dominating distance. The corrected balance also fails. Meanwhile the legacy
110-coordinate representation rises from `0.6305` on the prior split to
`0.9869` here. The fusion architecture is therefore sensitive to training and
holdout composition rather than uniformly defective.

Radial Fourier is the stable current lead: it was strongest in CA-IDENT-03 and
perfect on all 100 fresh CA-IDENT-04 rows. This is evidence for an internal
translation-invariant behavior signature, not evidence for carrier identity or
external utility.

## New bottleneck

The new holdout distribution is `60 extinct / 20 growth / 12 fixed / 7
period-2 / 1 transient`. The rare-class question is underpowered. The next
bounded test should be a preregistered coverage audit over a larger untouched
seed bank. It should freeze a minimum support per behavior class before any
model comparison and should test whether radial Fourier remains strong under
new rules and boundary conditions.

## Claim ceiling

Internal deterministic fixture only. No physical resonance, biological
mechanism, Life/E8 identity, quantum link, universal projection law or external
utility is established.
