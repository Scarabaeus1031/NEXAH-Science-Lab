# A2 R-01 Numerical Boundary Contract

## Estimand retained

Use the A1 signed, row-weighted decomposition on the frozen primary rows and already-fitted baseline/augmented predictions. No per-seed refit occurs.

## Canonical numeric representation

1. Primary probabilities and binary log-loss values are produced as finite IEEE-754 binary64 values under the frozen probability clipping rule.
2. For dominance only, each stored per-row loss value is converted to its exact rational representation `(numerator, denominator)` defined by its binary64 bit pattern, reduced to coprime arbitrary-precision integers with positive denominator. This is the operation conventionally exposed as `float.as_integer_ratio()`.
3. NaN or ±Inf in a probability, loss, contribution, or aggregate is `INVALID_EXPERIMENT` before comparison.

For carrier `c`, seed `s`, and fixed eligible rows `I_{c,s}`, define exactly

`g_{c,s} = (1/N_c) * sum_{i in I_{c,s}} (q(ell0_i)-q(ell1_i))`,

where `q` is the exact binary64-to-rational conversion and `N_c` is the exact integer number of carrier rows. This is algebraically identical to A1's `(n_s/N)(L0_s-L1_s)` but avoids intermediate rounded per-seed means.

## Deterministic arithmetic and order

- Rational addition, subtraction, multiplication, comparison, and reduction use arbitrary-precision integers exactly.
- Rows are traversed by ascending canonical row ID; seed groups by ascending integer seed ID. Exact rational addition is order invariant, but this order is mandatory for serialization/audit.
- Store every `g_s`, `G`, and `D3` as reduced integer numerator/denominator pairs.
- Rank `g_s` by exact rational value descending; break exact ties by ascending seed ID.
- Negative and zero contributions are retained unchanged.

## Decision

Let `G=sum_s g_s`. If fewer than three seeds have at least one eligible row, or if an upstream support/population gate is not PASS, return `INVALID_EXPERIMENT`.

If exact `G<=0`, return `FAIL_AGGREGATE_NONPOSITIVE`; no dominance ratio is formed.

Let `D3` be the exact sum of the three highest ranked signed contributions.

**[A2-R01-COMPARE]** When `G>0`, return `PASS` iff exact `2*D3 <= G`; return `FAIL_DOMINATED` iff exact `2*D3 > G`. No division, epsilon, tolerance, rounding, or approximate comparison is allowed. Exact equality passes.

Both carriers must return `PASS` for the frozen dominance criterion to pass.

## Edge rules

- A seed with zero eligible rows is excluded and reported as `NO_ELIGIBLE_ROWS`.
- A seed with rows but no endpoint variation remains included; log loss remains defined.
- Fewer than three contributing seeds is invalid, not a favorable zero-dominance result.
- A zero/negative aggregate fails and cannot be rescued by positive individual seeds.
- Reproducibility requires identical binary64 input bit patterns and identical serialized rational pairs.

## Mandatory boundary fixtures

- Six equal stored contributions whose binary64 value is `0.1`: exact `2*D3=G`, therefore PASS.
- Exact rational contributions `[0.10000000000000002,0.1,0.1,0.1,0.1,0.1]` encoded from their binary64 values: `2*D3>G`, therefore FAIL_DOMINATED.
- `G=0`: FAIL_AGGREGATE_NONPOSITIVE.
- `G<0`: FAIL_AGGREGATE_NONPOSITIVE.
