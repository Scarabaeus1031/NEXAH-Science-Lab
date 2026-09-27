# TITAN Gap Register

Rejected, superseded, underdefined, expression-only, and deliberately unnecessary objects are excluded. Six gaps remain.

## TITAN-G01 — Adopted OLS–RID–ORION crosswalk

- `SYSTEM_LAYER`: semantics/interface
- `PRIORITY`: T1
- `EXPECTED_ROLE`: bind every RID type to an OLS owner/boundary and a permitted ORION consumer without transferring authority.
- `EVIDENCE_THAT_ROLE_IS_NEEDED`: OLS requires inspectable implementation mappings; RID is current baseline; ORION uses distinct certified contracts.
- `CURRENT_NEAREST_ARTIFACT`: OLS repository extraction, machine-readable architecture proposal, RID schema.
- `CURRENT_STATUS`: PARTIAL
- `WHY_REAL`: same labels currently span non-identical scopes.
- `WHY_NOT_SOLVED`: mappings are informative; no accepted versioned binding exists.
- `WHY_NOT_REJECTED`: all three surfaces are active authoritative artifacts.
- `DEPENDENCIES`: Human scope/adoption decision; frozen OLS and ORION boundaries.
- `MINIMAL_CLOSURE_CONDITION`: one versioned, testable mapping table with unmapped/forbidden cases.
- `IMPLEMENTATION_REQUIRED`: NO
- `RESEARCH_REQUIRED`: NO

## TITAN-G02 — RID validator and canonical serializer

- `SYSTEM_LAYER`: machine contract
- `PRIORITY`: T2
- `EXPECTED_ROLE`: load, validate, canonicalize, and reject RID records deterministically.
- `EVIDENCE_THAT_ROLE_IS_NEEDED`: RID fixtures currently prove schema behavior only.
- `CURRENT_NEAREST_ARTIFACT`: RID schema, fixtures, validation report.
- `CURRENT_STATUS`: MISSING
- `WHY_REAL`: executable use requires a realization of the frozen contract.
- `WHY_NOT_SOLVED`: no production or prototype source was created.
- `WHY_NOT_REJECTED`: RID closed ready for a Human prototype gate.
- `DEPENDENCIES`: Human Prototype Gate.
- `MINIMAL_CLOSURE_CONDITION`: one read-only implementation passing all 20 fixtures and deterministic byte tests.
- `IMPLEMENTATION_REQUIRED`: YES
- `RESEARCH_REQUIRED`: NO

## TITAN-G03 — Minimal bounded execution semantics

- `SYSTEM_LAYER`: execution
- `PRIORITY`: T2
- `EXPECTED_ROLE`: demonstrate one already-defined non-authoritative operation without inventing operator meaning.
- `EVIDENCE_THAT_ROLE_IS_NEEDED`: a typed executable machine requires at least one event/outcome path; GIJ separates conditions from occurrence.
- `CURRENT_NEAREST_ARTIFACT`: RID operation/rule/event/result model; ORION structural constructors.
- `CURRENT_STATUS`: MISSING
- `WHY_REAL`: schema parsing alone is not execution.
- `WHY_NOT_SOLVED`: RID deliberately defines contract structure, not runtime behavior.
- `WHY_NOT_REJECTED`: execution as a layer is retained; universal or symbolic operators are not required.
- `DEPENDENCIES`: G01, G02, explicit Human-selected bounded operation.
- `MINIMAL_CLOSURE_CONDITION`: one deterministic operation with attested event, outcome/error, trace, provenance, and STOP.
- `IMPLEMENTATION_REQUIRED`: YES
- `RESEARCH_REQUIRED`: NO

## TITAN-G04 — RID-to-ORION adapter outside certified V1

- `SYSTEM_LAYER`: integration
- `PRIORITY`: T3
- `EXPECTED_ROLE`: translate accepted RID records to a separately governed ORION input or reject them fail-closed.
- `EVIDENCE_THAT_ROLE_IS_NEEDED`: RID is the machine baseline; ORION owns the only certified execution chain.
- `CURRENT_NEAREST_ARTIFACT`: approved-not-implemented membrane; older Public Contract adapters.
- `CURRENT_STATUS`: MISSING
- `WHY_REAL`: contract and certified engine otherwise remain disconnected.
- `WHY_NOT_SOLVED`: no accepted adapter exists; old adapters bind different contracts.
- `WHY_NOT_REJECTED`: interface is approved as a boundary, though not activated.
- `DEPENDENCIES`: G01, G02; separate extension/adoption decision.
- `MINIMAL_CLOSURE_CONDITION`: adapter fixtures proving exact mapping, rejection, provenance, and no V1 mutation.
- `IMPLEMENTATION_REQUIRED`: YES
- `RESEARCH_REQUIRED`: NO

## TITAN-G05 — End-to-end conformance and replay

- `SYSTEM_LAYER`: integration
- `PRIORITY`: T3
- `EXPECTED_ROLE`: prove schema→adapter→bounded execution→outcome/trace replay.
- `EVIDENCE_THAT_ROLE_IS_NEEDED`: ORION proves replay only inside its certified chain; RID proves schema only.
- `CURRENT_NEAREST_ARTIFACT`: RID fixtures and ORION proof scripts.
- `CURRENT_STATUS`: MISSING
- `WHY_REAL`: local proofs do not compose automatically.
- `WHY_NOT_SOLVED`: there is no integrated path to test.
- `WHY_NOT_REJECTED`: deterministic replay is an explicit existing requirement.
- `DEPENDENCIES`: G02–G04.
- `MINIMAL_CLOSURE_CONDITION`: positive, negative, tamper, ambiguity, error, and replay fixtures across the adopted path.
- `IMPLEMENTATION_REQUIRED`: YES
- `RESEARCH_REQUIRED`: NO

## TITAN-G06 — Human-inspectable RID result binding

- `SYSTEM_LAYER`: human interface
- `PRIORITY`: T4
- `EXPECTED_ROLE`: show source, retained/lost/introduced/unresolved content, evidence class, uncertainty, outcome, trace, and STOP without status upgrade.
- `EVIDENCE_THAT_ROLE_IS_NEEDED`: demonstrators and NEXAHEDRON show the communication need; current bindings use other contracts.
- `CURRENT_NEAREST_ARTIFACT`: ORION Expression, LYRA history, NEXAHEDRON, private demonstrators.
- `CURRENT_STATUS`: PARTIAL
- `WHY_REAL`: a typed machine without an inspectable boundary would not satisfy the orientation discipline.
- `WHY_NOT_SOLVED`: no view is bound to RID identities and provenance.
- `WHY_NOT_REJECTED`: Human inspection is a retained governance requirement.
- `DEPENDENCIES`: G02 and optionally G04/G05.
- `MINIMAL_CLOSURE_CONDITION`: one read-only view with exact source links and nonclaim card.
- `IMPLEMENTATION_REQUIRED`: YES
- `RESEARCH_REQUIRED`: NO

Counts: `T0=0`, `T1=1`, `T2=2`, `T3=2`, `T4=1`, `T5=0`.

