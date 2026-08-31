# 11 — Attestation Control

The object model records what is being described: mark, form, unit and value, with domain extensions and mapping context. The evidence model records how a claim about those items is supported.

```text
OBJECT_MODEL != EVIDENCE_MODEL
ATTESTATION_STATUS=EVIDENCE_LAYER
```

Treating attestation as an object-layer property would confuse a representation with the state of evidence about it. The evidence record may include source, authority, observation status, date, corpus and confidence without becoming another representational layer.

`RECONSTRUCTABLE != ATTESTED` remains preserved.
