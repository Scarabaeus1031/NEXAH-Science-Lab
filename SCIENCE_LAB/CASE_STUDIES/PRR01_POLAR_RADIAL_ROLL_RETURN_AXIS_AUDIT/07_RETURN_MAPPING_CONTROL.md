# 07 — Return Mapping Control

## Recovered source

EMP-03 registers, for `d>0` and `R>0`,

`J_R(d)=R²/d`.

Directly:

`J_R(R)=R`,

and

`J_R(J_R(d))=R²/(R²/d)=d`.

Thus `J_R` is an involution and equals its own functional inverse on the positive domain. With normalized coordinate `x=d/R` and `s=ln x=ln(d/R)`,

`J(x)=1/x` and `ln(J(x))=-ln x`, so `s→-s`.

The closed Run-05 CSV contains seven registered points confirming these identities. No new computation was run.

## Type boundaries

- `RETURN_MAP`: the rule `J_R`;
- `INVERSE_MAP`: a function undoing another under composition;
- `STATE_RETURN`: an executed path ending at a registered prior state;
- `PATH_REVERSAL`: traversal of a path in reverse order;
- `HISTORY_RETURN`: impossible merely from matching endpoint state because events accumulate.

Although this particular involution satisfies `J_R^{-1}=J_R`, the general terms remain distinct:

`RETURN_EQUALS_INVERSE=NO`  
`J_R_EQUALS_ITS_FUNCTIONAL_INVERSE=YES`  
`STATE_RETURN_EQUALS_HISTORY_RETURN=NO`  
`RETURN_MAP_SOURCE_STATUS=RECOVERED`

EMP-03 Run 06 further shows that exact algebraic return can survive a shifted false center; return is not a truth test. Run 07 requires an independent boundary anchor.

