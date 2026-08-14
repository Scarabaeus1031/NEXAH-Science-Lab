# A5XR Seed-Dominance Audit

The row-loss arithmetic itself matches accepted A2/A5:

`g_s=(1/N)Σ_i(loss0_i-loss1_i)`, using exact rationals from stored binary64 values; `G=Σg_s`; exact signed sorting uses gain descending and seed ID ascending; `D3` is the top-three sum; equality in `2D3<=G` passes.

Independent fixtures pass for exact 50%, immediately below, immediately above, negative contributions, cancellation, `G=0`, `G<0`, tied contributions, unequal row counts and fewer than three seeds.

## Blocking propagation error

A5XR calls `need(G>0)` and later `need(pass)`. Consequently:

- `G<=0` raises;
- valid `G>0, 2D3>G` raises;
- only a passing dominance artifact reaches P4.

Accepted authority distinguishes malformed/fewer-than-three (`INVALID_EXPERIMENT`) from a valid nonpositive/dominated scientific result (`P4=false`). A5XR collapses them. This changes reachable classification, not the estimand. **A5X-R31 seed derivation: FAIL (Class B).**
