# Type Ledger

| Type | Bounded meaning | Not identical to |
|---|---|---|
| `VALUE` | element of a declared value domain | sign, direction, label |
| `SIGN` | order/orientation classification relative to zero/reference | value, direction |
| `DIRECTION` | oriented displacement or ray role in a frame | sign, axis |
| `AXIS` | oriented coordinate line or rotation axis | direction, frame |
| `ORIGIN` | point assigned zero coordinates in a selected coordinate system | numerical zero, universal reference |
| `REFERENCE` | selected comparison value, point, state, or frame datum | origin, value type |
| `FRAME` | origin/basis/orientation data used to assign coordinates | axis, view |
| `TRANSFORMATION` | declared mapping between objects or representations | state, label |
| `STATE` | system condition at an instant or registered stage | path/history |
| `VIEW` | representation from a selected frame or projection | frame, object |
| `LABEL` | documentary token | typed role or value |

Anti-collapse result:

`VALUE != SIGN != DIRECTION != AXIS != FRAME != VIEW`

and:

`REFERENCE != VALUE_TYPE`

The same glyph `0` may denote different zero objects only after its type is declared.

