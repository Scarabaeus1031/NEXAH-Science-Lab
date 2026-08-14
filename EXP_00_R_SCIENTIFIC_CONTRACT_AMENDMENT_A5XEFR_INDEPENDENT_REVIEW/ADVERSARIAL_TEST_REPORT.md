# Adversarial test report

The independent runner `independent_f47_review.py` used generated synthetic evidence only and did not rely on A5XEFR's fixture builder or shared canonicalizer as proof.

Result:

```json
{"assertions":57,"classification_inside_synthetic_conformance":"PARTIALLY REPLICATED","complete_scientific_sha256":"5eaaa0b9d779515926fd99c89f1096474dac333980d8313d4c745f72ad92cb01","registered_data_accessed":false,"status":"PASS","top_level_classification":null}
```

Attacks included:

- every operative identity predicate;
- missing authority and contradictory evidence authority;
- authorization injection;
- synthetic evidence claiming registered-result status;
- unknown mode and malformed envelope;
- identity mutation without rehashing;
- scientific evidence mutation after hashing;
- coordinated mutation with recomputed hashes;
- future registered scientific evidence without authorization;
- complete four-path mode/implementer equality.

No attack produced authorization, top-level scientific-result status, classification or release. No mode leakage was observed in populations, model, actions, RNG-derived nulls, bootstrap, N5, P4, sensitivities, P1–P5, validity or classification.

Adversarial tests: **PASS**.
