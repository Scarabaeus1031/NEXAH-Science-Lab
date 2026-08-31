# Rust-facing Type Candidate

## Status

This is a language-neutral interface sketch. It is not Rust code, an API commitment or implementation authorization.

| Candidate type | Required fields | Optional fields | Identity | Comparable properties | May change under transform | Forbidden conflations |
|---|---|---|---|---|---|---|
| `Anchor` | `anchor_id` | label | ID | identity/equality | embedded position | origin, zero |
| `Ray` | `ray_id`, `anchor_id`, nonzero direction reference, `frame_id` | orientation tag | ID plus declared anchor/direction | shared anchor, direction in same frame | coordinate direction | edge, axis, sign |
| `Edge` | `edge_id`, endpoint IDs | directed flag, label | endpoint/ID policy | adjacency, incidence | rendered segment | ray, stroke |
| `Junction` | `node_id`, incident IDs | ordering in an embedding | node and incident set | degree, shared incidence | visible openings | angle, triangle |
| `Graph` | vertex IDs, edge records | labels | declared graph identity | isomorphism/invariants | nothing under re-embedding | embedding, view |
| `Embedding` | `embedding_id`, graph ID, target dimension, coordinate map | constraints | ID plus complete coordinate map | congruence/affine relations under named rule | coordinates, lengths, angles | graph, view |
| `Frame` | `frame_id`, basis, origin/reference declaration | handedness | declared basis/reference | coordinate conversion | components | view, axis |
| `Metric` | `metric_id`, domain, evaluation rule | units | rule identity | compatible lengths/angles | derived values if metric changes | frame, view |
| `AngleMeasurement` | two ray IDs, embedding ID, metric ID, value | orientation, units, uncertainty | measurement ID or complete provenance tuple | values only under compatible definitions | value/uncertainty | incidence, degree |
| `View` | `view_id`, embedding ID, observation rule | crop, camera, resolution | observation specification/output policy | image-space features | all rendered properties | graph, embedding |
| `Transform` | transform ID, source/target kind, rule | parameters | rule and parameter identity | preservation class | declared source properties | event, view |
| `EmbeddingPath` | path ID, graph ID, parameter domain, embedding family rule | sampling | family rule and graph | values at compatible parameters | coordinates, metric geometry | physical trajectory/coil |

## Interface judgment

These distinctions can make invalid collapses harder to represent: an angle record must cite an embedding and metric; a view must cite an embedding; graph degree is stored independently of coordinates.

`RUST_FACING_TYPE_INTERFACE_USEFUL=YES_CONCEPTUALLY`

`RUST_IMPLEMENTATION_CREATED=NO`
