# ORION Compatibility and Gap Ledger

SWM-01 remains a NEXAH-side conceptual machine. ORION owns scientific meaning; the interface owns transport; NEXAH owns consumption.

| Area | Compatibility | Verified gap |
|---|---|---|
| IDs, revisions, provenance | aligned in principle with envelope identity/hash/lineage | SWM schema and canonical serialization not frozen |
| view with declared loss | aligned with `NexahOrionEvidenceView` and `projection_losses` | SWM `View` is not the authoritative ORION object |
| ambiguity and abstention | compatible with preserved status/candidate semantics | must not collapse ORION candidate sets or `UNDEFINED` |
| result/evidence transport | compatible with read-only evidence/report consumer | only `INFORMATION_LOSS_BOUNDARY` is V1-supported |
| operation/event/history | useful internally for NEXAH execution lineage | not a license to infer ORION history, action or control |
| machine-readable contract | semantic membrane approved | documentation-only; C1–C18 not executed |
| implementation authority | none | three owners, package location and separate design authorization remain prerequisites |

No current ORION type has an exact canonical NEXAH analogue. The canonical ORION envelope/object must remain attached or exactly referenced, and projection losses must be exhaustive. Adapter rejection is not an epistemic result.

`ORION_COMPATIBILITY=CONCEPTUAL_READ_ONLY_BOUNDARY_ONLY`

`NEXAH_TO_ORION_MACHINE_READABLE_CONTRACT_READY=BLOCKED_BY_MISSING_SCHEMA`

`ORION_CAPABILITY_DELTA=NONE`

