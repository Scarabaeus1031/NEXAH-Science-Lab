# 15 — Destruction and Positive Controls

## Destruction controls

| ID | forced collapse | result |
|---|---|---|
| D1 | axis=shaft | REJECTED |
| D2 | axis=motion | REJECTED |
| D3 | radius=return | REJECTED |
| D4 | 2R=two operators | REJECTED |
| D5 | radial=rotational | REJECTED |
| D6 | forward=outward | REJECTED |
| D7 | backward=inward | REJECTED |
| D8 | clockwise=forward | REJECTED |
| D9 | coupling=transmission | REJECTED |
| D10 | shaft=coupling | REJECTED |
| D11 | rotation=translation | REJECTED |
| D12 | `v=ωR` implies `v=ω` | REJECTED by units/type |
| D13 | clutch=gate | REJECTED |
| D14 | contact=transport | REJECTED |
| D15 | vehicle-frame rest=global rest | REJECTED |
| D16 | four wheels=four dimensions | REJECTED |
| D17 | two wheels=two dimensions | REJECTED |
| D18 | one wheel=one dimension | REJECTED |
| D19 | Kardan=K operator | REJECTED |
| D20 | AUTO/class letters=formal mechanics | REJECTED |

`DESTRUCTION_CONTROLS=20_OF_20_COLLAPSES_REJECTED`

## Positive controls

- P1: `D=2R` for a circle — PASSED.
- P2: ideal rolling without slip `v=ωR` — PASSED as standard kinematic constraint.
- P3: angular motion is typed relative to a declared axis/frame — PASSED.
- P4: vehicle and ground frames give different translational descriptions — PASSED.
- P5: recovered EMP-03 `J_R(J_R(d))=d` — PASSED as an involution, not history return.

`POSITIVE_CONTROLS=5_OF_5_PASSED`.
