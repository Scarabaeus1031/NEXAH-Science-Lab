# 02 — Typed Object Model

| Projection | Type | Question answered | Not sufficient for |
|---|---|---|---|
| `ID(X)` | unique object identifier | which concrete object? | current state, orientation or history |
| `OBS(X,t)` | time-indexed observable fields | what is currently observable? | identity or source |
| `ORIENT(X,t)` | orientation/symmetry class | how is it oriented? | motion or identity |
| `PROV(X)` | recorded derivation/source graph | where did it come from? | full execution trajectory |
| `GEN(X)` | derivation depth from recorded root | where in an ancestry graph? | temporal age or visible change |
| `F` | operator rule | what map could act? | proof that it executed |
| execution | typed event `(F,X,Y)` | what happened in one transition? | ancestry unless derivational |
| trace | ordered execution record | what sequence was attested? | source ancestry by itself |
| derivation | parent→child relation | what produced a new provenance node? | every state change |

The model permits partial operators: an operation may update only selected
fields. This is the mechanism that prevents automatic layer collapse.
