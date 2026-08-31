# Provenance Model

`ProvenanceRecord` requires resolution status, source artifacts, parent provenance, timestamp, logical order and producing method.

| Status | Requirement |
|---|---|
| `VERIFIED` | at least one artifact ID and SHA-256 |
| `UNRESOLVED` | explicit unresolved reasons; no source may be fabricated |
| `REDACTED` | redaction remains distinct from unknown or absent |

Every non-provenance record carries a `provenance_ref`. Parent provenance produces a directed lineage; it does not make child and parent records identical. The canonical ORION envelope, when referenced, remains an external canonical object with its own hash and projection-loss record.

Provenance records and history records are immutable/append-only. Correction creates a new record/revision linked to the old record. Result equality never implies provenance equality.

`UNRESOLVED_PROVENANCE_SUPPORTED=YES_WITHOUT_FABRICATION`

`SAME_RESULT_EQUALS_SAME_PROVENANCE=NO`

