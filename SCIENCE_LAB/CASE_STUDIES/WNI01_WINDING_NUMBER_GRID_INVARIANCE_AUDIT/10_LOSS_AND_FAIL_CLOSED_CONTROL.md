# Loss and fail-closed control

Controls use C0 unless noted.

| Destruction | Result | Classification |
|---|---|---|
| Remove order / supply unordered set | No path contract | `UNRESOLVED` |
| Deterministically shuffle samples | Phase jumps alias | `UNRESOLVED` |
| Break closure | Closed-curve contract absent | `UNRESOLVED` |
| Crop a segment | Closure/path lost | `UNRESOLVED` |
| Collapse to one angular sector | Evaluator yields 0 instead of +1 | `LOST` |
| Collapse to two sectors | π jumps ambiguous | `UNRESOLVED` |
| Remove orientation meaning with order unavailable | Signed value unavailable | `UNRESOLVED` |
| Put reference on curve | Integral/phase singular | `UNDEFINED` |
| Delete provenance | Value cannot be tied to transform/curve/reference contract | `UNRESOLVED_DOCUMENTARY_STATUS` |

Coarse quantization can change the recovered value even though the underlying continuous curve has not changed. This is loss of recoverability, not a change in the invariant of the original curve.

Failing closed is a positive result: no guessed winding is substituted for missing order, closure, reference validity, or resolution.
