# Reconstruction / Decision Schema

Reconstruction and decision use separate rules, events and results.

`ReconstructionSpec` declares method and assumption policy. Its event cites sources, result, execution and order. Its result must state `original_event_identity=false`; similarity or state equality cannot change that field.

`DecisionRule` declares authority, outcome space and whether abstention is allowed. `DecisionEvent` requires rule, inputs, execution, order and authority. `DecisionResult` requires both event and rule. An abstention remains `AbstainResult`, not an invented decision outcome, unless a separate decision rule explicitly defines abstention as an allowed result.

`RECONSTRUCTION_EQUALS_ORIGINAL_EVENT=NO`

`RECONSTRUCTION_EQUALS_DECISION=NO`

