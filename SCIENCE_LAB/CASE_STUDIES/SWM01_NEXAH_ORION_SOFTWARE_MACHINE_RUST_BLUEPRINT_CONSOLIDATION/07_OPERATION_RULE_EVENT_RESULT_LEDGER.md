# Operation Rule / Event / Result Ledger

| Operation family | Rule | Event | Result | Mandatory lineage |
|---|---|---|---|---|
| transform | transform definition/parameters | transform application | transformed embedding | source, rule, event, result, order |
| augment | structural/geometric augmentation rule | augmentation application | augmented graph revision | dependencies and new identities |
| partition | criterion and domain | partition evaluation | parts/membership/boundary result | source, criterion, coverage |
| observe | observation map/configuration | observation/measurement occurrence | observation or measurement outcome | state, map, time/configuration |
| render | representation rule | render event | view | typed source and declared loss |
| compare | criterion and compatibility rule | comparison event | invariant/difference/ambiguity assessment | both inputs, rule, result |
| reconstruct | reconstruction rule | reconstruction event | reconstruction result | evidence, assumptions, uncertainty |
| decide | authority and decision rule | decision event | decision/abstention | authority, inputs, rationale |

An `Execution` orders events; a `History` preserves transitions; a `ProvenanceRecord` links evidence and identities. The three records overlap in references but are not aliases.

`OPERATION_RULE_EQUALS_OPERATION_EVENT=NO`

`OPERATION_EVENT_EQUALS_RESULT_OBJECT=NO`

`SAME_RESULT_EQUALS_SAME_EVENT=NO`

`RENDER_EQUALS_VIEW=NO`

