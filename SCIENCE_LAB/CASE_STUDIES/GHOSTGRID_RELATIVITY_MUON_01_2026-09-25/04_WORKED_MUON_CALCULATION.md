# Worked muon calculation

Status: `DERIVED_RESULT / DIDACTIC_FIXED_FIXTURE`

## The factor near 22

From the PDG mean lifetime,

\[
c\tau_0=658.638364\ \mathrm{m}.
\]

For a 15 km path,

\[
\frac{L}{c\tau_0}=22.774258.
\]

This is the number of rest-frame mean decay lengths contained in 15 km when
the speed is approximated by \(c\). It is not a symmetry order, dimension,
Ghostgrid level count, or universal constant.

## The 0.99c correction

At \(\beta=0.99\),

\[
\gamma=7.088812,
\]

not 22. The idealized Earth-frame mean decay distance is

\[
\beta\gamma c\tau_0=4622.274\ \mathrm{m},
\]

and the 15 km survival probability in this fixed fixture is approximately

\[
P=0.0389625.
\]

Without time dilation the same simplified calculation gives approximately
\(1.02\times10^{-10}\).

The gamma required for one mean lifetime over 15 km, retaining beta in the
distance relation, is about `22.7962`, corresponding to
`beta = 0.99903738`.

## Two records, one event pair

For the 0.99c fixture:

| Quantity | Earth record | Muon record |
|---|---:|---:|
| path length | 15000 m | 2116.0104 m |
| elapsed coordinate/proper time | 50.540014 microseconds | 7.1295464 microseconds |
| muon spatial displacement in its rest frame | not applicable | 0 m |

The coordinate values differ. The event identity and spacetime interval agree.

## Deterministic verification

The executable check reports:

```text
round-trip time residual   = 8.81e-20 s
round-trip position residual = 2.91e-11 m
relative interval discrepancy = 7.54e-15
```

All preregistered floating-point thresholds pass. This validates the small
calculation and mapping implementation, not special relativity itself.

