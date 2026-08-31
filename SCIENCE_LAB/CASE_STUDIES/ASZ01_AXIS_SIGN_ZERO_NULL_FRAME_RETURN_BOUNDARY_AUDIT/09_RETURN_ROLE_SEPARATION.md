# Return Role Separation

| Role | Minimal meaning | Equals PRR `s->-s`? |
|---|---|---|
| `SIGN_REVERSAL` | algebraic replacement of a signed coordinate by its negative | instantiated by PRR in registered `s` coordinate |
| `REFLECTION` | transformation across a declared fixed set | yes in registered `s` coordinate |
| `RETURN_MAP` | registered map assigned a return role | yes, by PRR provenance |
| `PATH_REVERSAL` | traversal of a path in opposite parameter order | not implied |
| `STATE_RETURN` | endpoint/state equals a registered earlier state | follows after applying the involution twice, under the state definition |
| `HISTORY_RETURN` | prior trajectory/events are restored or erased | no |
| `FRAME_REVERSAL` | coordinate orientation is reversed | not required by an active PRR state map |

Thus switching `+s` to `-s` is the action of `J_R` in the chosen coordinate, but not every sign reversal is a return, and not every return is a sign reversal.

Results:

- `RETURN_EQUALS_SIGN_REVERSAL=NO_IN_GENERAL`
- `RETURN_EQUALS_PATH_REVERSAL=NO`
- `RETURN_EQUALS_HISTORY_RETURN=NO`
- `J_R_EQUALS_ITS_FUNCTIONAL_INVERSE=YES`

