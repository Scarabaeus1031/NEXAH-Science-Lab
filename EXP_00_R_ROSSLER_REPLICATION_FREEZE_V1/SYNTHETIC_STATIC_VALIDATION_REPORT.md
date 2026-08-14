# Synthetic / Static Validation Report

**Registered Rössler experiment not executed.** No seed from 5000–5029 or 6000–6029 was used.

## Final validation

- 24 deterministic `unittest` cases passed.
- Default runner performed static validation only and printed the non-execution declaration.
- `--mode registered` without authorization raised `PermissionError` before data generation.
- Frozen config parsed and its mutation/hash guard passed.
- Synthetic linear RK4, synthetic zero-field ranking, artificial rollout parity, tie handling, support abstention, null reproducibility, seed-block separation, and deliberate unfair-action rejection passed.

## Preserved pre-freeze findings

1. The first test run had one failed assertion because the test expected (-a) before (-a/2); the frozen tie contract correctly specifies (0,-a/2,+a/2,-a,+a). The test was corrected and the full suite rerun.
2. Static dependency review found that the neutral rollout class initially lived in a plant-generating module. Although no analytic field call occurred, this was too weak for a no-access certificate. The neutral contract was separated into `rollout_contract.py`; the complete suite then passed again.

These were implementation-review findings, not registered scientific outcomes.

## Readiness limitation

Component tests pass, but a complete synthetic end-to-end execution of the entire frozen null/sensitivity/bootstrap/classification workflow is not yet implemented. This is the reason for the final NO-GO; it is not a scientific result.
