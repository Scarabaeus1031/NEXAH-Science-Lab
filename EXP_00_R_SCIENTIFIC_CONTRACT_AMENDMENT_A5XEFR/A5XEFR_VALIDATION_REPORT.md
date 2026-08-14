# A5XEFR validation report

## Scope

Synthetic evidence only. No registered data, registered seed, execution authorization, V3 implementation or registered experiment was used.

## Results

| Validation | Result |
| --- | --- |
| First-artifact / Class-B scope | PASS |
| Valid fixture identity | PASS |
| Valid registered-interface conformance identity | PASS |
| Contradictory mode predicates | rejected by both validators |
| Missing registered authority | rejected by both validators |
| Fixture claiming registered provenance | rejected by both validators |
| Post-hash identity mutation | rejected by both validators |
| Authorization injection | rejected by both validators |
| Synthetic conformance claiming registered science | rejected by both validators |
| Future registered-scientific structure | structurally accepted; derivation fails closed with `EXTERNAL_AUTHORIZATION_REQUIRED` |
| Old A5XEF combined counterexample | rejected by both paths |
| Complete fixture/registered scientific derivation equality | PASS |
| Both implementers, both modes | PASS |
| Transitive authority | PASS |

Fast adversarial suite: **10/10 PASS**, 39.590 seconds.

Full four-derivation suite: **10/10 PASS**, 428.786 seconds. Equality covers the complete nested scientific output, not only classification. Population hashes, model-spec hash, null hash and classification were also asserted separately.

The nested fixture result is synthetic conformance evidence only. A5XEFR emits no top-level scientific result or classification from either mode.
