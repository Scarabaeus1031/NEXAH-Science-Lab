# Trace-to-Motion 0.1 — Protocol Draft

Status: `REVISION 2 — HUMAN ACQUISITION PROHIBITED`

Protocol ID: `TTM-0.1-DRAFT-02`

Mode: protocol revision and synthetic self-conformance only

Operational effect: `NONE`

## Purpose

Separate pipeline conformance, direction identifiability and mask-schedule
comparison. This prevents deterministic implementation properties from being
reported as scientific evidence and schedule differences from being attributed
to motion alone.

## Authority boundary

No Human acquisition, execution, result, numbered Lab, operator, OLS change,
publication, commit, push or deployment is authorized. LANIF, ZERO,
Fugenformel, handwriting meaning, golf, body motion and energy remain excluded.

## Documents

1. [Revision 2 Protocol](01_ACQUISITION_AND_ANALYSIS_PROTOCOL.md)
2. [Data and Provenance](02_DATA_AND_PROVENANCE_CONTRACT.md)
3. [Synthetic Validation](03_SYNTHETIC_DRY_RUN_VALIDATION.md)
4. [Independent Review](04_INDEPENDENT_REVIEW_CHECKLIST.md)
5. [Owner Decision Queue](05_OWNER_APPROVAL_GATE.md)
6. [Track A](06_TRACK_A_PIPELINE_CONFORMANCE.md)
7. [Track B](07_TRACK_B_DIRECTION_IDENTIFIABILITY.md)
8. [Track C](08_TRACK_C_MASK_SCHEDULE_COMPARISON.md)
9. [Finding Disposition](09_REVIEW_FINDING_DISPOSITION.md)
10. [Analysis and Evaluability](10_ANALYSIS_AND_EVALUABILITY_SPECIFICATION.md)
11. [Calibration and Device Qualification](11_CALIBRATION_AND_DEVICE_QUALIFICATION.md)
12. [Acquisition Blockers](12_ACQUISITION_BLOCKER_CHECKLIST.md)
13. [Changelog](13_REVISION_2_CHANGELOG.md)
14. [Experimentlog](14_EXPERIMENT_LOG.md)
15. [Closed-Trace Canonicalization Robustness Review](15_CLOSED_TRACE_CANONICALIZATION_ROBUSTNESS_REVIEW.md)
16. [Closed-Trace Representation Requirement Gate](16_CLOSED_TRACE_REPRESENTATION_REQUIREMENT_GATE.md)
17. [Closed-Trace Consumer Contract Freeze](17_CLOSED_TRACE_CONSUMER_CONTRACT_FREEZE.md)
18. [Byte-Stable Trace Serialization Boundary](18_BYTE_STABLE_TRACE_SERIALIZATION_BOUNDARY.md)
19. [Closure Status Semantic Vocabulary Gate](19_CLOSURE_STATUS_SEMANTIC_VOCABULARY_GATE.md)
20. [Track B Plateau View](TRACK_B_PLATEAU_REPORT_DE.md)
21. [Desk Return Report](DESK_REPORT_RETURN_DE.md)
22. [Lab Return Report](LAB_REPORT_RETURN_DE.md)
23. [Architecture Status](TRACE_TO_MOTION_ARCHITECTURE_STATUS_DE.md)
24. [Documentation Phase Closeout](PHASE_CLOSEOUT_DE.md)

Derived validator artifacts share one implementation lineage and are not
independent validation or scientific evidence.

## Revision 2 protocol disposition

The following block records the broader Revision 2 protocol state. Later
bounded synthetic engineering checkpoints do not erase its unresolved
canonicalization, independent-validation or Human-acquisition blockers.

```text
REVISION_2: PREPARED
PIPELINE_SELF_CONFORMANCE: FAIL — CLOSED-TRACE NOISE INSTABILITY
INDEPENDENT_VALIDATION: PENDING
DIRECTION_IDENTIFIABILITY: BLOCKED
MASK_SCHEDULE_COMPARISON: BLOCKED
OWNER_APPROVAL: PENDING
HUMAN_ACQUISITION: PROHIBITED
```

The current report passes 33 of 34 checks. V1's lexicographic closed-trace
canonicalization fails the shared-noise exact-reversal fixture with maximum
deviation `0.043607016 mm`. No tolerance was relaxed to conceal the failure.

Next gate: `OWNER REVIEW OF REVISION 2 AND OPEN SCIENTIFIC DECISIONS`.

## Documentation closeout status

Later bounded work reached a minimal Track A serialization/replay milestone and
a Track B engineering plateau through EXP-B01 and EXP-B02. This does not execute
the blocked scientific direction-identifiability test.

```text
ARCHITECTURAL_ORIENTATION: YES
TRACK_A_MINIMAL_TECHNICAL_MILESTONE: REACHED
TRACK_B_ENGINEERING_PLATEAU: REACHED
TRACK_B_SCIENTIFIC_IDENTIFIABILITY: BLOCKED
TRACK_C_IMPLEMENTED: NO
FULL_PROTOCOL_VALIDATION: NO
SCIENTIFIC_RESULT: NONE
HUMAN_DATA: NONE
HUMAN_ACQUISITION: PROHIBITED
NEXT_STATE: OWNER PRIORITY DECISION
```

Current return entry point: [Documentation Phase Closeout](PHASE_CLOSEOUT_DE.md),
followed by the [Desk Return Report](DESK_REPORT_RETURN_DE.md).
