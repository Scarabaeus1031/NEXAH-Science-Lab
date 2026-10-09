# ILAU decision-rule boundary

## State classification

ILAU contains exactly four state classes:

| Class | Preserved meaning |
|---|---|
| `I` | retained or tested invariant candidate |
| `L` | lost |
| `A` | added |
| `U` | unresolved or not locally bound |

These classes describe representational or audit state. They do not, by themselves, determine a final decision.

## Decision rules

```text
ILAU_STATE_CLASSIFICATION != DECISION_RULE
UNIVERSAL_U_IMPLIES_HOLD = NO
A2_UNAVAILABLE_IMPLIES_HOLD = YES
```

The only preserved mandatory mapping is the narrower, explicitly bound production status `A2 UNAVAILABLE → HOLD`. Any other mapping from `U` to a decision requires an explicit typed rule with declared domain and codomain.

If no such rule exists:

```text
U remains explicit
the projection must fail closed or hold closed
```

This boundary prevents a zero aggregate residual, visual similarity or local retention from silently erasing unresolved state.
