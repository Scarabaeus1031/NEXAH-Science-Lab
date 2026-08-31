# Return Type Ledger

| Type | Criterion | What returned | What is not implied |
|---|---|---|---|
| R0 — No return | no declared relation to an earlier state is satisfied | nothing | future impossibility |
| R1 — Exact state return | all fields in the declared state schema equal an earlier state | complete declared state | equal event/history/provenance |
| R2 — Coordinate return | coordinate equals an earlier coordinate | coordinate only | full-state equality |
| R3 — Equivalence return | `Xn ~ X0` under a declared equivalence relation | equivalence class | identical representative |
| R4 — Approximate return | `d(Xn,X0) <= epsilon` for declared metric/tolerance | tolerated neighborhood | exact equality |
| R5 — Representational return | `R(Xn)=R(X0)` | rendered/readout value | underlying-state equality |
| R6 — Reconstructed return | earlier state is reconstructed from records | reconstruction result | dynamic revisit or original event |
| R7 — Reset | declared fields are reinitialized to reference values | assigned fields | erased history |
| R8 — Restart | new execution starts from declared start configuration | start configuration | same execution/event |
| R9 — Repeat | a rule or procedure is executed again | operation class | same event, input or result |
| R10 — History-preserving return | a state-return criterion succeeds and prior history remains registered | state relation only | history return |

Minimal neutral definition:

> Return is satisfaction of a declared state relation to an earlier registered state after a non-empty transition history.

The definition must name the compared projection/fields and equality, equivalence, metric or rendering criterion. It composes existing records and is not a new primitive.

