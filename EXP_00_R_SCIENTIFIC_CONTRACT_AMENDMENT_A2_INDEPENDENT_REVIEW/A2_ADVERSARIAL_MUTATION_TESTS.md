# A2 Adversarial Mutation Tests

## Result

**ADVERSARIAL MUTATION REVIEW: PASS.** Every required material mutation was detected by the combined independent review. The supplied A2 validator itself is incomplete: it rejected 7/17 and accepted 10/17.

All mutations were in-memory contract fixtures. No A2 file or scientific artifact was changed.

| Mutation | Supplied validator | Independent review |
|---|---|---|
| `2D3<=G` → `2D3<G` | REJECTED | DETECTED |
| exact rational → float arithmetic | REJECTED | DETECTED |
| frozen → null-specific support | REJECTED | DETECTED |
| null test population changed | REJECTED | DETECTED |
| N3 carrier outcome → donor outcome | **ACCEPTED** | DETECTED |
| N1 support → null-predicted support | **ACCEPTED** | DETECTED |
| remove N3 different-seed restriction | **ACCEPTED** | DETECTED |
| reverse N3 phase merge | **ACCEPTED** | DETECTED |
| reverse N4 higher/lower merge order | **ACCEPTED** | DETECTED |
| N4 minimum size 10 → 9 | **ACCEPTED** | DETECTED |
| swap N4_T/N4_F carrier mapping | **ACCEPTED** | DETECTED |
| allow retry of invalid repetition | **ACCEPTED** | DETECTED |
| Monte Carlo `k<=4` → `k<=5` | REJECTED | DETECTED |
| N5 support 0.99 → 0.95 | REJECTED | DETECTED |
| N5 transform count 12 → 11 | REJECTED | DETECTED |
| move N5-RUN after outcomes | **ACCEPTED** | DETECTED |
| P2 coefficient null becomes a gate | **ACCEPTED** | DETECTED |

## Supplied test run

- Static canonical validation: PASS.
- Supplied unit tests: 16/16 PASS.
- Meaning: the canonical document satisfies the validator's limited assertions; it does not show completeness or isomorphism.

## Classification

The ten missed mutations are validator omissions because the canonical machine artifact contains fields for most of those rules but the validator does not assert their exact values. Separately, the RNG, bin-boundary, permutation-direction, and N5 selection issues are contract omissions; no validator can recover a rule that A2 never states.
