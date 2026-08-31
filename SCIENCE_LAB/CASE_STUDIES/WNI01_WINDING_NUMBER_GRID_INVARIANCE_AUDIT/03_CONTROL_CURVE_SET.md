# Control curve set

All expectations were fixed before representation changes. Parameter (tin[0,2pi]).

| ID | Curve / reference | Analytic expectation | Baseline evaluation |
|---|---|---:|---|
| C0 | (C=e^{it}, p=0) | +1 | `VALID +1` |
| C1 | (C=e^{-it}, p=0) | -1 | `VALID -1` |
| C2 | (C=e^{2it}, p=0) | +2 | `VALID +2` |
| C3 | (C=2+0.5e^{it}, p=0) | 0 | `VALID 0` |
| C4 | (C=sin t+isin 2t, p=0.5) | -1: right lobe traversed clockwise | `VALID -1` |
| C5 | (C=e^{it}, p=0.99) | +1; minimum separation 0.01 | `VALID +1` |
| C6 | (C=e^{it}, p=1) | undefined: reference lies on curve | `UNDEFINED` |

C4 is self-intersecting but does not cross its declared reference. C5 stresses near-reference resolution without changing topology. C6 is an invalid contract control.

The evaluator used 4096 ordered samples for baselines. This is a synthetic control set, not evidence about a physical system or historical NEXAH trajectory.
