# Positive Controls

| # | Control | Verification | Result |
|---:|---|---|---|
| 1 | `x->-x` is a reflection on `R` | maps each real to its additive inverse, fixes 0, and squares to identity | `PASSED` |
| 2 | `s->-s` follows from `J_R` | `ln((R^2/d)/R)=ln(R/d)=-ln(d/R)` | `PASSED` |
| 3 | `s=0` is the PRR fixed point | `ln(d/R)=0 iff d/R=1 iff d=R` | `PASSED` |
| 4 | Cartesian frame supports `±x,±y` | oriented basis axes define opposite coordinate directions | `PASSED` |
| 5 | gear ratio changes transfer, not dimension | standard tooth/radius ratios relate input/output angular speeds | `PASSED` |

`POSITIVE_CONTROLS=5_OF_5_PASSED`

