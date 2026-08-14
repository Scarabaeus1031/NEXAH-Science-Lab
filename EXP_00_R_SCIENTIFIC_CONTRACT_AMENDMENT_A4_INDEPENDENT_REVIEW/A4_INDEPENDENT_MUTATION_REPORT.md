# A4 Independent Mutation Report

The review created its own standard-library suite in `review_tests/test_independent_a4_review.py`. Nine tests pass; “pass” here includes successfully demonstrating two validator escapes.

## Detected by A4 validator

Because A4 seals the canonical JSON digest, machine mutations to N3 direction, RNG fields, N1 mapping, N4 distance, repetition/null threshold, N5, P4, P5, validity list, classification, and Lorenz ceiling are rejected. Independent spot mutations confirmed this.

## Escapes

1. **A4 prose mutation escapes.** In a temporary copy, appending `P5 is optional` to `A4_P1_P5_CONTRACT.md` still lets `validate_package` pass. The validator checks existence, not a prose digest or operative anchors.
2. **Frozen V1 source mutation escapes.** In a temporary authority tree, replacing `EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/src/exp00r/actions.py` still lets `validate_package` pass. The stored composite string is never recomputed; only the separately listed config is hashed.
3. **Semantic omission hidden by digest.** The machine digest guarantees byte identity with A4, not completeness. It cannot detect missing executable predicates for parity/distinctness/sensitivity completeness or the P4 scope choice.

The requested material machine mutations are rejected, but the integrity/prose mutations are scientifically material and escape. **Independent adversarial mutation validation: FAIL.**
