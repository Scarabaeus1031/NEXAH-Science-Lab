# Reference-point control

Winding is relative to the connected component of the curve complement containing p.

For the same unit circle C=e^(it):

| Reference | Relation | W(C,p) |
|---|---|---:|
| p=0 | Inside | +1 |
| p=0.4 | Inside | +1 |
| p=0.99 | Inside, distance 0.01 | +1 |
| p=2 | Outside | 0 |
| p=1 | On curve | Undefined |

Thus W(C,p1) may differ from W(C,p2). Moving a reference across the curve passes through an invalid configuration.

Under a transform, reference convention must be declared. Q-Mirror especially shows that image winding about 0 and about Q(p) are different observables.
