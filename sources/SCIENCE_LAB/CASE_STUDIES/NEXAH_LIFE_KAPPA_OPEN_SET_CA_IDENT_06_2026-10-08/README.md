# CA-IDENT-06 · Kappa Open-Set Channel

Status: `EXECUTED AGAINST LOCK / COVERAGE GATE FAIL / UNKNOWN RESULT`

## Operational meaning of Kappa

The historical gap/seam reading is implemented as an abstention channel:

```text
kappa(x) = minimum distance from x to frozen known training support
kappa(x) > tau  ->  ABSTAIN_UNKNOWN
```

The metric uses the registered CA-IDENT-05 reverse control: `1/64` radial
Fourier plus `63/64` Shadow Memory. The threshold `tau` is the training-only
leave-one-seed-out 99th percentile. Kappa does not add a class and does not
close the seam.

## Result

The untouched R125-R224 evaluation bank contains 2,000 rows but no
`constant-count motion` row. The preregistered requirement was at least ten.
Consequently the coverage gate fails and unknown-detection utility is not
interpretable.

The known-side control is nevertheless bounded:

| Record | Value |
|---|---:|
| Known evaluation rows | 2,000 |
| False abstentions | 13 |
| Known specificity | 0.9935 |
| Accepted known accuracy | 0.9502 |
| Fourier/Memory seam disagreement | 0.0810 |

This shows that the frozen aperture is not indiscriminately rejecting known
states. It does not show that Kappa detects the registered unknown because no
such event arrived.

## Relation to the earlier Kappa work

The interpretation matches KAPPA-00: Kappa may be a signed/reconstructive edge
or residual record without becoming a new physical degree of freedom. It also
matches the Multi-Lens audit: an address or overlap mismatch should return
`ABSTAIN`, not a fabricated reconstruction.

## Next requirement

Future open-set evaluation needs prospective event acquisition. A discovery
bank may identify candidate unknown classes, but the evaluation protocol must
continue collecting frozen seeds until a predeclared event count is reached or
a predeclared maximum budget is exhausted. Model thresholds must remain fixed
throughout collection.

## Claim ceiling

No physical Kappa field, resonance, biological mechanism, Life/E8 identity,
quantum link or external utility is established.
