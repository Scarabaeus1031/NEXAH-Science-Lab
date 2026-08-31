# Operation versus Return Matrix

| Case | Rule/event | State/value return | Event return | Execution return | History return | Provenance equality |
|---|---|---:|---:|---:|---:|---:|
| `J_R` applied twice | two inverse-map applications | yes | no | same execution only if declared | no | no versus empty history |
| same reflection twice | two transform events | embedding equal | no | conditional | no | no versus no-event record |
| scalar reset | assignment to reference | one field/value yes | no | usually same execution | no | no |
| partial reset | assignment to subset | partial only | no | usually same execution | no | no |
| restart | new execution-start event | initial values may equal | no | no | no | no |
| repeat | rule reapplied | input/result may equal | no | conditional | no | no |
| undo | compensating event | declared fields may return | no | conditional | no | no |
| reconstruction | reconstruction event | represented state may equal | no | new/current execution context | no | reconstruction provenance differs |
| full turn modulo `2pi` | rotation event | equivalent, representative differs | no | conditional | no | no |

The word “return” must always be followed by the field and criterion that returned.

`UNDO_EQUALS_INVERSE=NO_IN_GENERAL`

`RETURN_ASSESSMENT_REQUIRES_COMPONENTWISE_TYPING=YES`
