# Positive controls

| ID | Control | Result |
|---:|---|---|
| P1 | CCW circle under translation | +1 preserved |
| P2 | CCW circle under rotation | +1 preserved |
| P3 | Positive scale | W preserved for C0–C5 |
| P4 | Reflection | Signed W reversed; absolute W preserved |
| P5 | Double winding | Magnitude 2 retained under valid transforms/grids |
| P6 | Reference outside | C3 gives 0 |
| P7 | Reference on curve | C6 rejected as undefined |
| P8 | Adequate quantization | Q7/Q11/Q13/Q17 preserve C0–C5 |
| P9 | Destructive quantization | N=1 loses C0; N=2 unresolved |
| P10 | Roundtrip with coordinate difference | W returns despite normalized RMS up to 0.304 |
| P11 | Self-intersection | C4 recovers -1 about declared p |
| P12 | Q about 0 | Signed W follows exact negation rule |
| P13 | Q finite reference | Difference rule recovers 0 from 1-1 |
| P14 | Resolution ladder | C2/C4 fail closed at four samples |

All 14 bounded controls passed their preregistered expectations.
