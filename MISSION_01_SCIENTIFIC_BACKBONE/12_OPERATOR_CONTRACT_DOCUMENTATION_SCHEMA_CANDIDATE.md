# Operator Contract Documentation Schema Candidate

Status: `DOCUMENTATION SCHEMA CANDIDATE`

Date: 2026-08-06

Operational effect: `NONE`

Promotion status: `NOT PROPOSED FOR OLS OR CONSTITUTION`

## 1. Purpose

This schema records how a bounded transformation is declared, executed and
interpreted. It does not decide whether the recorded object is a canonical
operator, research measure, application function or documentation-only
relation. Applying the schema cannot promote or reclassify an existing object.

The schema is useful only when domain, codomain, transformation and failure
behavior can be stated without inventing missing semantics. Incomplete records
must retain explicit insufficiency statuses.

## 2. Required fields

| Field | Required content |
| --- | --- |
| `operator_identity` | scoped name, version and identity owner; avoid overloaded unqualified names |
| `domain` | mathematical or record type accepted by the transformation |
| `codomain` | mathematical or record type produced |
| `input_contract` | required fields, units, ordering, support, provenance and representation |
| `preconditions` | predicates that must hold before execution |
| `transformation_rule` | exact formula, algorithm or relation, including parameters |
| `output` | returned value or record and its semantics |
| `invariants` | properties checked or guaranteed to remain unchanged |
| `introduced_artifacts` | choices or structures introduced by the method |
| `information_loss` | content removed or collapsed under this transformation |
| `unknown_non_reconstructable` | content not recoverable from the declared output alone |
| `failure_modes` | invalid input, numerical, domain, provenance and contract failures |
| `insufficiency_statuses` | valid non-result states caused by missing support or evidence |
| `evidence_class` | definition, implementation, conformance result, observation, hypothesis or other declared class |
| `claim_boundary` | strongest allowed interpretation and explicit non-claims |
| `operational_effect` | systems or records changed; use `NONE` for documentation-only records |
| `promotion_status` | current maturity and whether promotion is proposed, blocked or prohibited |
| `evidence_references` | primary specifications, code, tests, run records and hashes |

All fields are mandatory. `NONE`, `NOT APPLICABLE`, `UNKNOWN`, `NOT TESTED`
and `INSUFFICIENTLY SPECIFIED` are permitted values when accurate. Blank fields
are not permitted because they hide the difference between absence and review.

## 3. Status vocabulary

Recommended insufficiency statuses include:

```text
INSUFFICIENT_SUPPORT
INSUFFICIENT_SAMPLING
MISSING_PARAMETER
MISSING_PROVENANCE
UNDECLARED_REPRESENTATION
UNBOUND_COMPARISON_BASIS
DEGENERATE_INPUT
NOT_TESTED
```

Recommended failure classes include:

```text
INVALID_INPUT
PRECONDITION_FAILED
DOMAIN_ERROR
NUMERIC_FAILURE
PROVENANCE_CONFLICT
CONTRACT_VERSION_MISMATCH
```

An insufficiency is not silently converted into failure, zero, false or
`UNKNOWN` unless the individual contract explicitly defines that mapping.

## 4. Example A — Reflection Involution

| Field | Record |
| --- | --- |
| `operator_identity` | `J_ref/0.1`, Reflection Involution specification candidate |
| `domain` | `[0,1]`, or `[0,1] x Y` for the declared 2D instance |
| `codomain` | same as domain |
| `input_contract` | normalized reflection coordinate; declared accompanying space `Y` where applicable |
| `preconditions` | first coordinate belongs to `[0,1]`; coordinate semantics and normalization declared |
| `transformation_rule` | `J_ref(u)=1-u`; in 2D, `J_ref(x,y)=(1-x,y)` |
| `output` | reflected point in the same declared space |
| `invariants` | `J_ref composed with J_ref = id`; accompanying coordinate `y`; exact fixed set as declared |
| `introduced_artifacts` | normalized reflection coordinate and any separately declared tolerance band |
| `information_loss` | none for the exact involution itself |
| `unknown_non_reconstructable` | source meaning, physical symmetry and coordinate validity are not inferred from the output |
| `failure_modes` | domain error; undeclared normalization; incompatible codomain |
| `insufficiency_statuses` | `UNDECLARED_REPRESENTATION`, `MISSING_PARAMETER` for an unspecified tolerance band |
| `evidence_class` | standard mathematical definition; repository specification candidate |
| `claim_boundary` | exact reflection only; no physical symmetry, transition mechanism, midpoint privilege or JANUS-DCO identity |
| `operational_effect` | `NONE` |
| `promotion_status` | `NO OPERATOR PROMOTION` |
| `evidence_references` | `11_REFLECTION_INVOLUTION_SPECIFICATION.md` |

## 5. Example B — Track-B Reversal Involution

| Field | Record |
| --- | --- |
| `operator_identity` | `R_B/EXP-B02-AUDIT`, Track-B Reversal Involution |
| `domain` | eight frozen EXP-B02 rooted directed candidates |
| `codomain` | same eight-candidate set |
| `input_contract` | valid candidate ID with technical start node and direction member `D01` or `D02` |
| `preconditions` | candidate belongs to the frozen EXP-B02 set; paired opposite direction exists at the same start |
| `transformation_rule` | exchange `D01` and `D02` while preserving the technical start node |
| `output` | the paired candidate with opposite traversal direction |
| `invariants` | start node, node set, undirected edge set, spatial support and closure |
| `introduced_artifacts` | none beyond the already introduced technical candidate IDs and enumeration |
| `information_loss` | none under `R_B`; the separate undirected projection loses ordered traversal |
| `unknown_non_reconstructable` | original start, original direction, time, speed, cause and source provenance |
| `failure_modes` | invalid candidate ID; absent pair; freeze/version mismatch |
| `insufficiency_statuses` | `CONTRACT_VERSION_MISMATCH`, `MISSING_PROVENANCE` |
| `evidence_class` | documentation-only relation verified against frozen synthetic candidate records |
| `claim_boundary` | conformance relation only; no equivalence class, candidate merge, source-direction identification or physical motion |
| `operational_effect` | `NONE` |
| `promotion_status` | `DOCUMENTATION-ONLY AUDIT VIEW` |
| `evidence_references` | Track-B reversal audit and EXP-B02 candidate/report JSON files |

## 6. Example C — Lab 0.4 post-projection representation mask

| Field | Record |
| --- | --- |
| `operator_identity` | `RO-LAB-0.4/REPRESENTATION-MASK`, implemented synthetic side-car operation |
| `domain` | projected samples containing stable source ID, sample index, phase, `(u,v)` and depth |
| `codomain` | the same projected sample fields plus mask center, mask width and one record classification |
| `input_contract` | authorised fixed projection; finite phase and projected coordinate; declared mask options, tolerance and Full-Trace Gate state |
| `preconditions` | projection already executed; mask width and position are clamped by the implementation; source/sample identity retained |
| `transformation_rule` | compute the phase-dependent mask, compare `abs(u-center)` with half-width and tolerance, assign `BOUNDARY`, masked or unmasked class |
| `output` | classified projected record; renderability is derived separately from the classification |
| `invariants` | source record, source identity, sample index and generated source coordinates; mask is applied after projection |
| `introduced_artifacts` | mask schedule, width, tolerance band, Full-Trace Gate state and epistemic classification |
| `information_loss` | the displayed record withholds masked projected samples; orthographic projection separately suppresses displayed depth |
| `unknown_non_reconstructable` | without a declared complete trace, masked sample values are `UNKNOWN` in the represented record |
| `failure_modes` | unsupported view; invalid sample count; non-finite or contract-incompatible options |
| `insufficiency_statuses` | `UNKNOWN` is a declared record class; missing full trace prevents recovery but does not alter the source |
| `evidence_class` | implemented deterministic synthetic model with a reported 19-check test suite |
| `claim_boundary` | availability and projection test only; no astronomical occultation, physical shadow, force, source deletion or universal topology |
| `operational_effect` | changes only the synthetic represented/classified record in the Lab 0.4 instrument |
| `promotion_status` | existing bounded Lab operation; no OLS or Constitution promotion proposed |
| `evidence_references` | frozen Lab 0.4 report, model, test and translation-audit manifest |

## 7. Schema evaluation

The schema supports all required fields for the three examples without
collapsing definition, implementation and evidence status. It also exposes an
important distinction:

- Reflection is an exact mathematical definition candidate;
- Track-B reversal is a documentation-only relation on frozen records;
- the Lab 0.4 mask is an implemented, synthetic application operation.

Their use of one documentation form does not give them equal maturity,
authority or scope.

## 8. Non-effects

This document does not:

- add an OLS primitive;
- modify the Constitution;
- rename or promote JANUS-DCO;
- change Track-B candidate identities or the EXP-B02 freeze;
- activate Moving Mask research or Human acquisition;
- create an ORION authorization path;
- modify any implementation.

