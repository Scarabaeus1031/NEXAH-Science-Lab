# V3R6 Callable Trust Model

## Finite boundary

The only added material-callable boundary is the already demonstrated historical path:

```text
snapshot science module
→ bound NumPy 1.26.4 module
→ numpy.quantile dispatcher
→ dispatcher._implementation / dispatcher.__wrapped__
→ historical quantile Python code
```

The sealed graph fingerprint is `a97ce3d2229383a6afc8c2ce6bfe09b7d04f8ff2988b6a315dc9f00193634103`. The implementation code fingerprint is `6c2b0dfac88abacdfcc3881b9f125478d9ccd519894f3773814d61ffd07f5b51`.

Production verification binds:

- dispatcher and implementation object identities;
- `_implementation is __wrapped__`;
- implementation code-object identity and marshalled code digest;
- defaults, keyword defaults, closure, annotations and function attributes;
- science-module NumPy and quantile aliases;
- the fixed historical graph digest.

Checks run after V3R5 runtime verification, immediately before scientific consumption, after any test-only boundary hook, and before a scientific result is returned.

## Deliberate non-expansion

This is not a universal Python tamper-proofing claim. Unrelated callables are outside scope unless a reproducible attack shows that they traverse this frozen material quantile path. Such hypothetical surfaces are non-blocking hardening notes, not V3R6 defects.
