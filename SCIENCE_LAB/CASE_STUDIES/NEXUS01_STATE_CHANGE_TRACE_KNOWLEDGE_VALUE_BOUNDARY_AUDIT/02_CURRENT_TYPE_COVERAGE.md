# Current Type Coverage

| Needed distinction | Frozen coverage | Assessment |
|---|---|---|
| Entity/revision identity | RID ObjectId/RevisionRef; OLS identity | Existing |
| State at time | SourceState/StateRef + event time/revision | Existing composition |
| Frame/representation | Frame, metric, embedding, observation map, view | Existing |
| Point identity | Registered result/local identity + coordinate + frame/source refs | Derived record sufficient |
| Sequence/trajectory | Ordered point/state refs + time/parameter + representation | Derived record sufficient |
| Transition/change | State before/after + rule/event/result/history | Existing |
| Derivative | Observable/derived value + method/unit/time basis | Derived record sufficient |
| Observation/trace | Map, event, value, readout, view, OTC trace composition | Existing composition |
| Evidence/provenance | Source evidence, immutable provenance and history | Existing composition |
| Comparison/invariant | Criterion + compatible operands + event/outcome | Existing |
| Ambiguity/abstention | RID typed outcomes and records | Existing |
| Interpretation/claim status | Proposition + evidence/method/scope/uncertainty | Derived record useful |
| Normative criterion | Registered criterion/policy/authority/objective | Existing composition |
| Decision | DecisionRule/Event/Result with authority; optional abstention | Existing |

The current architecture is explicit about rule/event/result and value/readout
separation. It does not name every convenience bundle, but no information-bearing
primitive needed by NEXUS-01 is absent.
