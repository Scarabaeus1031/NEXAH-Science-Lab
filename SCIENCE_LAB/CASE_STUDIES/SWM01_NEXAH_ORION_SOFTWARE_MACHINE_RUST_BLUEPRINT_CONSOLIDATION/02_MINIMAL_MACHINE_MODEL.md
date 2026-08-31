# Minimal Machine Model

## Recovered model

```text
REGISTERED SOURCE + REVISIONED STATE
  ├─ STRUCTURE/GEOMETRY
  │    Graph/Relation + Constraint
  │      -> Embedding + Frame + Metric
  └─ OBSERVATION/MEASUREMENT
       ObservationMap + ObservableDefinition
         -> MeasurementEvent -> MeasurementValue -> Readout

typed sources -> View -> declared CompareEvent
  -> InvariantAssessment | Difference | Ambiguity
  -> Residual | Abstention
  -> ReconstructionEvent and/or DecisionEvent
  -> ResultObject
  -> History + ProvenanceRecord
  -> ReturnAssessment / Reset / Repeat / Restart
```

## Judgment on the candidate diagram

The candidate is sufficient after four clarifications:

1. `COMPARE` is an `OperationRule` plus `OperationEvent`, never an implicit universal comparator.
2. invariant, difference, ambiguity and residual are result/assessment types, not new operators.
3. reconstruction and decision are different events and may occur independently.
4. return, reset, repeat and restart are separate typed actions; none erases prior history.

The diagram is slightly overcompressed, not overcomplete. It omitted explicit revision identity, rule/event/result separation, abstention as a decision result, and authoritative provenance links. Those are already recovered types, not new primitives.

`MINIMAL_MACHINE_MODEL=SUFFICIENT_AFTER_TYPED_EXPANSION`

`NEW_PRIMITIVE_REQUIRED=NO`

