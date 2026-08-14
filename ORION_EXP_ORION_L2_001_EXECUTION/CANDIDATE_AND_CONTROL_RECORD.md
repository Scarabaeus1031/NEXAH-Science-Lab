# EXP-ORION-L2-001 — Candidate and Control Record

## Candidate observations

| ID | Proposition / representations | Expected → observed | Measured statistic | Registered rule | Match |
|---|---|---|---|---|---|
| C01 | RK4 source robustness, R0/reference | ROBUST → ROBUST | `7.332856313761761e-08` | `<=1e-5` | YES |
| C02 | R1 finite trajectory equivariance | EQUIVARIANT → EQUIVARIANT | `0.0` | `<=1e-9` | YES |
| C03 | R1 vector-field equivariance | EQUIVARIANT → EQUIVARIANT | `0.0` | `<=1e-11` | YES |
| C04 | R2 finite trajectory equivariance | EQUIVARIANT → EQUIVARIANT | `1.271088517760724e-13` | `<=2e-9` | YES |
| C05 | R2 vector-field equivariance | EQUIVARIANT → EQUIVARIANT | `3.8958546965271006e-14` | `<=1e-10` | YES |
| C06 | R3 convergent nonlinear trajectory equivariance | EQUIVARIANT → EQUIVARIANT | fine `3.644620638161532e-12`; ratio `0.06212531783954745` | fine `<=1e-3`; ratio `<=0.35` | YES |
| C07 | R3 nonlinear field pushforward | EQUIVARIANT → EQUIVARIANT | `3.6230712748823524e-14` | `<=1e-9` | YES |
| C08 | Mapped equilibria remain equilibria | EQUIVARIANT → EQUIVARIANT | `1.4210854715202004e-14` | `<=1e-10` | YES |
| C09 | Equilibrium Jacobian-spectrum coefficients | INVARIANT → INVARIANT | `3.1579677144893343e-16` | `<=1e-9` | YES |
| C10 | Divergence under R1–R3 | INVARIANT → INVARIANT | `0.0` | `<=1e-10` | YES |
| C11 | Raw Euclidean C+/C− distance under R2 | REPRESENTATION_DEPENDENT → REPRESENTATION_DEPENDENT | relative change `0.4577379737113252` | `>=0.25` | YES |
| C12 | Recover sign(x) from z-only R4 | UNDEFINED → UNDEFINED | exact collision at `z=27`, signs `+/-` | claimant must return UNDEFINED | YES |
| C13 | R5 color under palette reversal | REPRESENTATION_DEPENDENT → REPRESENTATION_DEPENDENT | seven fixture colors changed; bins fixed | changed `>=1`, bins fixed | YES |

C11 retains its metric counterexample. C12 retains the exact C+/C− collision and undefined reason. C13 retains the palette counterexample. No candidate produced unmatched failure evidence.

## Destructive controls

| ID | Destructive operation | Statistic | Registered threshold | Outcome |
|---|---|---|---|---|
| D1 | wrong R1 parameter `rho=27` | residual `1.0` | `>=0.5` | PASS TARGET DESTRUCTION |
| D2 | wrong R2 transport `S f(v)` | max residual `370.63995660684986` | `>=1` | PASS TARGET DESTRUCTION |
| D3 | wrong raw R2 Euclidean metric | relative change `0.4577379737113252` | `>=0.25` | PASS TARGET DESTRUCTION |
| D4 | z-only C+/C− collision | exact collision; UNDEFINED | one exact collision | PASS TARGET DESTRUCTION |
| D5 | reversed time orientation | endpoint residual `1.9260720405390066` | `>=1.9` | PASS TARGET DESTRUCTION |
| D6 | reversed palette | seven colors changed; bins fixed | changed `>=1`, bins fixed | PASS TARGET DESTRUCTION |

