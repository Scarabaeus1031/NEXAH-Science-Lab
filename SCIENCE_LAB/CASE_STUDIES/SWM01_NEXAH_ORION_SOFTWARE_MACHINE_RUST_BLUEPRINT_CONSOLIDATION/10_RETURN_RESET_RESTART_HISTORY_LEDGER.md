# Return / Reset / Restart / History Ledger

```text
X0 --event A--> X1 --event B--> X0'
X0' == X0             // under a declared state criterion
history(X0') = [A, B] // not empty
```

| Term | Required typed condition | History consequence |
|---|---|---|
| return | named field(s) satisfy named equality/equivalence criterion | earlier events remain |
| inverse | declared operation undoes another under a domain rule | both events remain |
| reset | selected state fields are assigned a baseline/default | reset event remains; other fields may differ |
| repeat | same rule/request is applied again | new event identity |
| restart | new execution begins under declared start conditions | prior execution/history remains linked |
| reconstruction | new result is produced from evidence/rule | new event and result, never original event |

`RETURN_IS_NOT_ERASURE=YES`

`RETURN_EQUALS_RESET=NO`

`RETURN_EQUALS_RESTART=NO`

`RETURN_EQUALS_RECONSTRUCTION=NO`

`STATE_RETURN_EQUALS_HISTORY_RETURN=NO`

`SAME_ENDPOINT_EQUALS_SAME_PATH=NO`

`SAME_RESULT_EQUALS_SAME_PROVENANCE=NO`

`PROVENANCE_PRESERVED=YES`

