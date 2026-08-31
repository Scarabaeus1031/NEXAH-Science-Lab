# Packet Segmentation Schema

The audit separates four object types:

1. `SYMBOL_SEQUENCE`: the ordered decimal glyphs `2 3 2 4 2 5`.
2. `SEGMENTATION_RULE`: explicit cut positions.
3. `PACKET`: the ordered segments created by that rule.
4. `INTEGER_VALUE`: the positive integer assigned to each segment under decimal interpretation.

The three authorized parsings are:

| Parsing | Packet | Integer objects |
|---|---|---|
| A | `2|3|2|4|2|5` | 2, 3, 2, 4, 2, 5 |
| B | `23|24|25` | 23, 24, 25 |
| C | `232|425` | 232, 425 |

Thus `SAME_DIGIT_SEQUENCE_IMPLIES_SAME_INTEGER_OBJECTS=NO`. The same glyph sequence persists, but the declared cuts create different integer objects.

## Packet role fields

- `Z`: integer value;
- `NP`: prime status and, where applicable, prime index;
- `FAK`: canonical prime factorization;
- `PAR`: parity;
- `POW`: perfect-power status;
- `REL`: verified arithmetic relation.

These are documentary fields and classifications, not mathematical operators.

Once a segment is interpreted as a fixed positive integer, its parity, primality, and canonical factorization are intrinsic to that integer. Packet membership and position remain relational metadata.

The symbols A–K are neutral packet identifiers. No semantics are derived from their letters.

