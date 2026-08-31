# 12 — Destruction and Positive Controls

## Destruction controls

| ID | forced collapse | result | reason |
|---|---|---|---|
| D1 | same glyph→same role | REJECTED | binding/type/context determine role |
| D2 | Q label→quaternion | REJECTED | no `Q→H` map or operations |
| D3 | four points→quaternion basis | REJECTED | cardinality does not define algebra |
| D4 | rotation→quaternion multiplication | REJECTED | rotations have lower-dimensional/matrix/complex models |
| D5 | stick→`j` | REJECTED | visual axis has no basis-unit equation |
| D6 | complex `i`→full quaternion `i` component structure | REJECTED | one slice needs only one imaginary unit |
| D7 | `C_i≅C_j`→identical elements | REJECTED | isomorphism maps distinct fixed-basis elements |
| D8 | multiple views→extra dimensions | REJECTED | projections/views do not enlarge state type |
| D9 | mirror→negative quaternion basis | REJECTED | reflection is not basis multiplication |
| D10 | 90°→`ij=k` | REJECTED | angle alone lacks ordered product |
| D11 | Q1–Q4→`1,i,j,k` | REJECTED | 24 arbitrary bijections, no operation preservation |
| D12 | Q1–Q6→six-dimensional quaternion | REJECTED | `H` has four real dimensions |
| D13 | Mandelbrot–Julia link→quaternion dynamics | REJECTED | closed system is complex; slice copy suffices |
| D14 | π/φ/√2→quaternion generators | REJECTED | constants are not basis-generating rules |
| D15 | prime pattern→algebraic anti-lock | REJECTED | no defined algebra or controlled result |
| D16 | visual coherence→algebraic closure | REJECTED | closure requires an operation on a set |

`DESTRUCTION_CONTROLS=16_OF_16_COLLAPSES_REJECTED`

## Positive controls

Using the standard multiplication table:

```text
i*j=k
j*i=-k
j*k=i
k*j=-i
```

This demonstrates noncommutativity. Separately, for one slice `C_i`,

`(a+bi)(c+di)=(ac-bd)+(ad+bc)i∈C_i`,

so one complex slice is closed without `j` or `k`.

The discriminator therefore works:

`POSITIVE_CONTROLS=PASSED_STANDARD_H_AND_COMPLEX_SLICE`.

No historical Q/rope/stick mapping passes the same test.

