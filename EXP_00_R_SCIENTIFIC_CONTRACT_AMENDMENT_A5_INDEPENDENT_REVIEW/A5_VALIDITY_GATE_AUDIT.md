# A5 Validity-Gate Audit

## Core failure

A5 prose supplies useful descriptions, but the machine contract does not encode an executable Boolean language over raw artifacts. Each gate contains `inputs`, `required_fields`, and an `all` array of strings such as `PARITY_ASSERTED`, `NO_CROSS_IMPORT_CALL`, or `ALL_BINDINGS_CONSISTENT`. The validator requires those arrays merely to be nonempty; it does not evaluate them.

Independent mutations replacing the entire derivation with `ALLOW_ANALYTIC_FIELD`, `ALLOW_TEST_IN_FIT`, or `PARITY_ASSERTED` remained semantically accepted. `EXPECTED_ARTIFACT_LEDGER`, exact artifact types/IDs, expected source-manifest hash, stage-event vocabulary, and several population hashes are not themselves frozen schemas.

| Gate | Exact sources/fields | Exact executable predicate | Finding |
|---|---|---|---|
| INFORMATION_PARITY | partly present | no raw-field evaluator | FAIL |
| REPRESENTATION_DISTINCTNESS | prose detailed; validator phrase-checks two atoms | incomplete evaluator | FAIL |
| NO_ANALYTIC_FIELD_LEAKAGE | sources named | replacement atom accepted | FAIL |
| TRAIN_TEST_ISOLATION | seeds/stages described | stage/event derivation not encoded | FAIL |
| SUPPORT_VALIDITY | thresholds described | no artifact evaluator | FAIL |
| N5_RUN | fields described/bound | no run-record evaluator | FAIL |
| NULL_FAMILY_COMPLETENESS | counts/fields described | no 1,000-record evaluator | FAIL |
| BOOTSTRAP_VALIDITY | rules described | no record evaluator | FAIL |
| PER_SEED_ATTRIBUTION_COMPLETENESS | rules described | no exact artifact evaluator | FAIL |
| ALL_12_SENSITIVITIES_COMPLETE | delegated to nonexecuted strings | FAIL |
| CONFIG_BINDING_COMPLETE | required fields named | expected source-manifest value/schema undefined | FAIL |
| PROVENANCE_COMPLETE | generic expected ledger named | exact ledger not supplied | FAIL |
| SOURCE_CONFIG_INTEGRITY | V1/external/A5 checks partly executed | A5 manifest anchor fails | FAIL |

Every false gate is intended to yield invalidity, but two conforming implementations can derive different gate truth values before that consequence. **A4-R22 and VALIDITY GATES COMPLETE: FAIL (Class B).**

