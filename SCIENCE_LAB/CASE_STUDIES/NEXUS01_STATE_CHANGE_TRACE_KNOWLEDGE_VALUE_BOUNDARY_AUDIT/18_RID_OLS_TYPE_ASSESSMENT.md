# RID / OLS Type Assessment

| Candidate | Classification | Composition |
|---|---|---|
| NexusRecord | NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE | Typed bundle of existing entity/state/time/frame/representation/observation/provenance refs |
| StateSpaceRepresentation | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | Source state + embedding/observation map + frame/metric + provenance |
| StateSpacePoint | DERIVED_RECORD_SUFFICIENT | Coordinate + representation/state/time/frame refs + point identity |
| TrajectoryRecord | DERIVED_RECORD_SUFFICIENT | Ordered compatible points/states + parameter/time + provenance |
| TransitionRecord | EXISTING_TYPE_SUFFICIENT | Operation/event with before/after state and history |
| DerivativeRecord | DERIVED_RECORD_SUFFICIENT | Observable/measurement + derivative method/basis/unit/uncertainty |
| EvidenceBundle | DERIVED_RECORD_SUFFICIENT | Evidence refs + proposition/scope/method + provenance |
| InterpretationClaim | NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE | Proposition + evidence + inference method + status/scope/uncertainty |
| KnowledgeStatus | NEW_TYPE_USEFUL_BUT_NOT_PRIMITIVE | Derived epistemic status over claim/evidence assessment |
| NormativeCriterion | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | Registered criterion/policy/objective + scope + authority/version |
| DecisionRecord | EXISTING_TYPE_SUFFICIENT | DecisionRule/Event/Result or authorized AbstainResult |
| HumanAuthorityRef | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | Registered authority identity/reference + provenance/scope |

## Assessment

The convenience records make dependencies visible, but all substantive content
already fits registered identities, states, frames, maps, values, views, criteria,
events, outcomes, decisions, history and provenance. A `KnowledgeStatus` is not a
truth primitive; it is a scoped claim-assessment interface.

```text
NEW_OLS_PRIMITIVE_REQUIRED=NO
RID_SCHEMA_GAP_FOUND=NO
```
