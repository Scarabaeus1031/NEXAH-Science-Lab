# Final NEXAH Representation Ledger V3 Bounded Revision

## Disposition

**Decision:** `V3_READY_FOR_FINAL_INDEPENDENT_REVIEW`

This bounded revision repairs exactly the three blocking defects demonstrated by the V2 blind re-review: assertion-scope leakage, duplicated machine-readable epistemic status, and resettable negative claim history. It does not authorize a validator, implementation, experiment, T02 change, ORION change, or canonical NEXAH change.

Readiness means that the schema and Samples A–D are ready to be challenged by one final independent review. It is not adoption, implementation approval, or scientific validation.

## Bounded verification result

The four V3 samples conform to `REPRESENTATION_LEDGER_SCHEMA_V3.yaml`. A separate referential audit found no unresolved evidence identifiers, foreign edge identifiers, unknown component identifiers, unordered subpaths, or evidence-to-claim references outside the declared claim set.

The minimal adversarial self-test produced the required outcomes:

- T1: a whole-edge loss assertion without evidence was rejected.
- T2: a second machine-readable status for one epistemic dimension was rejected by the closed status object.
- T3: Case D retains the rejected revision of the stable claim and relates the refined revision to it inside the known record lineage.
- T4: `HISTORY_COMPLETE` with an unresolved prior reference was rejected.
- T5: an unrelated claim with a distinct stable claim identifier and no artificial lineage relation remained valid.

These checks were bounded review operations. No validator or runtime artifact was created.

## Required explicit answers

1. **Is every preservation/loss/invertibility assertion now bound to a defined scope?**  
   Yes. Every such assertion requires one scope object selecting exactly one of `WHOLE_EDGE`, `COMPONENT`, `SUBPATH`, `DERIVED_PROJECTION`, or `SCOPE_UNRESOLVED`. The same scope discipline also covers collision, uncertainty, claim-support, and claim-history assertions.

2. **Can component/subpath claims still leak to the whole edge?**  
   No automatic or structural promotion is permitted. Component and subpath scopes name their edge and components, while whole-edge scope is a distinct closed shape. A whole-edge assertion must be made and evidenced independently. As with any evidence ledger, dishonest semantic labeling remains a content-review problem rather than something JSON Schema can prove.

3. **Is Case C's source/output distinction corrected?**  
   Yes. The raw fixture arguments and frozen protocol are sources; the constructed result record is the output. Round-trip recovery is scoped to `C.C1 -> C.C2`, while status-field loss is scoped only to the declared derived projection of the full result.

4. **Is there exactly one authoritative machine value per epistemic dimension?**  
   Yes. Each of the five dimensions has one required controlled `status` value in one closed object.

5. **Can commentary contradict machine status structurally?**  
   No. Commentary is the nonauthoritative `note`; it cannot introduce a second machine status field. A misleading note can still be challenged during review, but it cannot override the controlled value.

6. **Does claim identity survive record revision?**  
   Yes. `ledger_series_id` persists across the known record lineage; `record_revision` advances the record; and `claim_id` persists while `claim_revision` advances the claim. Explicit `SUPERSEDES`, `REFINES`, `CONTRADICTS`, and `RETRACTS` relations bind revisions where applicable.

7. **Can rejected history still be reset or hidden?**  
   Not within a declared known ledger lineage that conforms to the V3 cross-record rules. Prior record references, completeness state, stable claim identity, and explicit relations expose the history. Unknown or unverifiable lineage must be declared `HISTORY_PARTIAL` or `HISTORY_UNKNOWN`; V3 does not pretend that an external undeclared record can be discovered by schema alone.

8. **Can legitimate unrelated claims remain unrelated?**  
   Yes. A genuinely new claim receives a distinct `claim_id` and needs no relation to an older claim. Relations are required by claim continuity, not by mere topical similarity.

9. **Did V3 preserve all confirmed V2 gains?**  
   Yes. The representation/operator distinction, explicit boundaries and contracts, atomic/composite distinction, uncertainty and invertibility, evidence/provenance separation, technical-versus-symbolic evidence distinction, legitimate incompleteness, Samples A–D, syntax/science distinction, and NEXAH-independent readability remain present.

10. **Are any blocking defects left?**  
    No blocking defect is identified in this bounded self-review. That conclusion remains subject to the required final independent review and must not be interpreted as self-certification.

## Case-specific closure

### Case C

The former boundary error is retained as rejected claim `C.H2`; corrected claim `C.H3` explicitly contradicts it. The evidence conflict is therefore preserved rather than erased. The source/output distinction and every local subpath/projection scope are explicit.

### Case D

`RLS.CASE_D.TRANSLATION_HIERARCHY` is the stable series identity. Record revision 2 references the prior V2 record. Stable claim `D.H.HIERARCHY` retains revision 1 as `REJECTED`; revision 2 is a narrower supported statement related by `REFINES`. The broader claim remains `PARTIAL`, and unresolved aggregate boundaries remain explicit.

## Stop test

> Have exactly the three defects demonstrated by the V2 re-review been repaired without expanding the scientific claims or breaking the gains already established in V2?

**Yes.** The revision stops here. No V4, validator specification, validator implementation, runtime work, experiment, or downstream architecture change is proposed or authorized.

```text
V2_BLOCKING_DEFECTS = 3
V3_BLOCKING_DEFECTS_RESOLVED = 3
V3_BLOCKING_DEFECTS_REMAINING = 0

ASSERTION_SCOPE_EXPLICIT = YES
WHOLE_EDGE_COMPONENT_SUBPATH_DISTINGUISHED = YES
SCOPE_LEAKAGE_PREVENTED = YES
CASE_C_SOURCE_OUTPUT_DISTINCTION_CORRECTED = YES
CASE_C_CONFLICT_PRESERVED = YES

EPISTEMIC_STATUS_SINGLE_SOURCE = YES
DUPLICATE_MACHINE_STATUS_REMOVED = YES
STATUS_COMMENTARY_NONAUTHORITATIVE = YES

STABLE_RECORD_IDENTITY_DEFINED = YES
STABLE_CLAIM_IDENTITY_DEFINED = YES
CROSS_REVISION_RELATIONS_DEFINED = YES
NEGATIVE_HISTORY_RESET_PREVENTED = YES
HISTORY_COMPLETENESS_STATE_DEFINED = YES
LEGITIMATE_NEW_CLAIMS_ALLOWED = YES

CASE_D_NEGATIVE_HISTORY_PRESERVED = YES
V2_CONFIRMED_GAINS_PRESERVED = YES

T1_SCOPE_LEAKAGE = CAUGHT
T2_STATUS_CONTRADICTION = CAUGHT
T3_HISTORY_RESET = CAUGHT
T4_FALSE_COMPLETENESS = CAUGHT
T5_LEGITIMATE_NEW_CLAIM = ALLOWED

VALIDATOR_SPECIFICATION_AUTHORIZED = NO
VALIDATOR_IMPLEMENTATION_AUTHORIZED = NO
NEW_EXPERIMENT_AUTHORIZED = NO
T02_CHANGED = NO
ORION_CHANGED = NO
CANONICAL_NEXAH_CHANGED = NO

FINAL_DECISION = V3_READY_FOR_FINAL_INDEPENDENT_REVIEW
NEXT_ACTION = CONDUCT_ONE_FINAL_INDEPENDENT_REVIEW_OF_SCHEMA_V3_AND_SAMPLES_A_THROUGH_D_BEFORE_ANY_VALIDATOR_SPECIFICATION
```
