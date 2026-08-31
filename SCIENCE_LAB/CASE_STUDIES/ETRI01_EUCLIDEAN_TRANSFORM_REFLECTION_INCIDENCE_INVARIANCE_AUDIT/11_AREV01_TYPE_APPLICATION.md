# AREV-01 Type Application

| AREV type | ETRI-01 instance |
|---|---|
| `Anchor` | `A,B,P,H` |
| `Ray` | rays defining each angle and the two directions of lines |
| `Edge` | `AP,PB,AB`, later `AH,HB,PH` |
| `Junction` | triangle vertices; degree-three `P,H` in `G+` |
| `Graph` | `G` or explicitly distinct `G+` |
| `Embedding` | `E1`, reflected `E2`, or another transformed coordinate map |
| `Frame` | registered Cartesian frame |
| `Metric` | standard Euclidean inner product |
| `AngleMeasurement` | formal derived angle record with ray/edge provenance |
| `Transform` | named map with parameters and ordered provenance |
| `View` | rendering sourced from an embedding or composite record |

Every angle record cites:

- `embedding_id`;
- `metric_id`;
- vertex and incident ray/edge IDs;
- orientation convention if signed.

Every transformed object cites its source object and transform ID. `G+` receives a new graph ID rather than masquerading as `E2`.

`AREV_TYPES_SUFFICIENT=YES`

`NEW_CANONICAL_TYPE_REQUIRED=NO`
