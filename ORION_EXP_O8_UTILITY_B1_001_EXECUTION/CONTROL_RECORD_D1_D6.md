# Mandatory control record D1–D6

All mandatory controls PASS.

| Control | Observed result | Decision |
|---|---|---|
| D1 truth-label XOR 001 | BASELINE joint success 0; PLUS joint success 0 | PASS |
| D2 PLUS registry XOR 001 | PLUS joint success 0/1024 | PASS |
| D3 next-source mismatch | 1016/1016 UNIDENTIFIABLE in each arm; accepted recovery 0 | PASS |
| D4 metadata stripping | actions and equality vectors byte-identical | PASS |
| D5 ambiguity | 0 natural + 96 constructed; 96/96 UNIDENTIFIABLE in each arm; confident actions 0 | PASS |
| D6 source sorting | 96/96 UNIDENTIFIABLE in each arm; false O8 recovery 0 | PASS |

No control was weakened, repaired or reinterpreted after observation.
