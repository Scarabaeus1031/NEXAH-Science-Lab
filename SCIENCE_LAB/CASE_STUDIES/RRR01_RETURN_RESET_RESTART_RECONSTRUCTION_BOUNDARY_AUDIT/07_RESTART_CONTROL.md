# Restart Control

Define:

```text
RUN_1:
  execution_id=r1
  initial_state=X0
  history=H1

RUN_2:
  execution_id=r2
  initial_state=X0
  history=H2
```

where `r1 != r2`. Equal initial state values do not identify executions. Starting `RUN_2` registers a new start/execution event and its own provenance even if every configured start value matches `RUN_1`.

`RESTART_CREATES_NEW_EXECUTION_EVENT=YES`

`RESTART_CONTROL_PASSED=YES`

`EQUAL_START_VALUES_IMPLIES_SAME_RUN=NO`

`RESET_EQUALS_RESTART=NO`

A reset modifies registered state fields within an execution unless specified otherwise. A restart begins a new execution identity.
