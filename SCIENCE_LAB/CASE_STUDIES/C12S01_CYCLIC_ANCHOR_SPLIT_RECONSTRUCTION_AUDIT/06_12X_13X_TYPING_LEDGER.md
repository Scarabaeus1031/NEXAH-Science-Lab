# 12.x / 13.x Typing Ledger

Decimal notation is typed from its source context. It is not split into hidden integer/fraction operators.

| token | recovered uses | C12S type | exclusions |
|---|---|---|---|
| `12.6` | negative phase-like marker; week-valued window; Hz-like line in separate records | `SOURCE_DEPENDENT_DECIMAL_NUMBER` | not ordered pair `(12,6)`; not clock residue plus node count |
| `12.7` | chiefly version/filename occurrence in the bounded search | `UNDERDEFINED` | no stable historical quantitative role established |
| `13.6` | `-13.6 eV/n²` in a physics formula; also a log-scale range endpoint | `SOURCE_DEPENDENT_DECIMAL_NUMBER` | not one invariant across contexts |
| `13.7` | negative phase-like marker; week-valued window; Hz-like line in separate records | `SOURCE_DEPENDENT_DECIMAL_NUMBER` | not ordered pair `(13,7)`; not a clock-plus-center code |

## Arithmetic destruction control

Under ordinary decimal arithmetic:

- `13.7 - 12.6 = 1.1`;
- `0.6 × 0.7 = 0.42`.

The value `0.42` cannot be obtained from the first expression by silently changing subtraction to multiplication of fractional parts. That substitution is an operator change, not an invariant.

## Decision

No shared type, transformation, or cross-context invariant was found for the four tokens.
