# Current Type Coverage

| Candidate term | Classification | Existing coverage / boundary |
|---|---|---|
| Structure | `COMPOSITION_OF_EXISTING_TYPES` | Graph, relations, constraints, type/rule declarations |
| Instance | `EXISTING_TYPE` | registered global object ID + immutable revision |
| State(t) | `EXISTING_TYPE` / composition | SourceState/StateRef + time/revision/provenance |
| Time / transition | `EXISTING_TYPE` | event time, logical order, rule/event/result/history |
| Projection | `COMPOSITION_OF_EXISTING_TYPES` | ObservationMap or OperationRule/Event + frame + view provenance |
| Figure | `COMPOSITION_OF_EXISTING_TYPES` | source-typed View + embedding/readout + frame/render/loss records |
| Perceptual organization | `DERIVED_RECORD` | criterion/model/observer-relative grouping or partition of figure elements |
| Gestalt | `DERIVED_RECORD_USEFUL_BUT_NOT_PRIMITIVE` | figure ref + criterion/model/observer + grouping assertions + alternatives/uncertainty + provenance |
| Interpretation | `DERIVED_RECORD` | downstream claim/status/evidence/uncertainty composition |
| Object / source | `EXISTING_TYPE` | registered identity/revision and typed source lineage |
| Q° | `USEFUL_LABEL_NOT_PRIMITIVE` | derived marker in declared frame/view/projection |

No information-bearing primitive is missing. A convenience `GestaltRecord` could improve reviewability, but its complete content composes existing identity, view, relation/partition, comparison criterion, ambiguity and provenance records. It is not required by RID-01.
