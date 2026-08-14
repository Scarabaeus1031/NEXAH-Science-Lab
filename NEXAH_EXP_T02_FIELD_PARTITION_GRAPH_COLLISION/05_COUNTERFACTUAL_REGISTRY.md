# Counterfactual Registry

| Pair | `Δsource` | `Δmetric_geometry` | `Δcritical_structure` | `Δpartition` | `Δadjacency` | `Δconnectivity` |
|---|---:|---:|---:|---:|---:|---:|
| A amplitude | 1 | 0 | 0 | 0 | 0 | 0 |
| B geometry/collision | 1 | 1 | 1 (coordinates; count/classes preserved) | 1 | 0 | 0 |
| C adjacency | 1 | 1 | 1 (new maximum) | 1 | 1 | 0 |

`1` means prospectively required to change; `0` means required to preserve.
For B, “critical structure changes” refers to registered critical coordinates,
not count or class multiset. For A, derivative numerical values change although
zero sets/classes should preserve.

Applicability and expected certificate status are fixed before execution:

| Pair | C0 | C1 | C2 | C3 | C4 | C5 | C6 |
|---|---|---|---|---|---|---|---|
| A | CHANGE | CHANGE | PRESERVE | PRESERVE | PRESERVE | PRESERVE | PRESERVE |
| B | CHANGE | CHANGE | CHANGE | CHANGE | CHANGE | PRESERVE/COLLISION | PRESERVE |
| C | CHANGE | CHANGE | CHANGE | CHANGE | CHANGE | CHANGE | PRESERVE |

No output may be used to relabel an expected relation.

