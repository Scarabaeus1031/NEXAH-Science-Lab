# Final Representation Ledger Independent Review

## Decision

`REPRESENTATION_LEDGER_REQUIRES_SCHEMA_REVISION`

## Required answers

1. **Could samples be reconstructed independently?** Yes, at a conceptual level; no serialized schema-conforming sample records existed for direct validation.
2. **Material disagreements?** Case A's composite boundary/preservation framing; Case B's compute-versus-plot boundary and false maxima input; Case C's source record does not exist at the callable boundary; Case D is an aggregate claim attached to an under-specified composite edge.
3. **Highest disagreement fields?** Operator boundary, assumptions, preservation object, loss object, and status.
4. **Preservation objective enough?** Partially. Narrow criteria are objective, but the schema does not require equivalence/test/metric definitions.
5. **Loss objective enough?** Partially. Structural omissions are clear; global, observed, potential, and task loss can still be conflated.
6. **Provenance sufficient?** Sufficient for bounded operator claims and complete for T01/aggregate failure; insufficient for replaying historical legacy instances.
7. **Is `VERIFIED` too coarse?** Yes. It conflates implementation, execution/replay, provenance, mathematics, and interpretation.
8. **Can execution coexist with rejected interpretation?** It can be written, but is not safely modeled: the negative result can later be erased.
9. **Syntax versus science?** The prose distinguishes them; the schema's status semantics still create validation-theater risk.
10. **Malformed records caught?** Partially. Missing fields/task owner/symbolic label are caught; semantic relabeling, contradictions, dangling evidence, erased negatives, and fabricated precision are not.
11. **Legitimate incomplete records survive?** Partially. Undefined task and empty uncertainty work; analytical/historical provenance can be wrongly rejected.
12. **Value beyond competent documentation?** Partial: a standardized, queryable, falsification-aware combined view. It reduces to a constrained provenance/knowledge graph, not new science.
13. **Works without NEXAH terminology?** Partially. Core concepts do; samples and locators are not self-contained.
14. **Blocking defects?** Seven.
15. **Authorize validator now?** No.

## Four failure modes

- F1 schema ambiguity: demonstrated by incompatible but defensible operator/claim boundaries.
- F2 narrative leakage: demonstrated where preserved objects and Case-D claim grouping require prior audit narrative.
- F3 validation theater: demonstrated by schema-valid semantic contradictions and the overloaded `VERIFIED` state.
- F4 documentation equivalence: not complete; cross-record constraints could add value after revision, but current value is only partial.

Suppose the records were handed to a competent researcher who had never heard of NEXAH. That researcher could recover much of what was done from the original evidence, but not from the present ledger records alone: the samples are prose, edge boundaries vary, preservation/loss criteria are not normative, and status/negative history is unsafe. The remaining defects are not small enough to authorize a validator.

```text
INDEPENDENT_RECONSTRUCTION_COMPLETED = YES
CASE_A_AGREEMENT = INTERPRETIVE
CASE_B_AGREEMENT = INTERPRETIVE
CASE_C_AGREEMENT = CONFLICT
CASE_D_AGREEMENT = INTERPRETIVE

OPERATOR_BOUNDARIES_RELIABLE = PARTIAL
REPRESENTATION_TYPES_SUFFICIENT = PARTIAL
PRESERVATION_CLAIMS_REVIEWABLE = PARTIAL
LOSS_CLAIMS_REVIEWABLE = PARTIAL
UNCERTAINTY_STATES_ADEQUATE = PARTIAL
PROVENANCE_REQUIREMENTS_OPERATIONAL = PARTIAL
EVIDENCE_TYPE_AND_STATUS_DISTINGUISHED = YES
NEGATIVE_RESULTS_SAFELY_REPRESENTED = NO
HUMAN_JUDGMENT_EXPLICIT = NO

SYNTACTIC_VS_SCIENTIFIC_VALIDATION_SEPARATED = YES
ADVERSARIAL_BAD_RECORDS_CAUGHT = PARTIAL
LEGITIMATE_INCOMPLETE_RECORDS_ALLOWED = PARTIAL
CHAIN_PROVENANCE_TRACEABLE = PARTIAL

VALUE_BEYOND_STANDARD_DOCUMENTATION = PARTIAL
KNOWLEDGE_GRAPH_REDUCTION = YES
NEXAH_REMOVAL_TEST = PARTIAL

SCHEMA_AMBIGUITY_FAILURE = YES
NARRATIVE_LEAKAGE_FAILURE = YES
VALIDATION_THEATER_FAILURE = YES
DOCUMENTATION_EQUIVALENCE_FAILURE = NO

BLOCKING_SCHEMA_DEFECTS = 7
MINIMAL_VALIDATOR_AUTHORIZED = NO

NEW_EXPERIMENT_AUTHORIZED = NO
T02_CHANGED = NO
ORION_CHANGED = NO
CANONICAL_NEXAH_CHANGED = NO

FINAL_DECISION = REPRESENTATION_LEDGER_REQUIRES_SCHEMA_REVISION
NEXT_ACTION = REVISE_ONLY_THE_SEVEN_BLOCKING_SCHEMA_AREAS_AND_PUBLISH_FOUR_SCHEMA_CONFORMING_SOURCE_TRACEABLE_SAMPLE_INSTANCES_FOR_A_NEW_INDEPENDENT_REVIEW
```
