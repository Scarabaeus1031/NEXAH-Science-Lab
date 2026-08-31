# Clock Cyclic Model

## Neutral definition

Let the state space be the quotient group

`C12 = Z/12Z`.

Choose the anchor `a = [0]`. Define the adjacent residues by addition:

- predecessor: `a - [1] = [-1] = [11]`;
- anchor: `a = [0] = [12]` when clock labels use 12 for zero;
- successor: `a + [1] = [1] = [13]`.

Therefore:

- `11 ≡ -1 (mod 12)`;
- `13 ≡ +1 (mod 12)`.

## Representation control

These views are related but not identical:

| view | representation |
|---|---|
| integer neighborhood | `11 | 12 | 13` |
| residue neighborhood | `[11] | [0] | [1]` |
| signed offsets from anchor | `-1 | 0 | +1` |
| clock labels | `11 | 12 | 1` |

`11` is not the integer `-1`; it is congruent to `-1` modulo 12. Likewise, integer `13` is not integer `1`. The clock label `12` represents the chosen zero residue only inside this declared convention.

## Source status

The historical clock document contains a twelve-sector clock motif and an `11–12–13` sequence. It does not explicitly state the modular equivalences above. The model is therefore an independent reconstruction using standard cyclic mathematics, compatible with but not attested by that wording.

No novel operator or invariant is introduced.
