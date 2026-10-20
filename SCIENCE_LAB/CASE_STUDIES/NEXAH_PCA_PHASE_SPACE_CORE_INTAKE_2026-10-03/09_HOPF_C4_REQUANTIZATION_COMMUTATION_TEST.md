# Hopf/C4 requantization commutation test

Date: `2026-10-03`

Status: `EXECUTED FORMAL CANDIDATE / GLOBAL COMMUTATION REJECTED / STEPWISE CLOSURE EXPLAINED / HISTORICAL OIL-RIS RULE OPEN / NO PHYSICAL CLAIM`

## Test question

Does the following square commute?

```text
             PT_gamma
      U(1) ------------> U(1)
       |                  |
       R                  R
       v                  v
       C4 -----T_RIS----> C4
```

The historical images do not define `R` or `T_RIS`. This test therefore uses
one explicit new candidate:

```text
PT(theta) = theta + 2pi/5              continuous Hopf quarter-arc, 72 degrees
R(theta)  = nearest element of C4      fixed half-open tie convention
T_RIS(k)  = k+1 mod 4                  discrete C4 rotation, 90 degrees.
```

These definitions are test fixtures, not recovered historical semantics.

## Result

The square does not commute globally:

```text
R o PT != T_RIS o R.
```

An exhaustive uniform scan of `360,000` phases gives:

| Comparison | Matches | Rate |
|---|---:|---:|
| one step, quantize only at the end | `288,000 / 360,000` | `0.8` |
| four steps, quantize only at the end | `72,000 / 360,000` | `0.2` |

The rates are properties of this declared nearest-C4 quantizer and uniform
scan. They are not universal constants or historical NEXAH values.

For the four exact C4 starting phases, one step agrees in all four cases. But
four continuous steps followed by one final quantization disagree with four
discrete RIS steps in all four cases:

```text
4 * 72 degrees = 288 degrees = -72 degrees mod 360 degrees
4 * 90 degrees = 360 degrees =   0 degrees mod 360 degrees.
```

The resulting closed-loop residual is `-72 degrees`.

## Why stepwise closure still appears

If the state is requantized after every continuous step, each `72-degree`
move is reset to the nearest `90-degree` C4 state:

```text
0 -> 1 -> 2 -> 3 -> 0.
```

That hybrid path closes for all four exact C4 starts. It closes because the
requantizer discards a `-18-degree` residual at each step, not because the
continuous and discrete transports are identical. Quantization placement is
therefore part of the operator contract:

```text
R o PT^4 != T_RIS^4 o R,
but (R o PT)^4 = T_RIS^4 on the exact C4 representatives
under the declared reset convention.
```

## Updated bounded interpretation

The tested candidate supports a three-register reading:

```text
OIL / continuous layer    path and U(1) transport
RIS / discrete layer      finite C4 state operation
Zipper / interface        requantization between the two registers
Residual                  phase discarded or retained at the interface.
```

This is a useful formal architecture, not a recovered definition of the
historical labels. Euler's formula supplies the phase representation; it does
not make OIL/RIS an Euler method.

## Reproduction

```text
python3 run_hopf_c4_requantization_commutation_test.py
python3 -m unittest test_hopf_c4_requantization_commutation.py
```

The runner writes `hopf_c4_requantization_commutation_test.json`.

## Claim boundary

```text
NEAREST_C4_REQUANTIZER = DECLARED_NEW_CANDIDATE
RIS_PLUS_ONE_ROTATION = DECLARED_NEW_CANDIDATE
GLOBAL_COMMUTING_SQUARE = REJECTED
ONE_STEP_EXACT_C4_START_CONTROL = PASS_4_OF_4
FOUR_STEP_END_ONLY_EXACT_C4_CONTROL = FAIL_4_OF_4
FOUR_STEP_STEPWISE_REQUANTIZED_CONTROL = PASS_4_OF_4
CLOSED_LOOP_CONTINUOUS_RESIDUAL = -72_DEGREES
STEPWISE_DISCRETE_CLOSURE_CAUSE = REQUANTIZATION_AND_RESIDUAL_LOSS
HISTORICAL_OIL_RIS_OPERATOR = OPEN
UNIVERSAL_MECHANISM = NO
NEW_PHYSICAL_CLAIM = NO
```
