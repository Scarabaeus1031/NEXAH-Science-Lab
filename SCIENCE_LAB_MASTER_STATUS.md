# NEXAH / ORION Science Lab — Master Status

Status date: 2026-08-14

Mode: **STRUCTURE FREEZE**
Primary active experiment: **NONE**

## 0. Current portfolio reconciliation

The Lab is governed by [Science Lab Constitution V1](SCIENCE_LAB/LAB_CONSTITUTION.md).
Operational work begins at [Active Work](SCIENCE_LAB/ACTIVE_WORK.md) and the
single [Lab Register](SCIENCE_LAB/LAB_REGISTER.md). During Structure Freeze no
experiment, scientific replay, new admission or evidence repair is authorized.

This file remains the current scientific-status orientation point. Package-level
scientific states below are unchanged; their operational activation is paused.
Four later research lines are reconciled here:

| Line | Current disposition | Controlling final record |
| --- | --- | --- |
| T02 | `FROZEN`; external task/population/power gates unresolved; no preregistration, implementation or experiment authorized | [`FINAL_T02_V3_PREREGISTRATION_GATE_AUDIT.md`](NEXAH_T02_V3_PREREGISTRATION_GATE_AUDIT/FINAL_T02_V3_PREREGISTRATION_GATE_AUDIT.md) |
| ORION reduced optical-inertial metrology | `EXTERNAL_REVIEW`; scientifically meaningful reduced problem, but `NEXAH_METHOD_IN_ORION = UNDEFINED`; no build, experiment or integration authorized | [`FINAL_ORION_EXTERNAL_APPLICATION_LANDING_AUDIT.md`](ORION_EXTERNAL_APPLICATION_LANDING_AUDIT/FINAL_ORION_EXTERNAL_APPLICATION_LANDING_AUDIT.md) |
| Representation Ledger | schema-development line `CLOSED`; final role `STRUCTURED_PROVENANCE_ONLY`; one cross-revision claim-identity blocker preserved; no V4 or validator | [`FINAL_NEXAH_REPRESENTATION_LEDGER_V3_INDEPENDENT_REVIEW.md`](NEXAH_REPRESENTATION_LEDGER_V3_FINAL_INDEPENDENT_REVIEW/FINAL_NEXAH_REPRESENTATION_LEDGER_V3_INDEPENDENT_REVIEW.md) |
| First representation-transition case study | `METHODOLOGICAL_CLARITY_ONLY`; source recoverability distinguished from downstream operational fidelity; no new mathematical principle or NEXAH algorithm | [`FINAL_NEXAH_REPRESENTATION_TRANSITION_CASE_STUDY.md`](NEXAH_FIRST_CONCRETE_REPRESENTATION_TRANSITION_CASE_STUDY/FINAL_NEXAH_REPRESENTATION_TRANSITION_CASE_STUDY.md) |

The case-study result is bounded to the frozen Study-3 baseline/delay evidence:
the one-step delay representation retains current observations and is
recoverable for that source package, while the downstream geometry-sensitive
decoder loses state and transition identity. This is methodological
clarification, not theory or implementation authority.

Historical next actions in earlier audit folders describe the state at their
date. They are not current authority. Current readers must use the terminal
records linked above.

## 1. Where we are

The intensive architecture-build session is closed. EXP-00-R retains its
pre-registered-production scientific state, but it is **not operationally
active** during Structure Freeze and has not crossed the registered scientific
boundary. Its scientific design, V3 implementation, evidence-export contract,
Generator R2 and Payload Producer R1 are closed and independently reviewed.

The current position is: **the complete frozen V1 → Producer R1 → Generator R2 chain is reviewed and ready for a new registered-evidence generation authorization recheck; no such recheck or production occurs in this session.**

This distinction is controlling:

| Validated infrastructure | Registered scientific evidence |
| --- | --- |
| Synthetic fixtures and reference objects | Not generated |
| Regression and conformance suites | Not a scientific result |
| Historical-runtime reproduction | Not a registered experiment |
| Independent engineering reviews | Do not establish P1–P5 |
| Closed generator and producer | Do not authorize production |

```text
REGISTERED TEST SEEDS EXECUTED: NO
REGISTERED EVIDENCE GENERATED: NO
REGISTERED EXPERIMENT EXECUTED: NO
P1-P5 EVALUATED: NO
SCIENTIFIC CLASSIFICATION GENERATED: NO
SCIENTIFIC RESULT KNOWN: NO
```

## 2. EXP-00-R current state

| Layer | Current status | Current authority |
| --- | --- | --- |
| Scientific design | CLOSED | Frozen V1 plus accepted additive scientific-contract chain |
| V3 engineering | CLOSED | V3R6 material-callable integrity package |
| Independent engineering review | PASS | Final V3R6 evidence-only review |
| Registered evidence export contract | CLOSED | Export R1 and its accepted reconciliation/review lineage |
| Generator | `CLOSED_R2` | Generator R2, tree `82ff760b…c5fb` |
| Independent generator review | PASS | review tree `9847c76c…a719` |
| Payload producer | CLOSED | Producer R1, tree `05beedf4…c5fb` |
| Independent producer review | PASS; Class-A 0, Class-B 0 | review tree `1bc968a0…e640` |
| Current operational gate | NEXT, not performed | registered-evidence generation authorization recheck for the current chain |
| Registered evidence generation | NOT STARTED | requires a separate current authorization |
| Content-blind evidence seal | NOT STARTED | downstream of legitimate generation |
| Registered experiment / P1–P5 / classification | NOT STARTED | downstream of the registered boundary |
| Final Lab Report | NOT STARTED | requires validated registered results |

EXP-00-R asks whether agreement between two distinct learned action-ranking representations of the same Rössler state adds held-out information about intervention reliability. The result may be positive, negative, partial, no-extra-information, or invalid for a legitimate frozen reason. Infrastructure closure does not favor any result.

## 3. The current trusted production path

```text
Frozen V1 scientific outputs
        ↓
Payload Producer R1                  CLOSED / independently PASS
        ↓
Generator R2                         CLOSED_R2 / independently PASS
        ↓
Registered Evidence                  NOT GENERATED
        ↓
Registered Analysis                  NOT EXECUTED
        ↓
Scientific Result                    UNKNOWN
```

The chain is technically present but dormant. Producer R1 is the reviewed adapter that maps already-computed frozen outputs into Generator R2. Generator R2 validates and serializes the evidence contract. Neither object grants authorization, executes registered seeds, evaluates P1–P5, or creates a scientific result.

The prior generation authorization and generation-operation packages are historical because they were bound to older Generator R1 / missing-producer states. They must not be reused as authority for the current R2 chain.

## 4. What is closed

- The EXP-00-R scientific estimand, plant, action set, target, representations, populations, nulls, sensitivities, endpoints, validity gates and classification rules are frozen.
- V3 engineering is closed at V3R6; its final independent review reports zero Class-A and zero Class-B defects.
- The registered-evidence export contract is closed through its additive repair/reconciliation lineage.
- Generator R2 closes the N3/N4 family-specific null-namespace interface and preserves canonical bytes and RNG identity.
- Producer R1 closes the missing V1-output-to-Generator-R2 wire.
- The independent Producer R1 review passed and closes further producer development/review absent a specific reproducible contradiction.
- REP-01 is preserved as a future pipeline candidate without analysis or activation.

Closure means normal work should use the current objects below. It does not delete the historical packages or make them scientifically irrelevant provenance.

## 5. What has not happened

No registered test-seed trajectory or outcome has been executed or inspected. No registered evidence object exists at the frozen output name. No content-blind evidence seal has been produced. No registered V3 analysis has run. P1–P5 have not been evaluated. No EXP-00-R classification or final Lab Report exists.

The earlier authorization packages, failed seal/materialization attempts, synthetic validation, generator/producer tests and independent reviews do not change these facts. In particular, an old one-operation authorization bound to Generator R1 is not authorization for the now-current Generator R2 chain.

## 6. Current authoritative objects

These are the smallest useful human entry points:

| Human pointer | Object | Why it is current |
| --- | --- | --- |
| Current scientific authority | [`EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/`](EXP_00_R_ROSSLER_REPLICATION_FREEZE_V1/) plus accepted A1–A5 contract chain | Frozen scientific design and estimand |
| Current evidence/identity authority | [`EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEF/`](EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEF/) and [`A5XEFR`](EXP_00_R_SCIENTIFIC_CONTRACT_AMENDMENT_A5XEFR/) | Raw-evidence, authority and execution-identity boundary |
| Current engineering authority | [`EXP_00_R_ROSSLER_REPLICATION_V3R6_MATERIAL_CALLABLE_INTEGRITY/`](EXP_00_R_ROSSLER_REPLICATION_V3R6_MATERIAL_CALLABLE_INTEGRITY/) | Latest accepted V3 implementation |
| Current engineering review | [`EXP_00_R_ROSSLER_REPLICATION_V3R6_FINAL_EVIDENCE_ONLY_REVIEW/`](EXP_00_R_ROSSLER_REPLICATION_V3R6_FINAL_EVIDENCE_ONLY_REVIEW/) | Final V3 closure |
| Current generator | [`EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2/`](EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2/) | Closed Generator R2 |
| Current generator review | [`EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2_INDEPENDENT_REVIEW/`](EXP_00_R_ROSSLER_REPLICATION_REGISTERED_EVIDENCE_GENERATOR_R2_INDEPENDENT_REVIEW/) | Independent R2 PASS |
| Current producer | [`EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1/`](EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1/) | Closed current adapter |
| Current producer review | [`EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1_INDEPENDENT_REVIEW/`](EXP_00_R_ROSSLER_REPLICATION_REGISTERED_PAYLOAD_PRODUCER_R1_INDEPENDENT_REVIEW/) | Independent PASS; producer status CLOSED |
| Detailed historical Lab status | Local untracked `EXP_00_R_ROSSLER_REPLICATION_LAB_PAD/` | Detailed provenance; not a remote-durable clean-checkout entry point and some prose predates R2/Producer R1 |
| Current Lab status | [`SCIENCE_LAB_MASTER_STATUS.md`](SCIENCE_LAB_MASTER_STATUS.md) | Primary next-session orientation point |
| Next operational frontier | New authorization recheck for `V1 → Producer R1 → Generator R2` | Must be performed separately; not yet created or granted |

The scientific and evidence-contract chains are cumulative authority, not invitations to reconsider every historical repair during normal operation.

## 7. Closed / do not reopen

| Historical operational state | Current closure | Normal treatment |
| --- | --- | --- |
| Freeze V2/V3 and V3/V3R1–V3R5 engineering iterations | V3R6 plus final V3R6 review | provenance only; use V3R6 |
| Original Generator and its failed review | Generator R1 repair lineage, then Generator R2 | do not operate the original generator |
| Generator R1 and Generator R1 review as current endpoint | Generator R2 plus independent R2 review | retain as lineage; use R2 |
| N3/N4 namespace contradiction package | Generator R2 and independent R2 review | contradiction closed |
| Failed payload-producer attempt | Producer R1 plus independent producer review | retain failure; use Producer R1 |
| Initial Export amendment/review defects and seal conflict | Export R1 plus reconciliation and accepted review | do not relitigate old tree semantics |
| Historical `NOT_AUTHORIZED` authorization attempt | later reconciliation, then current-chain changes | not a current blocker or grant |
| Historical Generator-R1 one-operation authorization | Producer/Generator chain subsequently changed to R1/R2 | never reuse for current production |
| Failed generation operation (`SEALED_REGISTERED_PAYLOAD_PRODUCER_NOT_FOUND`) | Producer R1 is now closed | failure provenance; operation itself remains failed |
| Registered-input not-found / provenance investigations | future evidence must be generated through current reviewed chain | no alternate object was found; do not resume the detour |
| Pre-/post-V3 and post-R1 Lab Pad seals | this Master Status | historical status snapshots |

A closed historical defect may be reopened only when a specific reproducible contradiction demonstrates that the latest authoritative closure is invalid. Optional hardening, curiosity, architectural preference or recollection of an old failure is insufficient.

## 8. Experiment pipeline

| Category | Experiment/object | Status |
| --- | --- | --- |
| BLOCKED BY STRUCTURE FREEZE | EXP-00-R Rössler replication | scientific state retained; no operational activation or execution |
| NEXT AFTER ACTIVE EXPERIMENT | REP-01 pipeline review | review only after EXP-00-R closure or explicit human reprioritization |
| FUTURE / PARKED | REP-01 — Classical Impossibility → Representation Lift | `PIPELINE_CANDIDATE`; not analyzed, implemented or active |
| ARCHIVAL IDEA ONLY | No additional formally registered candidate | research-program and field-note folders remain context, not activated experiments |

REP-01 remains governed by the local untracked
`ORION_EXPERIMENT_PIPELINE/REP_01_AME46_REPRESENTATION_LIFT/` record. It is not
a remote-durable clean-checkout entry point. Its AME reference target has not
been reviewed or compared, and its blind-test intent remains prospective.

## 9. Historical objects that can be ignored during normal operation

The Lab contains many packages because defects and repairs were preserved additively. This is intentional provenance, not a requirement that a human hold every version in working memory.

- **Generator lineage:** Original → R1 → R2. R2 is current; earlier packages explain why it exists.
- **Producer lineage:** stopped contradiction package → Producer R1. Producer R1 is current.
- **Engineering lineage:** Freeze V1/V2/V3 and V3R1–V3R6. V3R6 plus its final review are current.
- **Contract lineage:** A1–A5 and A5X/A5XR/A5XE/A5XEF/A5XEFR are cumulative frozen authority. Humans normally enter through the scientific core/Lab Pad and current implementation objects, not by replaying every amendment review.
- **Export lineage:** initial export amendment/review → R1 → seal reconciliation. The reconciled R1 authority is current.
- **Authorization and input lineage:** earlier authorization, seal, not-found, provenance and failed generation packages describe previous chain states. None authorizes the current R2 chain.
- **Prior Lorenz work:** EXP-00 v1 and EXP-00 v2 remain historical scientific context for why EXP-00-R exists; they are not the active Rössler result.

Preserve all of these packages. During normal operation, start with the current pointers in section 6 and consult lineage only when provenance or a concrete contradiction requires it.

## 10. EXP-00-R-specific conditional future sequence

This sequence is not current work. It becomes eligible only after all Structure
Freeze gates pass and the Human Owner separately reopens and activates EXP-00-R.

1. **REGISTERED EVIDENCE GENERATION AUTHORIZATION RECHECK** for the fully reviewed `V1 → Producer R1 → Generator R2` chain.
2. **If and only if that authorization passes,** perform the separately authorized registered-evidence production and content-blind sealing sequence under the frozen rules.
3. **Only after the registered boundary is legitimately crossed,** execute and evaluate EXP-00-R according to its existing frozen scientific contract, then proceed toward the final Lab Report.

None of these actions is performed by this status/closure task.

## 11. What we explicitly will not do yet

We will not create another amendment, generator, producer, authorization package, governance layer or experiment candidate in this session. We will not repair historical artifacts, reuse obsolete authorization, search for substitute registered evidence, access registered seeds, generate evidence, execute V3, inspect outcomes, evaluate P1–P5, classify EXP-00-R, write the final result report, activate REP-01, or analyze its AME hypothesis.

The Lab is now in Structure Freeze. The purpose of the closed infrastructure is
to allow an eventual result—including a null, negative, partial or validity
outcome—to survive scrutiny, not to perpetuate architecture building.

## 12. Cross-line authorization boundary

The portfolio reconciliation does not authorize any of the following:

- T02 preregistration, implementation or execution;
- an ORION hardware build, experiment or NEXAH integration;
- Representation Ledger V4, validator specification or validator implementation;
- implementation of the representation-transition case study;
- promotion of Flower, Perspectives, inversion, aperture or other exploratory
  Codex material into scientific findings;
- a canonical NEXAH implementation change.

The repository-wide checkpoint and intentional residuals are recorded in
[`NEXAH_LAB_CONSOLIDATION_REPORT.md`](NEXAH_LAB_CONSOLIDATION_REPORT.md).
