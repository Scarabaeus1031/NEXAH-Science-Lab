# Minimal Type System

| ID | Type | Minimum definition | Dependency |
|---|---|---|---|
| T0 | `Anchor` | declared reference node or point role | identity declaration |
| T1 | `Ray` | ordered pair `(anchor, nonzero direction)` | anchor, vector space and frame for coordinates |
| T2 | `Edge` | finite connection between declared endpoints | graph endpoint identities |
| T3 | `Junction` | node incident to at least two declared rays/edges | graph incidence |
| T4 | `VPair` | two distinct rays sharing one anchor | two ray identities |
| T5 | `YFork` | degree-three local junction | three incident ray/edge identities; no fixed angle |
| T6 | `Embedding` | coordinate realization `E:V -> R^n` | graph and target space |
| T7 | `Frame` | declared basis/orientation used for coordinates and signed directions | coordinate space |
| T8 | `Metric` | rule for length and angle | embedded space |
| T9 | `AngleMeasurement` | metric relation between two embedded nonzero directions | rays, embedding, metric; frame for signed orientation |
| T10 | `View` | representation, projection or observation of an embedding | embedding and observation rule |
| T11 | `Transform` | declared map between embeddings or views | source/target type and rule |
| T12 | `EmbeddingPath` | parameterized family `E_tau(G)` | fixed graph and parameter domain |

## Minimality

`Anchor` need not equal a coordinate origin. `Ray` and `Edge` cannot collapse because one is directed and half-infinite/role-defined while the other has two finite endpoints. `Junction` records incidence, not metric opening. `AngleMeasurement` cannot exist without embedded directions and a metric. `View` is downstream from the embedding.

No special NEXAH type is necessary.
