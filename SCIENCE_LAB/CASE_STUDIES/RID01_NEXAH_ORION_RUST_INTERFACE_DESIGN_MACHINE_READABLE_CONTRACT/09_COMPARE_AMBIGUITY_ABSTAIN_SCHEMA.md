# Compare / Ambiguity / Abstain Schema

A comparison requires a registered criterion, two revisioned inputs and an event identity. Outcomes are exactly:

`EQUAL | EQUIVALENT | DIFFERENT | INCOMPARABLE | AMBIGUOUS | ABSTAIN | ERROR`

No outcome is inferred from another. `ComparisonOutcome` cites both event and criterion. `InvariantResult`, `DifferenceResult` and `ResidualResult` are distinct records. A residual additionally requires a model rule, target, accounted result and remainder.

`AmbiguityRecord` carries at least two candidate references, causes and resolution status. It is not an error. `AbstainResult` records an authorized non-selection with reason; it is not failure and is not a coerced `DecisionResult`.

`DIFFERENCE_EQUALS_RESIDUAL=NO`

`AMBIGUITY_EQUALS_ERROR=NO`

`ABSTAIN_EQUALS_FAILURE=NO`

