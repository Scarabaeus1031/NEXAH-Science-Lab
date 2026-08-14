# Independent A5 Mutation Report

The independent suite is `review_tests/test_independent_a5_review.py`. “Detected” means the supplied A5 validator rejects the semantic mutation or seal attack. “Missed” means the altered contract remains accepted, generally after updating the unanchored manifest entry.

| Mutation | Result |
|---|---|
| P4 single-representation role | detected |
| P4 predictive gain | detected |
| analytic-leakage predicate replaced | **missed** |
| information-parity derivation replaced | **missed** |
| representation distinctness weakened | detected |
| train/test isolation replaced | **missed** |
| sensitivity 12→11 | detected |
| sensitivity identity/path/value | **missed** |
| sensitivity output gain removed | detected |
| dominance rational→float | detected |
| exact `<=`→`<` | detected |
| N1 forward direction | detected |
| N2 permutation unit | **missed** |
| N3 donor restriction | **missed** |
| N3 bin/clockwise binding removed | **missed** |
| N4 distance | detected |
| N4 ordering/merge binding removed | **missed** |
| RNG algorithm | detected |
| RNG namespace serialization | **missed** |
| canonical row ordering | **missed** |
| repetitions 200→199 | detected |
| repetitions 200→201 | detected |
| Monte Carlo `k<=4` | detected |
| N5 count | detected |
| N5 threshold | detected |
| P5 coefficient `>0`→`>=0` | **missed** |
| classifier replicated branch | **missed** |
| invalid-first branch | detected |
| Lorenz ceiling | detected |
| isolated A5 prose mutation | detected |
| paired A5 prose + manifest rewrite | **missed** |
| isolated A5 machine mutation | detected by member hash |
| paired semantically unvalidated machine + manifest rewrite | **missed** |
| manifest package/count/role | **missed** |
| paired validator + manifest rewrite | **missed** |
| removal of operative artifact | detected |
| unmanifested contradictory prose | detected |
| V1 source mutation | detected |
| external authority replacement | detected by anchored hash |

Boundary fixtures independently pass, but the required standard is rejection of every material mutation. **Independent adversarial mutation validation: FAIL.**

