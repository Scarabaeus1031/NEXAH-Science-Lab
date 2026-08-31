# 01 — ATS-01 Test Specification

## Frozen system

- Carrier: integers.
- Transition: `T(n)=n+1`.
- Primary anchor predicate: `P(n)` iff `n` is prime.
- Next-anchor rule: `next_P(a)=min{m>a:P(m)}`.
- Trace: the ordered tuple `(a,T(a),...,next_P(a))`; no state may be skipped.
- Distance: number of applications of `T`.
- Direction: supplied only by the explicit `+1` transition.
- Return: absent unless a separate inverse path is executed.

The primary interval is fixed to 97–101. Prime controls are exactly
`2,3,5,7,11`. The neutral predicate is `Q(n)` iff `5|n`, starting at 10.
GPT-01 and CROA-01 remain closed.
