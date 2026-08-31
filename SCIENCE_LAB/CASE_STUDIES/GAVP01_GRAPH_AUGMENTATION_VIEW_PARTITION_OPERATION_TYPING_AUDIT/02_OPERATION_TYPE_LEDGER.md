# Operation Type Ledger

| Term | Primary type | Input | Output | Required record |
|---|---|---|---|---|
| source graph | `SOURCE_OBJECT` | none | graph identity | vertices, edges, provenance |
| augment rule | `OPERATION_RULE` | compatible structure, possibly geometry | augmentation specification | rule/version and dependencies |
| augment application | `OPERATION_EVENT` | source + rule | augmented result | event ID, inputs, rule, result ID |
| augmented graph | `RESULT_OBJECT` | augmentation event | new graph identity | complete new structure and lineage |
| embedding rule/map | `OPERATION_RULE` | graph | coordinate realization | target space/frame and map |
| transform | `OPERATION_RULE` | embedding | embedding | map/parameters |
| transform application | `OPERATION_EVENT` | source embedding + transform | result embedding | ordered provenance |
| transform history | `PROVENANCE_RECORD` | events | ordered chain/composite | event order and intermediate IDs |
| partition rule | `OPERATION_RULE` or declared relation rule | set, region or quantity | partition/result | domain and criteria |
| partition result | `RESULT_OBJECT` / `RELATION` | source + rule | parts and coverage relations | membership/boundary provenance |
| observation map | `OBSERVATION` rule | source | observation space | map/configuration |
| measurement event | `OPERATION_EVENT` | map + observable + source | measurement outcome | event/provenance |
| readout rule | `OPERATION_RULE` | measurement value(s) | display representation | formatting/unit transformation |
| view | `VIEW` | embedding, measurement or composite source | representation | source-kind and rendering provenance |

The verb and noun forms do not collapse: augment is not the augmented graph; transform is not the transformed embedding; measure is not the value; render is not the view object.

`TRANSFORM_EQUALS_RESULT=NO`
