# Adversarial test report

## Executed checks

- Independently recomputed all ten upstream authority-package tree composites: all matched.
- Ran the bundled focused A–AH and central-counterexample suites: **36/36 passed** in 39.545 seconds.
- Confirmed the former combined A5XE favorable counterexample is rejected before scientific classification by both derivations.
- Confirmed alternate non-`SYNTH_*` fixture namespace `ALT_FIXTURE_*` is accepted as a synthetic fixture.
- Constructed a non-`SYNTH_*` future-registered candidate by changing only evidence identity/provenance fields to `manifest.registered=true`, `authority_binding.registered_data=true`, and `authority_binding.fixture=false`, with refreshed provenance.

## Registered-readiness result

The future-registered candidate was rejected by both complete derivation entry points before scientific work:

```text
reference   -> INVALID_EXPERIMENT / reason: authority
independent -> INVALID_EXPERIMENT / reason: identity
```

This is not merely a fixture-name issue:

1. `A5XEF_GENERIC_RAW_SCHEMA.json` requires `manifest.registered` to be exactly `false`.
2. `derive_a5xef_reference.py` requires the complete authority object to equal `{registered_data:false, fixture:true}` and separately requires `manifest.registered is false`.
3. `derive_a5xef_independent.py` imposes the same two constraints.
4. `A5XEF_MACHINE_READABLE_CONTRACT.yaml` records `synthetic_only_testing:true`.

Thus namespace neutrality is demonstrated only among synthetic fixtures. Registered-mode neutrality is not demonstrated and is presently impossible under the sealed interface.

## Other adversarial domains

| Domain | Result |
| --- | --- |
| Producer summaries | PASS: recursively rejected and non-authoritative |
| Population derivation/leakage | PASS |
| Model specification consumption | PASS; former max-iteration mismatch rejected |
| Five null families / 200 repetitions | PASS |
| Seed-clustered bootstrap / 500 repetitions | PASS |
| N5-SYNTH versus N5-RUN typing | PASS |
| P4 controls, boundaries and diagnostics | PASS |
| Twelve operative sensitivities | PASS |
| P1–P5 and classification precedence | PASS by code inspection and focused regressions |
| Typed negative versus malformed states | PASS |
| Complete dual-output equality on fixtures | PASS in A5XEF evidence; implementations share constants/schema but not derivation helpers |
| Central A5XE counterexample | PASS: rejected by both paths |
| Finite authority boundary | PASS with stated external-anchor limitation |
| Future registered instantiation | **FAIL** |

No registered evidence was created, read or executed during this test.
