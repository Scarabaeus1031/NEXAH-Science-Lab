# Common Research Infrastructure — Cross-Reference

Date: 2026-08-06

Status: `CROSS-REFERENCE ONLY — NO AUTHORITY CHANGE`

Operational effect: `NONE`

Promotion status: `NONE`

Programs remain scientifically and governancially separate.

## 1. Scope

This note records method practices already present in two separate research
lines:

1. `TRACE_TO_MOTION`, including Tracks A, B and C;
2. `FIELD_LAYER / NAVIGATION`, represented here only by the current C2/C3
   profile and C3-to-C2 transition package under `FIELD_NOTES`.

It is a cross-reference, not a shared scientific model. It does not make the
objects, transformations, metrics, results or governance status of one line
applicable to the other.

The C2/C3 package remains governed by
[`FIELD_NOTES_GOVERNANCE.md`](../FIELD_NOTES/FIELD_NOTES_GOVERNANCE.md): Field
Notes are `UNREVIEWED`, have `OPERATIONAL_EFFECT: NONE`, and are not promoted
automatically into Research or Evidence.

## 2. Separate scientific objects

| Research line | Declared objects and operations | Current boundary |
| --- | --- | --- |
| `TRACE_TO_MOTION` | source trajectories, final traces, representation maps, masks, records, reconstruction, direction-free packets and mask-schedule comparison | Track A is technical conformance; Track B scientific identifiability remains blocked; Track C remains the distinct mask-schedule comparison and is not implemented |
| C2/C3 `FIELD_LAYER / NAVIGATION` package | field functions, state points, declared C2/C3 labels, numerical integration, pulse/capture/lock controls, transition outcomes and endpoint records | controlled synthetic-model measurements only; no free-fixed-point, natural-basin, universal-transition or transfer claim |

The first object boundary is declared in
[`12_TRACE_TO_MOTION_0_1.md`](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/12_TRACE_TO_MOTION_0_1.md).
The second is declared in the
[`C3 profile`](../FIELD_NOTES/C3_PROFILE_2026-08-06/README.md) and the
[`C3-to-C2 transition experiment`](../FIELD_NOTES/C3_PROFILE_2026-08-06/C3_TO_C2_TRANSITION_2026-08-06/README.md).

## 3. Shared method practices already present

| Method practice | `TRACE_TO_MOTION` record | C2/C3 package record |
| --- | --- | --- |
| bounded question before interpretation | research question and explicit exclusions in [`12_TRACE_TO_MOTION_0_1.md`](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/12_TRACE_TO_MOTION_0_1.md) | declared question and separate retention/transition distinction in the [transition report](../FIELD_NOTES/C3_PROFILE_2026-08-06/C3_TO_C2_TRANSITION_2026-08-06/README.md) |
| declared objects and conditions | source, trace, representation, mask and reconstruction; `SOURCE`, `TRACE_ONLY`, `STATIC_SCHEDULE`, `MOVING_SCHEDULE` | frozen fields and integrator; free, minimal-control, capture-lock-off and capture-lock-on conditions |
| declared cuts and thresholds | visibility, support, reconstruction and status rules; masks change the record rather than the source | entry, residence, relapse, timeout and domain cuts; radii are explicitly operational rather than natural basin boundaries |
| controlled or paired comparison | exact reversal pairs and same-source static/moving schedule design | identical start/noise pairs across all four conditions |
| frozen protocol or method | frozen representation, schedules, metrics, tolerances and provenance requirements | fixed integrator, time step, horizon, seed construction, calibration rule and outcome contract |
| machine-readable results | schemas, manifests, hashes and dry-run result artifacts | CSV and JSON trial, summary and sensitivity outputs |
| deterministic reproduction and replay | deterministic Track-A transformations and Track-B replay reports | two-run byte-identical replay with recorded SHA-256 hashes in [`REPRODUCIBILITY.md`](../FIELD_NOTES/C3_PROFILE_2026-08-06/C3_TO_C2_TRANSITION_2026-08-06/REPRODUCIBILITY.md) |
| explicit non-result or failure states | `UNKNOWN`, `INVALID`, `BLOCKED`, leakage and missing-support conditions | timeout, non-finite state, domain exit and unsuccessful residence |
| claim boundary and non-transfer | representation and reconstruction do not establish source cause, meaning or universal orientation | controlled capture is not free-field stability; no physical, biological, psychological or ontological transfer |
| stop or non-promotion rule | blocked tracks and absent authority do not become results; no successor study opens automatically | reproducibility does not strengthen the model claim; the tested lock receives no operational promotion without added outcome benefit |

Primary protocol references are the
[`Acquisition and Analysis Protocol`](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/TRACE_TO_MOTION_0_1_PROTOCOL_DRAFT/01_ACQUISITION_AND_ANALYSIS_PROTOCOL.md),
[`Lab Boundaries`](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/04_BOUNDARIES.md),
[`Falsification`](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/07_FALSIFICATION.md),
the [`C3 profile`](../FIELD_NOTES/C3_PROFILE_2026-08-06/README.md), and the
[`C3-to-C2 transition report`](../FIELD_NOTES/C3_PROFILE_2026-08-06/C3_TO_C2_TRANSITION_2026-08-06/README.md).

## 4. Practices not established as shared

The inspected artifacts do not establish any of the following as common
infrastructure:

- one mathematical model or shared mathematics;
- one formal operator contract;
- a shared I-L-A-U application;
- one evidence-class taxonomy;
- one data schema;
- one software architecture;
- one repository home;
- identical governance or maturity;
- a scientific dependency between Track C and the C3-to-C2 transition work.

I-L-A-U is applied locally in the
[`Track-B Reversal Relation and I-L-A-U Audit`](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/TRACE_TO_MOTION_0_1_PROTOCOL_DRAFT/TRACK_B_REVERSAL_RELATION_AND_ILAU_AUDIT_DE.md),
not in the C2/C3 package. The
[`Operator Contract Documentation Schema`](12_OPERATOR_CONTRACT_DOCUMENTATION_SCHEMA_CANDIDATE.md)
is a documentation candidate with no operational effect and is not instantiated
as a common contract here.

Track C retains its existing meaning: comparison of predeclared static and
moving mask schedules in availability, conditional reconstruction error and
common-support reconstruction. The C3-to-C2 experiment does not implement or
modify Track C.

## 5. Existing shared research grammar

The common level is scientific working practice. The repository already records
the following bounded research grammar in
[`RESEARCH_INSTITUTE_PHASE_B/01_EXISTING_RESEARCH_GRAMMAR.md`](../RESEARCH_INSTITUTE_PHASE_B/01_EXISTING_RESEARCH_GRAMMAR.md):

```text
Question
→ Scope and non-claims
→ Declared scientific object
→ Definitions
→ Protocol or method
→ Experiment, study or derivation
→ Result
→ Evidence and provenance
→ Review
→ Disposition or STOP
```

This cross-reference records where the two research lines already use parts of
that grammar. It does not assert that every stage is complete. In particular,
the location of the current C2/C3 package under `FIELD_NOTES` must not be read as
Research review, Evidence classification, adoption or promotion.

## 6. Non-effects

This document does not:

- merge the two research lines;
- reinterpret or activate Track C;
- create a theory, mathematical object, operator, track, metric or schema;
- change OLS, the Constitution, ORION or any external repository;
- promote a Field Note, experiment, result or claim;
- create execution, validation, publication or implementation authority.

The supported disposition is limited to:

> two separate research lines use a shared bounded scientific working practice
> while retaining different objects, methods, results, repository homes and
> governance status.
