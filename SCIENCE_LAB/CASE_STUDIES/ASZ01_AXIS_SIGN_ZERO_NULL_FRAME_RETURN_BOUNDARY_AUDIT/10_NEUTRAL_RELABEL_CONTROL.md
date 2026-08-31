# Neutral Relabel Control

Human-facing labels were replaced as follows:

| Human label | Neutral token |
|---|---|
| left/right | `A- / A+` |
| down/up | `B- / B+` |
| zero/reference | `V0` |
| reflection/sign reversal | `T1` |
| PRR return map | `T2` |
| bowl/cap | `G- / G+` |
| gear selection | `M1 / M2` |

The typed structure remains:

- ordered coordinates have two sides and a selected zero;
- axis reversal exchanges signed labels;
- 2-D frame transformations preserve standard geometric invariants;
- `T2` acts as `s->-s` and is involutive;
- a mechanical ratio changes the input/output transfer relation.

All claimed symbolic semantics disappear without loss of the formal result.

`NEUTRAL_RELABEL_SURVIVES=YES`
