# Return / Reset / Restart / History Schema

`ReturnAssessment` is componentwise:

```text
field_or_projection
comparison_criterion_ref
earlier_state_ref
later_state_ref
relation = EQUAL | EQUIVALENT | NOT_EQUAL | UNKNOWN
history_equal
earlier_history_ref? / later_history_ref?
```

Return is an assessment, not an event type or inverse. A particular involution may be self-inverse, as PRR-01 records, without changing this general boundary.

`ResetEvent` requires reset fields, history reference and literal `preserves_prior_history=true`. `RestartEvent` requires prior and new execution IDs; semantic validation requires them to differ. `RepeatEvent` requires original and repeated event IDs; they must differ. `HistoryRecord` is append-only and orders event/state transitions.

`RETURN_EQUALS_INVERSE=NO`

`STATE_EQUALITY_EQUALS_HISTORY_EQUALITY=NO`

`RESET_ERASES_HISTORY=NO`

