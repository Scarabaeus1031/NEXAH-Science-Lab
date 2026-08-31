# AHCE-01 — NVC-01 / EVR-01 Compatibility

## NVC-01

The record preserves the closed distinctions:

- `OBJECT/ID` identifies entity/artifact/record.
- `STATE/OBS` separates condition from observation record.
- `ORIENTATION` is not used as a substitute for motion or mechanism.
- `PROVENANCE` remains separate from `TRACE`.
- `GENERATION` is recorded only for attested derivation/replication.
- `EXECUTION` is a particular event, not an operator, artifact, or output.
- `TRACE` records attested execution; it does not prove unrecorded history.

No new NVC type or operator is created. `InteractionRecord` is a documentary composite using existing distinctions.

## EVR-01

EVR-01 remains `CLOSED_PARTIAL_SCHEMA_RESULT`. AHCE-01 supplies a possible reference input for later view design but does not create an Eye contract or revise EVR fields.

```text
NVC01_STATUS=CLOSED_REFERENCE_ARTIFACT_UNCHANGED
EVR01_STATUS=CLOSED_PARTIAL_SCHEMA_RESULT_UNCHANGED
NEW_NVC01_TYPE=NO
NEW_NVC01_OPERATOR=NO
```
