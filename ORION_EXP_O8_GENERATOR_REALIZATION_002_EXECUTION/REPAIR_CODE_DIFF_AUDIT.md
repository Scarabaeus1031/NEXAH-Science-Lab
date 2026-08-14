# Repair code-diff audit

- Historical scientific source SHA-256:
  `80896d1ad901045ed771dd2e88f8a87e7f8c2bc26c43d797022eae67a48d8610`
- Repair implementation SHA-256:
  `e5a5343b6e9a4576f3cf6c49d7e1976eca5891af91c012edfd5da862e080e83b`

The repair wrapper delegated all historical scientific functions to the
hash-verified source. It redefined none of the domain, generator,
materialization, transport, F1--F9, product, center or negative-control
functions. New code was classified as:

- `CANONICALIZATION_REPAIR`: typed normalizer, canonical bytes, worker routing;
- `TEST/LOGGING`: provenance, C01--C10, forensic and three-way diagnostics;
- minimal plumbing: fail-closed orchestration and result fields.

```text
FORBIDDEN_SCIENTIFIC_CHANGE = 0
```

