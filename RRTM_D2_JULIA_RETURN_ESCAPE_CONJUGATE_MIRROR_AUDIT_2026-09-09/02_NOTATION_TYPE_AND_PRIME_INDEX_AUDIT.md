# Notation, Type, and Prime-Index Audit

## Type gate

- `c∈C`: fixed Julia parameter, here `-3/4+i/10`.
- `z_n∈C`: iterated state.
- `(x_n,y_n)∈R²`: real-coordinate representation of `z_n`.
- `n∈N₀`: dimensionless discrete iteration index.
- `f_c`: parameter-indexed map, not a frequency.
- `N_escape`: iteration count, not physical time.
- `|z_n|`: dimensionless mathematical magnitude.

For `z_n=x_n+i y_n`,

`(x_n+i y_n)^2-0.75+0.10i = (x_n²-y_n²-0.75)+i(2x_ny_n+0.10)`.

Therefore:

`x_(n+1)=x_n²-y_n²-0.75` and `y_(n+1)=2x_ny_n+0.10`.

The complex and explicit R² implementations agreed over 585 predeclared state comparisons. Maximum absolute difference was `3.737461227697573e-13`, within the predeclared `1e-12` tolerance: `NUMERICALLY_REPRODUCED`.

## Prime correction

- `P_3=5`: `EXACT_ARITHMETIC`.
- `P_4=7`: `EXACT_ARITHMETIC`.
- `P_25=97`: `EXACT_ARITHMETIC`.
- `P_26=101`: `EXACT_ARITHMETIC`.
- “7 is the third prime”: `CONTRADICTED`.
- “7 is the fourth prime”: `EXACT_ARITHMETIC`.
- “97 is the twenty-fifth prime”: `EXACT_ARITHMETIC`.
- `3×25=75`, `4×25=100`, and `0.750=75/100=3/4`: `EXACT_ARITHMETIC`.

The relation `3×25=75` uses the prime indices of 5 and 97. A prime-index origin for the Julia parameter is not bound by the located generator or source records: `NEW_ADDITIVE_ANNOTATION`.

No inspected artifact explicitly expands the acronym `RRTM`; no expansion is assigned.
