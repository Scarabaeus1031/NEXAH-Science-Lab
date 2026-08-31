# 03 — MJPR Typed Chain

## Exact conceptual level

```text
C (parameter space)
  contains c (parameter value)
  indexes f_c : ℂ → ℂ (generative rule)
  whose dynamics define J_c ⊂ ℂ (exact generated dynamical object)
```

An ideal registered observation may be written `y=P(J_c)`, with a compatibility set `Θ_y={c': P(J_c') compatible with y}`. This notation is conceptually typed, but it is not the computation MJPR-01 reported.

## Closed MJPR-01 operational level

```text
c
→ f_c and registered iterations on W∩G
→ E_c^{W,G,N,R}
→ y = P(E_c^{W,G,N,R})
→ Θ_P(y) = {c'∈C_441 : P(E_c')=y}
```

`E_c` is a finite escape-time representation, not `J_c`. P1/P5 were singleton on the registered 441-value family; P2–P4 contained numerical collisions. Those results remain exactly as closed.

## Type decision

Every arrow uses standard terminology: membership/indexing, parameterized map, iteration, finite numerical representation, observation map, and inverse-image/compatibility set. The newer role vocabulary makes the layers explicit but does not alter or strengthen MJPR-01.

`DOES_NEW_TYPE_VOCABULARY_CLEANLY_TYPE_CLOSED_CHAIN=YES`  
`MATHEMATICS_CHANGED=NO`  
`EXACT_JULIA_SET_SUBSTITUTED_FOR_FINITE_FIELD=NO`
