# A5 Exact Seed-Dominance Audit

A5 preserves the accepted signed row-weighted estimand. Each stored finite binary64 row loss is converted by its exact `as_integer_ratio` value; arbitrary-precision reduced rational arithmetic constructs every `g_s`, `G=sum g_s`, ranking and `D3`. There is no separately rounded aggregate or tolerance.

Independent fixtures covered exact half, exact fractions immediately above/below half, binary64 values around `.1`, negative contributions, cancellation, `G=0`, `G<0`, tied contributions with seed-ID tie-break, fewer than three seeds, and order independence. Outcomes match:

- `G<=0`: FAIL;
- fewer than three eligible seeds: INVALID;
- `G>0` and `2D3<=G`: PASS, including equality;
- `2D3>G`: FAIL.

Exact rational addition makes summation order irrelevant and the aggregate identity holds by construction. The supplied validator's convenience `dominance(values)` is not itself the registered artifact evaluator, but the operative prose/machine rule is unambiguous.

**A4-R25 and numerical boundary contract: PASS.**

