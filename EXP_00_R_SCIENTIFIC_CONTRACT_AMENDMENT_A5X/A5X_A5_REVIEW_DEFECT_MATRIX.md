# A5X — A5 Review Defect Matrix

**First A5X artifact.** V1 was independently recomputed first: 24 files, `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05`. No registered artifact was accessed.

| Finding | Why Class B | Fixed scientific rule | Encoding repair | Machine/evaluator | Deterministic test | Attack | Stop condition |
|---|---|---|---|---|---|---|---|
| A5-R26 | A5 already states each gate's intended science; derivation was opaque | accepted A5 validity semantics | typed raw schemas plus deterministic functions returning Boolean; missing/type mismatch is false | `validity_gates.*`; `evaluate_gate` | valid fixture and one-leaf failure for every gate | replace parity/leakage/isolation leaf | stop if a missing raw meaning requires a scientific choice |
| A5-R27 | all 12 values/roles already frozen; identity/hash mapping was absent | accepted registry and P5 role | one canonical registry; full JSON primary config; exact one-path patch; RFC-style canonical JSON (`sort_keys`, compact UTF-8); unchanged-config digest after deleting changed leaf | `sensitivities`; `evaluate_sensitivities` | exact 12, duplicates/missing/wrong path/value/unchanged leaf | registry/config/digest mutations | stop if a new variant/value is required |
| A5-R28 | hashes are engineering authority, not science | V1/A5 bytes are fixed | root authority hashes V1 composite, all operative A5 science, all A5X artifacts, validator and tests; validator hard-binds root digest with normalized-self hashing; trust boundary stated | `A5X_AUTHORITY_ROOT.json`; `verify_authority` | recompute every byte/hash/count/role | coordinated prose/machine/validator/root changes | stop if upstream science must change |
| A5-R29 | accepted semantics exist in A3–A5; coverage was incomplete | N1–N5, RNG, P4/P5, classifier and ceiling unchanged | exact semantic fingerprints and raw gate/sensitivity execution; no presence-only acceptance | `semantic_fingerprints`; `validate_machine` | every fixed field asserted | N2/N3/RNG/P5/classifier/P4/ceiling mutations | stop if a fingerprint cannot be sourced without interpretation |

**Boundary:** A5X changes encoding and integrity only. P4, all other P propositions, N1–N5, populations, seeds, thresholds, sensitivities, classification and ceiling remain scientifically identical.
