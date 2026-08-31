# Dependency Ledger

| Object/operation | Graph | Embedding | Frame | Metric | Prior geometry | Observation | Measurement |
|---|---:|---:|---:|---:|---:|---:|---:|
| combinatorial graph augmentation | required | no | no | no | no | no | no |
| perpendicular-foot augmentation | required as lineage | required | required for coordinates | required | line `AB`, point `P` | no | no |
| Euclidean reflection | graph lineage | required | transform coordinates declared in frame | Euclidean structure | reflection axis | no | no |
| angle partition `y=y_L+y_R` | incidence lineage | required | only for signed orientation | required | interior ray `PH` | no | no |
| set partition | no in general | no | no | no | source set/domain | no | no |
| observation | source type only | conditional | conditional | conditional | conditional | observation map required | no event necessarily |
| measurement value | source provenance | conditional | conditional | conditional | observable definition | required | event/provenance required |
| readout | no directly | no directly | no directly | no directly | no | source measurement(s) | required |
| view | no directly | conditional source | conditional | conditional | conditional | no measurement required | conditional source |

Explicit results:

`PERPENDICULAR_CONSTRUCTION_REQUIRES_METRIC_GEOMETRY=YES`

`GRAPH_AUGMENTATION_IN_GENERAL_REQUIRES_METRIC=NO`

`VIEW_REQUIRES_MEASUREMENT=NO`

`OBSERVATION_REQUIRES_GRAPH_AUGMENTATION=NO`

The supplied linear chain is therefore not universally mandatory; dependencies branch by operation type.
