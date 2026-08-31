# Destruction Controls

| # | Candidate collapse | Evaluation |
|---:|---|---|
| 1 | same state = same history | rejected: ordered event records may differ |
| 2 | same state = same event | rejected: identity uses event ID |
| 3 | same result = same execution | rejected: distinct runs can yield equal results |
| 4 | return = inverse | rejected: state relation differs from map composition property |
| 5 | return = reset | rejected: later equality need not arise by assignment |
| 6 | reset = restart | rejected: field assignment differs from new execution |
| 7 | reset = history erasure | rejected: reset event extends history |
| 8 | restart = same run | rejected: restart creates new execution ID |
| 9 | restart = repeat | rejected: new execution differs from rule reapplication |
| 10 | repeat = same event | rejected: applications have distinct IDs |
| 11 | same rule = same event | rejected: rule identity is not event identity |
| 12 | same input = same event | rejected: input equality does not identify occurrence |
| 13 | same output = same provenance | rejected: lineage may differ |
| 14 | undo = inverse | rejected in general: compensation may be partial/one-sided |
| 15 | reconstruction = original event | rejected: reconstruction is later event/result |
| 16 | reconstruction = history reversal | rejected: deriving a record does not reverse chronology |
| 17 | final embedding = transform history | rejected: same coordinates can have different histories |
| 18 | zero readout = zero state | rejected: observable/calibration may produce zero |
| 19 | zero readout = empty history | rejected: readout says nothing about event list |
| 20 | same endpoint = same path | rejected by `H1/H2` control |
| 21 | same endpoint = same provenance | rejected: events/rules differ |
| 22 | equivalent state = identical representative | rejected by modulo-`2pi` control |
| 23 | full rotation return = no rotation occurred | rejected: event remains registered |
| 24 | involution = history erasure | rejected: two applications remain in history |
| 25 | closed state trajectory = erased provenance | rejected: endpoint equality preserves recorded lineage |

`DESTRUCTION_CONTROLS=25_OF_25_EVALUATED_AND_REJECTED`
