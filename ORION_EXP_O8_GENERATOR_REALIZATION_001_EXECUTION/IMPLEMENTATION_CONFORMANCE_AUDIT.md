# Post-execution implementation-conformance audit

## Finding

The frozen implementation uses two incompatible list-ordering rules:

1. fresh materialization orders grid blocks by numeric index tuples;
2. transport orders the same block records by lexicographic canonical-JSON
   bytes.

For indices containing two digits, these orders differ. This produced all 162
single-generator F4 failures and all 378 F9 failures. Record-multiset checks
confirmed `0` substantive content mismatches.

## Classification

This is an implementation-level canonicalization defect relative to the
frozen requirement for one canonical serialized order. It prevents the F4/F9
bytes from answering the algebraic realization question. The implementation
was not changed after freeze, and both runs preserved the defect exactly.

## Adjudication

```text
OPERATIONAL_O8_REALIZED: NO
ALGEBRAIC_OBSTRUCTION FOUND: NO
OVERALL EXPERIMENT STATUS: INVALID_EXPERIMENT
```

The internally generated `scientific_result.json` reports
`VALID_NEGATIVE_RESULT` from its mechanical gate logic. The final adjudication
is stricter because the subsequent conformance audit identifies the failed
bytes as a violation of the canonicalization implementation, not evidence
against the generator algebra.

