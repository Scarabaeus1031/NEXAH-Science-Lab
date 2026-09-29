# ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE_01 result report

Date: `2026-09-29`

## Result

```text
PASS_ELINE_FOURIER_POINCARE_VIEW_EQUIVALENCE__CURVE_NOT_GEODESIC
```

All `10/10` checks passed. The eleven samples were embedded in the upper
half-plane and mapped with

```text
C(w)=(w-i)/(w+i).
```

Every mapped point lies strictly inside the unit disk; the largest radius is
`0.5451557156`. The inverse roundtrip is exact to numerical precision. Across
all `55` point pairs, the maximum discrepancy between upper-half-plane and
disk hyperbolic distances is `7.77e-16`.

Mapping the full Fourier reconstruction and mapping the original samples agree
to numerical precision. The three views therefore share the same sampled
carrier under declared transforms.

The eLinie trace is not a Poincare geodesic. Its upper-half-plane points are
neither vertical nor on one circle centered on the real axis; the fitted
circle-equation residual is `4.1711`, far above the frozen `1e-6` rejection
threshold. A vertical reference geodesic correctly maps to a disk diameter.

The distinction is therefore:

```text
same carrier / reversible view: PASS
same Euclidean shape:           NO
Poincare geodesic:              NO
```

Machine-result SHA-256:

```text
6457e1d98ff635064bb355f91af28b0ebb516e12edf374e3301dc717edf4e5eb
```
