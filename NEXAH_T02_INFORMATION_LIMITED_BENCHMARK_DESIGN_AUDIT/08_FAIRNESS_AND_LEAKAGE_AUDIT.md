# Fairness and Leakage Audit

| Attack | Required defense | Current design status |
|---|---|---|
| oracle leakage | sealed law/test labels scorer-only | definable |
| asymmetric correspondence | no method gets hidden state maps | closed |
| asymmetric task semantics | identical `(Y,H,tau,cost)` | closed |
| unequal preprocessing | shared raw packet; preprocessing charged | closed in principle |
| hidden labels | train only; test scorer-only | closed |
| threshold trick | common adequacy threshold; method calibration train-only | closed |
| fixture bias | sample complete frozen process-family distribution | requires v3 specification |
| weak baseline | compulsory B8 plus family-appropriate standards | closed in principle |
| multiple opportunities | one primary external loss; family-wise secondary reporting | definable |
| post-hoc metric | loss/cost contract before implementation | currently missing external owner |
| NEXAH-specific scoring | same action loss for all | closed |
| circularity | truth from sealed population risk, not ledger | closed |
| predetermined result | near-boundary distribution and both failure modes | requires power/design proof |

## B7/B8 collapse attack

B8 cannot definitionally compute population risk from finite samples; it must
infer it. It has exactly the same task semantics as NEXAH, eliminating v2's unfair
advantage. NEXAH remains different only through estimator structure. If B8 is
consistent, infinite-data equivalence is expected and explicitly accepted.

No oracle or task-information asymmetry is required for the candidate benchmark.
The remaining open items are cost authority, population-family specification and
pre-implementation power—not conceptual fairness defects.

