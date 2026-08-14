# V3R6 Callable Integrity Report

## Original defect

The unchanged V3R5 reproducer observed:

```text
quantile before: 2.0
in-place _implementation.__code__ substitution
V3R5 assert_consumed: True
quantile after: 999.0
```

Status: **V3R5 COUNTEREXAMPLE REPRODUCED**.

## V3R6 outcome

V3R6 captures a verified callable graph only after V3R5 has established historical runtime authority. The same code-object attack changes either code identity or graph fingerprint and raises `MATERIAL_CALLABLE_INTEGRITY` before the hostile code is invoked. Dispatcher, wrapped-function, module-alias and post-verification variants also fail closed.

Two checks are logically separate:

1. production `callable_integrity.py` builds and revalidates a canonical graph record;
2. `independent_callable_oracle.py` directly checks historical type/relationship, marshalled code SHA-256, defaults, keyword defaults, closure and attributes without calling the production verifier.

Status: **VERIFIED CALLABLE == CONSUMED CALLABLE: PASS**.
