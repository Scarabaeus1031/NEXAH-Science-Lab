# Operation versus Result Matrix

| Candidate | Source object | Operation rule | Operation event | Result object/relation | Provenance record | Observation/View |
|---|---:|---:|---:|---:|---:|---:|
| augment | graph | augmentation specification | application to graph/source geometry | augmented graph | source/rule/result lineage | no |
| embed | graph | coordinate map/schema | embedding registration | embedding | graph/frame/map lineage | no |
| transform | embedding | map `T` | application event | transformed embedding | ordered transform history | no |
| partition | set/region/quantity | membership/boundary/composition rule | optional construction event | parts + partition relation | source/rule lineage | no |
| observe | typed source | observation map | observation/measurement event | observation or value | configuration/event lineage | may feed view |
| measure | observable + source | measurement procedure | measurement event | measurement value | event/unit/uncertainty | may feed readout |
| render | embedding/value/composite | rendering rule | render event if registered | view object | source-kind/render lineage | yes |

Mandatory anti-collapses:

```text
augment != augmented object
transform != transformed embedding
partition rule != partition result
observe != observation result
measure != measurement value
render != view
```

The existing categories `SOURCE_OBJECT`, `OPERATION_RULE`, `OPERATION_EVENT`, `RESULT_OBJECT`, `RELATION`, `PROVENANCE_RECORD`, `OBSERVATION` and `VIEW` are sufficient.
