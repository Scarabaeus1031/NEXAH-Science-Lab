# History and Provenance Control

Define:

- Path A: `X0 -> X1 -> X2 -> X0`
- Path B: `X0 -> Y1 -> Y2 -> Y3 -> X0`

Both satisfy the same endpoint criterion. Their ordered event IDs, intermediate state IDs, transition count and lineage differ.

| Comparison | Result |
|---|---|
| `endpoint(A)=endpoint(B)` | yes |
| `history(A)=history(B)` | no |
| `path(A)=path(B)` | no |
| `provenance(A)=provenance(B)` | no when event/lineage records are included |
| endpoint return erases either history | no |

History is an ordered registered record, not the current state. Provenance binds source, rule, execution, event and result lineage. Two equal final values therefore remain distinguishable without inventing a hidden state variable.

- `SAME_ENDPOINT_IMPLIES_SAME_PATH=NO`
- `SAME_FINAL_STATE_IMPLIES_SAME_HISTORY=NO`
- `STATE_RETURN_DISTINCT_FROM_HISTORY_RETURN=YES`

