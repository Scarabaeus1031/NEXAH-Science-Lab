# Cross-case Type Matrix

| Type role | Case A: graph | Case B: car | Case C: ratio | Case D: calendar |
|---|---|---|---|---|
| source/state | abstract graph registration | vehicle state | carrier set + partition registration | calendar/month record |
| structural relation | adjacency/incidence | driveline relation under declared assumptions | membership and selection | month order and attribute relation |
| embedding | vertex coordinates `E1/E2` | optional dashboard geometry only | optional layout of selected items | month-to-hand-position mnemonic |
| frame/metric | Euclidean plane | vehicle/ground and rotational frames | not needed for the ratio | not needed for day count |
| observable | embedded local angle | speed or engine rpm | selected/total counts | days in month |
| measurement event | optional angle-measurement event | speed/rpm sampling event | count/reduction event | registered lookup/retrieval event |
| value | angle with unit/uncertainty | speed/rpm with units/uncertainty | integer counts and ordinary ratio | integer day count |
| readout | angle annotation | gauge/text/indicator | `2/7` or `4/8` text/chart | remembered 30/31 category |
| view source | embedding or composite | measurement or composite | measurement/reduction source | composite record + mnemonic embedding |

## Required questions

1. Same grammar types all four cases: **yes**.
2. New primitive type required: **no**.
3. Geometry/measurement collapse required: **no**.
4. One view may contain both branches: **yes, as `CompositeSource`**.
5. Different states may produce the same readout: **yes**.
6. One state may produce several readouts: **yes**.
7. One abstract relation may have several embeddings: **yes**.
8. One embedding may have several views: **yes**.
9. `2/7` or `4/8` identifies its generating structure: **no**.
10. Calendar fact can survive a presentation change: **yes**.
