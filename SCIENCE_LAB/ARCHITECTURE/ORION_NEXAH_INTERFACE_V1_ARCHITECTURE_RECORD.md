# ORION–NEXAH Interface V1 architecture record

| Field | Decision |
|---|---|
| RECORD_ID | `ORION_NEXAH_INTERFACE_V1_ARCHITECTURE_RECORD` |
| DECISION_DATE | `2026-08-11` |
| DECISION_CLASS | `NON_SCIENTIFIC_ARCHITECTURE_GOVERNANCE` |
| GOVERNING_PRINCIPLE | ORION owns meaning; interface owns transport; NEXAH owns consumption. |
| OWNER_MODEL | `ORION_SEMANTIC_OWNER`; `INTERFACE_CONTRACT_MAINTAINER`; `NEXAH_CONSUMER_OWNER` |
| APPROVED_SCOPE | Versioned read-only transport into NEXAH validation/reporting; evidence, provenance, ambiguity, boundary and loss/undefined display |
| EXCLUDED_SCOPE | State mutation, episode insertion, applications, navigation, reachability inference, action/control, learning, scientific reinterpretation, cross-domain bridge manufacture |
| TYPE_PLACEMENT | Documentation-only now; dedicated shared interface package if separately authorized |
| STATUS_SEMANTICS | Orthogonal selection/boundary fields; `NOT_APPLICABLE` iff `UNDEFINED`; information loss may coexist with a defined candidate/preimage set |
| PROVENANCE | Typed shared interface lineage is authoritative; NEXAH metadata is a projection only |
| PROJECTION_POLICY | Canonical ORION object remains attached; every omission listed; no cardinality reduction; no fabricated Brief context or navigation fields |
| FAILURE_POLICY | Unknown/invalid/unrepresentable transport conditions produce `ADAPTER_REJECTION`, never an ORION epistemic status |
| CLAIM_FIREWALL | No path/action from transformation ID; no actual history from equivalence class; no trajectory estimate from constraints; no recovery from loss; no false/zero from undefined; no navigation/control/domain truth from O8 |
| FIRST_FIXTURE | `INFORMATION_LOSS_BOUNDARY` |
| IMPLEMENTATION_STATUS | `NOT_IMPLEMENTED / NOT_AUTHORIZED` |
| CONFORMANCE_STATUS | `C1–C18 MANDATORY / NOT_EXECUTED` |
| MEMBRANE_STATUS | `MEMBRANE_V1_APPROVED_NOT_IMPLEMENTED` |
| SCIENTIFIC_AUTHORITY | `NONE` |
| CLOSED_LAB_KNOWLEDGE_CHANGED | `NO` |

## Initial object-kind registry

- `V1_SUPPORTED`: `INFORMATION_LOSS_BOUNDARY`.
- `V1_SCHEMA_ONLY`: `REFERENCE_RELATION`, `TRANSFORMATION_ID`,
  `CORRESPONDENCE_MAP`, `INVERSE_AVAILABILITY`, `AMBIGUITY_CAUSE`,
  `UNDEFINED_BOUNDARY`, `PROVENANCE_RECORD`.
- `V1_DEFERRED`: `COMPATIBLE_PRODUCT_SET`,
  `HISTORY_EQUIVALENCE_CLASS`, `HIDDEN_STATE_CONSTRAINTS`,
  `TRACE_CONSTRAINTS`, `STABILIZER_CAUSE`.

## Change control

Patch changes require contract-maintainer approval and proof that frozen
invariants are unchanged. Minor changes require all three role owners. Major
changes require unanimous role-owner approval and independent semantic/software
review. Old schema bytes and fixtures remain immutable; deprecation requires a
published overlap period and never reinterprets prior versions.

## Record boundary

This record is not a Labreport and is not indexed in the scientific Labreport
Index. No separate Architecture Index existed when it was created; creation of
one is proposed for a separate governance action.
