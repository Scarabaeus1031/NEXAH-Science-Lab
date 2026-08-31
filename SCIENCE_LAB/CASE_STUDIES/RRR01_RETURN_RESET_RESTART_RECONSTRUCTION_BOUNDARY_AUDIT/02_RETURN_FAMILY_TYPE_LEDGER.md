# Return-family Type Ledger

| Term | Standard formal type | Minimum condition | Does not imply |
|---|---|---|---|
| return | state relation/result | later state equals or is equivalent to earlier state under declared criterion | inverse, erased history |
| inverse | map relation | one- or two-sided composition equals identity on declared domain | executed return event |
| reset | operation rule/event | specified fields assigned registered reference values | prior-state reconstruction, history erasure |
| restart | execution-start event | new execution ID under declared start conditions | same run or same event |
| repeat | operation event | same rule/procedure applied again | same input, result, event or provenance |
| undo | compensating operation | declared variables/relations countered to specified criterion | two-sided mathematical inverse |
| reconstruction | result object + event/provenance | object/state/history description derived from records or constraints | original event or reversed history |
| state equality | relation | all fields in declared state representation equal | event/history/provenance equality |
| state equivalence | relation | declared equivalence relation holds | identical representative |
| history equality | relation | ordered registered event/provenance records equal under declared schema | final-state equality only |
| event identity | identity | same registered event ID | same rule/input/output only |
| provenance equality | relation | source, rule, event and lineage records equal | same result only |

These are refinements/uses of existing types, not new primitives.

`RETURN_EQUALS_INVERSE=NO`

`RETURN_EQUALS_RESET=NO`

`RETURN_EQUALS_RESTART=NO`

`RETURN_EQUALS_RECONSTRUCTION=NO`
