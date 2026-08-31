# Architecture Relevance

| Required capability | Frozen support | Assessment |
|---|---|---|
| State | RRR/RID State and StateRef | sufficient |
| Event/transition | OperationRule, OperationEvent, ResultState | sufficient |
| Result | RID rule/event/result separation | sufficient |
| Trace | OTC composition of event/readout/view/history | sufficient |
| History | append-only ordered HistoryRecord | sufficient |
| Provenance | source/rule/event/result lineage | sufficient |
| Validation | RID invalid-state constraints and tagged non-values | sufficient |
| Ambiguity/abstention | RID compare/ambiguity/abstain outcomes | sufficient |
| Return criterion | componentwise ReturnAssessment | sufficient |
| Representation boundary | CRIP source/object/view/transformation records | sufficient |
| Path distinction | NEXUS trajectory/history/provenance composition | sufficient |

The R0–R10 ledger is a convenience taxonomy over these records. A useful taxonomy is not automatically a primitive. The central definition—satisfaction of a declared state relation after non-empty history—can be stored by existing comparison, state and history references.

- `RETURN_DEFINITION_STATUS=FORMALIZED_WITH_EXISTING_TYPES`
- `RETURN_PRIMITIVE_REQUIRED=NO`
- `EXISTING_ARCHITECTURE_SUFFICIENT=YES`
- `RID_SCHEMA_GAP_FOUND=NO`
- `NEW_OLS_PRIMITIVE_REQUIRED=NO`

