# Ghostgrid dyadic M-lift candidate contract

Date: `2026-09-28`

Status: `EXISTING_GHOSTGRID_PROCESS_TEST / M_CLASS_CANDIDATE_ONLY`

## Question

Can the established recurrence-to-97, gap-four cut to 101 and dyadic lift be
embedded in the Owner-supplied Ghostgrid process

```text
S(t) -> A + B -> Delta(A,B) -> G(t) -> R
```

while preserving an exact relation topology and a complete trace?

## Frozen operators

- recurrence `F` with seeds `(3,1)` and terminal displayed value `97`;
- cut `C4(x)=x+4`, used once at the typed cut state;
- lift `D(x)=2x`, iterated only after the cut;
- paired scale states `A_k=97*2^k`, `B_k=101*2^k`;
- whole/difference record `S_k=A_k+B_k`, `Delta_k=B_k-A_k`;
- return `R(S,Delta)=((S-Delta)/2,(S+Delta)/2)`;
- prior Root7 custody result that `101*2^j mod 11` returns after ten, not
  eight, dyadic steps.

## Pass rule

All state transitions, returns, normalized invariants, decimal carry boundary,
mod-11 period and operator-order controls must close exactly. The test may
identify a scale-equivariant multiplicative morphology candidate, but may not
promote the historical `M-Class`, which remains `EXPRESSION_ONLY` absent a
separate class contract.

## Claim ceiling

Finite exact arithmetic and two-node relation-graph similarity only. No prime
generator, resonance mechanism, physical field, universal topology or M-Class
promotion.
