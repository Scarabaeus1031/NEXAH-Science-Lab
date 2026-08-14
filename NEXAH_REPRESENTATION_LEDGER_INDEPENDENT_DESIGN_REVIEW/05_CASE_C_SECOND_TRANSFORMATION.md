# Case C — T01 Recovery Classification

## Evidence-derived reconstruction

`recovery_record` does not consume a pre-existing “recovery comparison record.” It consumes raw arguments: run/family/fixture identifiers, source, transformed and optional recovered states, optional loss status/bound/witness/forward state. It computes source certificates, optional forward/recovery comparisons, state error, reads the frozen tolerance, assigns a primary status, and constructs the output record.

For E3, rotation and inverse rotation are created outside `recovery_record`; the function then classifies the resulting pair. The scientifically honest model is either:

1. a composite pipeline `rotate → inverse rotate → metric/certificates → classification record`; or
2. a narrow classifier edge whose source contract explicitly contains raw states and protocol/config references.

The previous entry described the source as an already formed simulation-output record containing certificates and tolerance. That object does not exist at the function boundary: certificates are computed internally and tolerance is loaded from protocol.

## Review classifications

- Operator: `EDGE_TOO_COARSE` in the previous entry.
- Preservation claims about copied output fields are convention-dependent record-construction facts, not scientific preservation.
- Numerical uncertainty is objectively bounded for the frozen E3 result (`2.220446049250313e-16 < 1e-12`).
- Provenance: `COMPLETE_FOR_CLAIM`; runner hash, frozen protocol hash, result hash, and byte-identical replay exist.
- Status: execution/replay verified; interpretation limited to synthetic software classification.
- Existing-record agreement: `EVIDENCE_CONFLICT` on source identity and operator boundary, despite agreement on result, hashes, and bounded claim.

