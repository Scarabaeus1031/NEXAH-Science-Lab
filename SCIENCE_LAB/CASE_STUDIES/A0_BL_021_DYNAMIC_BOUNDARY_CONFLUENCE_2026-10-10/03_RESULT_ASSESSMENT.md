# A0-BL-021 — Result assessment

Date: `2026-10-10`

Lifecycle: `CLOSED`

Final accepted classification:
`VALIDATED_NEGATIVE_RESULT / PATH_DEPENDENT_WITH_WITNESS`

## Result

The complete declared enumeration produced:

| Readout | Value |
|---|---:|
| admissible six-face histories | 9 |
| admissible seven-face histories | 100 |
| exact typed terminal classes | 56 |
| Pascal nodes in every terminal state | 154 |
| terminal boundary edges | 9 |
| failed frozen controls | 0 |

The one-class confluence hypothesis fails. Two explicit histories with the
same 154-node count have different typed boundary words and different directed
Pascal edge counts. Therefore order, selected boundary seam or fresh-face
orientation retains information in the terminal quotient.

## What was established

- For the frozen `f=5 -> 7`, `d=6` attachment grammar, terminal typed state is
  not determined by face count or node count.
- The auxiliary Angle-Node / Corner-Flag word detects orientation information
  that plain cardinality erases.
- `5+2` and `6+1` are notation for genuinely comparable histories only after
  the intermediate seam choice and orientation are declared.
- The exact local result is reproducible by a byte-identical `R2` replay.

## What was not established

- no theorem for arbitrary face count or Pascal depth;
- no result for eight faces;
- no metric heptagon, octagon, polygon ladder or solid;
- no physical dynamic boundary, flow, stability or resonance;
- no `MONAD(t)`, O-C-O or dodecahedron mechanism;
- no new canonical A0 Family, PENT-08 or publication claim.

## Disposition

The Human Owner accepted the final disposition on `2026-10-10`. `A0-BL-021`
is closed as a bounded negative confluence result. A successor may ask for
conditions that select a single terminal class, but it requires a new
admission and must not be smuggled into this completed run.

## Post-result 7×8 crosswalk

The 56 two-step position addresses form the exact grid
`{1,...,7} × {1,...,8}`. This address set and the 56 typed terminal classes
have equal cardinality but are not canonically identified by the frozen run:
individual address cells can reach several classes and individual classes can
be reached from several address cells. The 100 oriented histories form the
incidence relation between the two 56-element sets.

See [07_POST_RESULT_7X8_ADDRESS_CLASS_CROSSWALK.md](07_POST_RESULT_7X8_ADDRESS_CLASS_CROSSWALK.md).
