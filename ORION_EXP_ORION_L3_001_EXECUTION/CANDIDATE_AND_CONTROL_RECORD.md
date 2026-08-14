# EXP-ORION-L3-001 — Candidate and Control Record

## Ten candidates

| ID | Chain / relation | Expected → observed | Statistic | Match |
|---|---|---|---|---|
| C01 | R0→R1 state/field transport | EQUIVARIANT → EQUIVARIANT | round-trip `3.55e-15`; field residual `3.61e-14` | YES |
| C02 | R0→R1→R2→R4 successor order | INVARIANT → INVARIANT | precision/recall `1/1`; order exact | YES |
| C03 | R0→R1→R2→R4 mutual-8NN | INVARIANT → INVARIANT | Jaccard `1`; weight defect `4.55e-15`; 4,539 edges | YES |
| C04 | R0→R1→R3 sign(x) from z | UNDEFINED → UNDEFINED | exact z=27 collision; claimant refused | YES |
| C05 | R0→R1→R2→R5 flow direction | ROBUST → ROBUST | tangent cosine `0.9999995`; estimated cosine `0.9999242` | YES |
| C06 | R0→R1→R4/R5 stability class | UNDEFINED → UNDEFINED | no equilibrium query/Jacobian; claimant refused | YES |
| C07 | R0→R1 raw Euclidean distance | REPRESENTATION_DEPENDENT → REPRESENTATION_DEPENDENT | relative change `0.45773797` | YES |
| C08 | R4→R6 layouts, graph incidence | INVARIANT → INVARIANT | minimum incidence precision/recall `1` | YES |
| C09 | R6 palette reversal | REPRESENTATION_DEPENDENT → REPRESENTATION_DEPENDENT | bins fixed; 771 colors changed | YES |
| C10 | R0→R6 identity from one color | UNDEFINED → UNDEFINED | C+/C− color collision; claimant refused | YES |

## Seven destructive controls

| ID | Operation | Measured statistic | Target broken |
|---|---|---|---|
| D1 | wrong `S f(u)` transport | residual `578.6494739352383` (`>=1`) | YES |
| D2 | deterministic 10% graph rewiring | 454 edges; Jaccard `0.8181454` (`<=0.83`) | YES |
| D3 | reverse transitions/tangents | recall `0`; cosine `-0.9999995` | YES |
| D4 | C+/C− z collision | exact collision; UNDEFINED | YES |
| D5 | raw R1 Euclidean metric | recurrence Jaccard `0.6505764`; distance change `0.457738` | YES |
| D6 | negate estimator training velocities | median cosine `-0.9999242` | YES |
| D7 | palette reversal/GRAY collapse | 771 changes; C+/C− collision retained | YES |

No candidate mismatch or failed target destruction occurred. Counterexamples and undefined reasons remain in the canonical classification result.

