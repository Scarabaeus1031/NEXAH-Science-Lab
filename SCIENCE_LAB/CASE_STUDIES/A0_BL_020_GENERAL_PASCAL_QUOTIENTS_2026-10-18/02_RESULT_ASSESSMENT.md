# A0-BL-020 — General Pascal Quotients result

Date: `2026-10-18`  
Status: `RESULT_READY / PASS_GENERAL_CYCLIC_FORMULAS_BOUNDED / EXECUTION_STOPPED / AWAITING_OWNER_DISPOSITION`

## Registered result

`PASS_GENERAL_CYCLIC_FORMULAS_BOUNDED`

The exact source lock passes `8/8`. Primary and Replay are byte-identical at
artifact SHA-256
`fa736cffc447118cd8874e6ccd4ab777cf9287c09076c6394bf97cbe6d7636ac`.
The registered-result SHA-256 is
`3587f54d34093dba730b5e0bf71d277d23127942c165806b55656848106a8490`.
Both verifier invocations pass `16/16`.

## Exact result

For the declared cyclic quotient:

```text
N_cyclic(m,d) = 1 + m*d*(d+1)/2
E_cyclic(m,d) = m*d^2
```

For the open-chain control:

```text
N_open(m,d) = N_cyclic(m,d) + d
E_open(m,d) = E_cyclic(m,d) + d
```

All formulas, weight-compatibility checks and `D_m` node/weight/edge actions
pass on all 120 frozen instances `m=3..12`, `d=1..12`.

| m | d | cyclic nodes | cyclic edges | open nodes | open edges |
|---:|---:|---:|---:|---:|---:|
| 5 | 6 | 106 | 180 | 112 | 186 |
| 6 | 6 | 127 | 216 | 133 | 222 |
| 7 | 6 | 148 | 252 | 154 | 258 |
| 8 | 6 | 169 | 288 | 175 | 294 |

## Interpretation

The SCC-003 counting and seam law does generalize exactly for this declared
static cyclic construction. The older `+21` continuation values
`133/154/175` are also exact, but only for the non-wrapped open-chain control.
They are separated from the cyclic values `127/148/169` by the six retained
exterior boundary levels at `d=6`.

This resolves the numerical ambiguity without resolving dynamic attachment.
The closed `A0-BL-021` result remains controlling: a static quotient formula
does not make two-face extension histories confluent and does not erase
history, seam or orientation variables.

## Claim boundary

Established only for the explicitly declared finite combinatorial family. Not
established: dynamic confluence; a universal attachment law; physical or
metric geometry; regular polygons/solids; a canonical new carrier; utility;
novelty; publication readiness.

Execution stopped after the authorized Primary, Replay and verifiers. The
result awaits Human Owner acceptance, revision request or rejection.
