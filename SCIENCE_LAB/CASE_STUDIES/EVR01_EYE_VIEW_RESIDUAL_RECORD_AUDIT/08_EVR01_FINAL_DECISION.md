# EVR-01 Final Decision

Date: `2026-08-29`

## Primary outcome

`B_PARTIAL_COMMON_SCHEMA_DOMAIN_FIELDS_REQUIRED`

A useful common documentary core survives across the five cases, but it is not sufficient by itself. Arithmetic needs bound/orientation fields; corrosion needs material/interface/product fields; the fungal study needs organism/exposure/comparator/assay fields; representation differences need explicit map and retained/lost/introduced/unresolved definitions; the zero control needs a reversibility contract and explicit non-attestation state.

The common core succeeds only because residual kind, applicability, reference, evidence status and claim boundary prevent cross-domain collapse. This supports `COMMON_RECORD_SHAPE` and rejects `COMMON_ONTOLOGY`. Outcome A is not selected because necessary domain extensions materially carry the distinctions. Outcomes C–E are not selected because a useful bounded core remains and the required sources are adequate.

`H_EVR` is only partially supported for the five selected records. An energetic residual was not tested, `STRUCTURAL_TRACE` was not adequately defined as a residual kind, and epistemic uncertainty belongs in `unresolved`/`evidence_status` rather than being treated as a phenomenon. No conclusion is made about one schema covering every energetic, structural or epistemic case.

Secondary finding: `REST_AS_UNIVERSAL_OPERATOR_NOT_SUPPORTED`.

## Required fields

`record_id`, `source_object_or_state`, `source_domain`, `operator_or_execution`, `boundary_or_constraint`, `reference`, `observation`, `residual_present`, `retained`, `lost`, `introduced`, `unresolved`, `reversibility_status`, `trace`, `provenance`, `evidence_status`, `claim_boundary`.

`orientation`, `residual_kind`, `residual_value`, `sign`, `unit` and `domain_fields` are conditional/domain-specific under the rules in `02_CANDIDATE_RESIDUAL_SCHEMA.md`.

## Decision fields

```text
TEST_ID = EVR-01
PRIMARY_OUTCOME = B_PARTIAL_COMMON_SCHEMA_DOMAIN_FIELDS_REQUIRED
SCHEMA_STATUS = USEFUL_BOUNDED_CORE_WITH_MANDATORY_DOMAIN_EXTENSIONS
COMMON_REQUIRED_FIELDS = RECORD_ID,SOURCE_OBJECT_OR_STATE,SOURCE_DOMAIN,OPERATOR_OR_EXECUTION,BOUNDARY_OR_CONSTRAINT,REFERENCE,OBSERVATION,RESIDUAL_PRESENT,RETAINED,LOST,INTRODUCED,UNRESOLVED,REVERSIBILITY_STATUS,TRACE,PROVENANCE,EVIDENCE_STATUS,CLAIM_BOUNDARY
DOMAIN_SPECIFIC_FIELDS = ORIENTATION,RESIDUAL_KIND,RESIDUAL_VALUE,SIGN,UNIT,DOMAIN_FIELDS
RESIDUAL_KIND_STATUS = FOUR_RETAINED_ONE_UNTESTED_ONE_REJECTED_ONE_MOVED_TO_EVIDENCE_ONE_REPLACED_BY_BOOLEAN
ZERO_CONTROL = PASS_RESIDUAL_PRESENT_FALSE_NO_INVENTED_TRACE
UNTYPED_COLLAPSE_CONTROL = INFORMATION_LOSS
ORIENTATION_REVERSAL_CONTROL = PASS_REFERENCE_BOUND_VALUE_AND_SIGN_CHANGE_SOURCE_POSITION_STABLE
UNIT_REMOVAL_CONTROL = DETECTS_AMBIGUOUS_OR_INVALID_DIMENSIONAL_RECORD
OBSERVATION_MECHANISM_CONTROL = PASS_CLAIM_UPGRADE_DETECTED
TRACE_PROVENANCE_CONTROL = PASS_SWAP_DETECTED_AS_INFORMATION_LOSS
NVC01_COMPATIBILITY = PASS_NO_CORE_CHANGE
NEW_VOCABULARY = NO
NEW_SEMANTICS = NO
EYE_VIEW_CONTRACT_RELEVANCE = REFERENCE_INPUT_ONLY
RUST_SERIALIZATION_RELEVANCE = REFERENCE_INPUT_FOR_FUTURE_CONFORMANCE_SPEC
RUST_IMPLEMENTATION = NO
ORION_CAPABILITY_DELTA = NONE
NEW_RESEARCH_ACTIVATION = NO
PUBLICATION_AUTHORIZATION = NO
NEXT_ACTION = STOP_AND_PRESERVE
EVR01_STATUS = CLOSED_PARTIAL_SCHEMA_RESULT
REGISTRATION_ROUTE = SELF_CONTAINED_SCIENCE_LAB_CASE_STUDY_AUDIT_PACKAGE
LAB_REGISTER_ENTRY = NONE
DECISION_QUEUE_ENTRY = NONE
```

No Decision Queue entry or automatic Eye/Rust work item is created.
