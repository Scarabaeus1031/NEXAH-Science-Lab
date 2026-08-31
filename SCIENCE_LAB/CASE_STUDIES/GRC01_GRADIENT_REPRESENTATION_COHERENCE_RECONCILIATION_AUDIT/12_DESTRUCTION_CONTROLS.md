# 12 — Destruction Controls

| proposed collapse | counterexample / failure mode | result |
|---|---|---|
| object = representation | one system admits multiple charts/projections/images | REJECTED |
| point = coordinate | translating the origin changes coordinates, not the point | REJECTED |
| density = stability | slow sampling/projection can raise occupancy without stability evidence | REJECTED |
| gradient = flow | arbitrary vector fields need not be gradient flows | REJECTED |
| gradient = trajectory | a local vector is not an ordered global path | REJECTED |
| local direction = global object | many global fields/curves share one local direction | REJECTED |
| coherence = stability | alignment can be high in unstable or transient motion | REJECTED |
| low coherence = gate | a threshold needs an operational event contract and validation | REJECTED |
| visual similarity = dynamical equivalence | projections can look similar across non-equivalent systems | REJECTED |
| same pipeline = same system | one algorithm can process distinct systems | REJECTED |
| covariance = invariance | vector components rotate although the vector transforms lawfully | REJECTED |
| parameter robustness = universality | bounded robustness cannot quantify untested domains | REJECTED |

Additional break tests:

- changing KDE bandwidth can merge/split low-density regions;
- anisotropic coordinate scaling can change Euclidean alignment unless metric handling is explicit;
- zero vectors make normalized alignment undefined;
- the already documented Gate negative result breaks “gate implies transition detection.”

`DESTRUCTION_CONTROLS=12_OF_12_FALSE_COLLAPSES_REJECTED`.

