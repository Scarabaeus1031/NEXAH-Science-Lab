# EXP-00-R Registered Payload Producer R1

Status: **IMPLEMENTED — READY FOR ONE INDEPENDENT PRODUCER CONFORMANCE CHECK**

This additive successor resumes the historical stopped producer after Generator R2 independently closed its sole N3/N4 interface contradiction.

`src/payload_producer.py` is the missing wire: it accepts already-computed frozen V1 scientific outputs, constructs Generator R2-bound rows and evidence witnesses, validates the complete payload with Generator R2, and returns deterministic canonical payload bytes plus their SHA-256.

It does not import or invoke V1 seed generation or the Rössler registered pipeline. It has no registered-input resolver, evidence writer, authorization consumer, P1–P5 evaluator, or classifier.

```text
MODE: CLOSURE_MODE_MINIMAL_PRODUCER
NEW SCIENTIFIC CHOICE: NO
NEW GOVERNANCE LAYER: NO
REGISTERED PRODUCTION: NOT AUTHORIZED / NOT PERFORMED
```

The historical failed producer package remains unchanged.

Next permitted object: `ONE INDEPENDENT PAYLOAD PRODUCER CONFORMANCE CHECK`.
