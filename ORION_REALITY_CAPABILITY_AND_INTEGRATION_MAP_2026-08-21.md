# ORION Reality, Capability and Integration Map

```yaml
report_date: 2026-08-21
active_role: 04 ORION Verification & Integration Engineer
mode: READ_ONLY_EVIDENCE_BACKED_RECONSTRUCTION
report_status: NONCANONICAL_VERIFICATION_REPORT
orion_repository: /Users/tho2020/Documents/NEXAH ECOSYSTEM/20 ORION/NEXAH-ORION
certified_release: v1.0.0
certified_commit: d34fbb2f99334534f4db89465a29f8bdb16d14d3
certified_fingerprint: 6201362c094530a0a31fa3d80b46c9131011bb8c8d400183271b0da0eb423f8d
review_branch: codex/orion-working-state-review-2026-08-14
review_head: c62a8c7623613343cfe62f600ff0d531ba30acb8
portfolio_authority: D-021 through D-025
repository_change: THIS_REPORT_ONLY
implementation: NONE
adoption_effect: NONE
```

## 1. Executive definition

1. ORION is currently an independently released, deterministic **structural orientation core**, not a general research assistant, scientific authority or Human decision system.
2. Its certified Version 1 is the exact tag `v1.0.0` at commit `d34fbb2…`, and its authority ends after Structural Representation, UNDERSTAND inventory/statistics, structural and declared Relations, structural Navigation, Structural Orientation Map, Expression certification and `STOP at_slice_iv_certified`.
3. The certified path accepts already-confirmed immutable Markdown material; it does not ingest an open research question or arbitrary corpus and does not perform semantic claim extraction, scientific support assessment or uncertainty estimation.
4. The repository also contains executable Context, Claim, provider, Ollama, Transformation, Public Contract, Gateway, Runtime, LYRA and Orientation Session work, but the current Version Classification and ADR-0009 keep those components historical, experimental, separately governed or not adopted.
5. ORION's original broader purpose was provider-neutral orchestration above the NEXAH Kernel—models propose, ORION validates, the Kernel decides—but no current executable ORION-to-Kernel adapter implements that full responsibility chain.
6. Runtime 1.1 is substantial executable candidate code, yet D-023 and its own verification evidence keep it `NOT_ADOPTED · NOT_RELEASE_READY · NOT_PUBLICLY_CLAIMABLE`.
7. NEXAHEDRON has a tested Human-confirmed consumer boundary for the older Public Contract/Gateway path, but it is pinned to the certified commit, has no production evidence adapter, and its clarification loop is blocked fail-closed.
8. Science Lab already owns the relevant translation, invariance, coupling, baseline, metric and negative-result evidence; those results do not enlarge ORION capability.
9. A Research Orientation Session can reuse the certified structural chain and selectively adapt existing non-certified prototypes, but an adopted semantic source/claim/inference/uncertainty contract and a verified complete session binding do not exist.
10. The Open-Fracture package supplies no new ORION method, evidence or implementation; at most it offers terminology and protocol fragments for Desk-05 deduplication.

## 2. Authority and version map

| Surface | Controlling identity | Observed status | Authority and boundary |
|---|---|---|---|
| ORION Certified Core | `NEXAH-ORION` tag `v1.0.0` → `d34fbb2f99334534f4db89465a29f8bdb16d14d3`; package version `1.0.0` | `RELEASED · CERTIFIED · FROZEN` within the declared structural scope | `docs/releases/ORION_V1_CERTIFIED_BASELINE.md`, Release Notes, Version Classification and Reading Order control. Final STOP is `at_slice_iv_certified`; Runtime, Gateway, LYRA, applications, presentation, reasoning, semantic interpretation and decision are excluded. |
| Current ORION worktree | branch `codex/orion-working-state-review-2026-08-14` at `c62a8c7623613343cfe62f600ff0d531ba30acb8` | clean; `PRESERVATION_AND_REVIEW`; not the certified revision | `docs/reviews/ORION_WORKING_STATE_REVIEW_2026-08-14.md` and the Noncanonical Working-Set Index deny adoption, public deployment and change of architecture authority. |
| Current architecture partition | ADR-0009 and `docs/architecture/ORION_MASTER_ARCHITECTURE.md` | `ACCEPTED`; Certified Core + no adopted extension profiles + External Research | Controls current reading of older broader ADR/F1 texts. Interface V1 is `MEMBRANE_V1_APPROVED_NOT_IMPLEMENTED`; retained implementations gain no certification. |
| Runtime 1.1 | `src/orion_runtime/`, Runtime contracts, tests, manifest and review set on Review branch | `IMPLEMENTED · PARTIALLY_TESTED · NOT_ADOPTED · HOLD_UNTIL` | D-023 controls portfolio state. Return requires exact release identity, all relevant suites green, target Linux, security/isolation, immutable deployment and a new Thomas adoption decision. |
| Earlier Public Contract/Gateway/Runtime | `src/orion/public_contracts/`, `src/orion/gateway/`, `src/orion/orientation_runtime/` | executable and tested historical/separately governed work | Explicitly outside certified V1 under Version Classification and ADR-0009. An older document calling its blueprint “official production-integration” is status-limited by that later classification and by its own `architecture only; ... pending` qualifier. |
| Provider/context/session prototypes | `src/orion/contracts.py`, `executor.py`, `context_*`, `document_selector.py`, `ollama_backend.py`, `transformation_engine.py`, `operator_registry.py`, LYRA modules | `IMPLEMENTED_NOT_CERTIFIED`; experimental or historical | Retained for compatibility/reproducibility, not a supported Version-1 public interface. Only a local Ollama adapter exists; tests mock its transport unless the opt-in integration test is run. |
| NEXAH/OLS/Kernel authority | NEXAH repository; OLS Release 1.0.0; ORION `workspace.yaml` pins historical NEXAH commit `9f79bb06…` read-only | external authority; no live certified integration | NEXAH/OLS owns semantics/contracts; Kernel owns released deterministic contract execution. ORION source contains no `nexah` import or Kernel invocation. ADR-0001 specifies the intended port boundary, not an implemented adapter. |
| Science Lab | Science Lab governance, Run Contract, closed reports and registries | `EXTERNAL_RESEARCH` | Owns questions, protocols, ground truth, baselines, metrics, interpretation and scientific conclusions. Research PASS is not ORION adoption. |
| NEXAHEDRON | `docs/upstream/orion-v1/SOURCE.yaml` pin `d34fbb2…` plus fingerprint `6201362…` | implemented consumer seam; bounded Alpha; dependency fail-closed | Owns Human interaction, confirmation, presentation and local session state, never ORION semantics/certification. D-024 preserves the exact pin and forbids silent repinning to Review HEAD. |
| Evidence Atlas / Library | NEXAH `docs/evidence/README.md` and `LIBRARY/` | navigation/editorial authority only | Evidence Atlas does not validate claims. Library retains Work/Edition/source/editorial identity and provenance; no production Library-to-ORION evidence adapter exists. |
| Portfolio | Mission Control D-022, D-023, D-024 | controlling | ORION Research Session: candidate, not activated, no Application ID. Runtime: hold/not adopted. Certified NEXAHEDRON pin retained. |

Frozen boundary evidence: `docs/releases/ORION_V1_CERTIFIED_BASELINE.md`, `docs/releases/ORION_V1_RELEASE_NOTES.md`, `docs/releases/ORION_V1_VERSION_CLASSIFICATION.md`, `docs/releases/ORION_V1_READING_ORDER.md`, `docs/adr/0009-orion-master-architecture-adoption.md`. Historical ADR-0001 and ADR-0008 remain useful purpose/provenance records but do not broaden certified V1.

## 3. Capability matrix

| Capability | Implementation / entry point | Classification | Test/evidence observed | Limitation |
|---|---|---|---|---|
| Confirmed source acceptance | `representation_alpha.confirmed_source_from_mapping`; frozen Markdown fixtures | `IMPLEMENTED_AND_TESTED` + certified | Slice-II proofs/tests; exact V1 proof chain | Accepts already-confirmed bounded material; not question/corpus discovery. |
| Immutable Structural Representation | `representation_alpha`, Markdown structural renderer/profile | `IMPLEMENTED_AND_TESTED` + certified | representation/conformance tests and certified Slice II | Markdown structural profile only; structure is not semantic truth. |
| UNDERSTAND inventories | `understand_*_alpha.py` | `IMPLEMENTED_AND_TESTED` + certified | inventory, declaration, summary and statistics proofs/tests | Inventories already-declared structure; does not infer scientific claims. |
| Structural Summary / Statistics | `understand_structural_summary_alpha.py`, `understand_structural_statistics_alpha.py` | `IMPLEMENTED_AND_TESTED` + certified | focused proofs and certification chain | Structural counts/summary only. |
| Relations | relation object, sequential, equality and declared-cross-reference modules | `IMPLEMENTED_AND_TESTED` + certified | relation conformance/certification proofs | Certified only for structural and declared relations; not entailment, causality or general semantic relation extraction. |
| Navigation | navigation object/construction/conformance/certification modules | `IMPLEMENTED_AND_TESTED` + certified | Slice-III proof chain | Structural navigation, not Human or research navigation. |
| Orientation Map | map object/construction/conformance modules | `IMPLEMENTED_AND_TESTED` + certified | Slice-III certification | Structural map; no semantic claim/evidence map. |
| Expression | expression contract/construction/conformance/certification modules | `IMPLEMENTED_AND_TESTED` + certified | Slice-IV proof chain | Declared communicative scope only; no language model generation or semantic interpretation. |
| Provenance, identity, integrity | immutable artifact IDs, SHA-256, predecessor references, canonical serialization | `IMPLEMENTED_AND_TESTED` + certified for the structural chain | exact-tag proof verified source hashes, predecessor refs and unchanged inputs | Does not establish source truth or scientific support. |
| Replay | canonical JSON bytes and certification proofs | `IMPLEMENTED_AND_TESTED` + certified for the structural chain | exact `d34fbb2…` WP30 proof replay was byte-identical on 2026-08-21 | Does not replay an LLM session, external retrieval or scientific judgment. |
| Conformance | external conformance stages for Representation, Relations, Navigation, Map and Expression | `IMPLEMENTED_AND_TESTED` + certified | certified tests/proofs | Scope-specific schemas are Python object contracts; `schemas/` has no adopted transport encoding. |
| STOP | per-slice constants; final `at_slice_iv_certified` | `IMPLEMENTED_AND_TESTED` + certified | WP30 proof confirms every downstream execution flag false | It is a software responsibility STOP, not the Human's meaning/decision STOP. |
| Provider-neutral request/context/result boundary | `contracts.py`, `backend.py`, `executor.py`, `validation.py` | `IMPLEMENTED_NOT_CERTIFIED` | execution tests pass; deterministic FakeBackend and rejection of unknown evidence refs | Historical/experimental; validates reference membership, not whether text supports a claim. |
| Source-aware repository context | `context_builder.py`, `document_selector.py`, context brief/execution modules | `IMPLEMENTED_NOT_CERTIFIED` | dedicated unit tests exist | Repository-file selection, not general corpus parsing, retrieval, rights or source authority resolution. |
| Claims with evidence references | `ReasoningClaim`, `ReasoningResult`, `OrientationResponse` | `IMPLEMENTED_NOT_CERTIFIED` | execution and Ollama tests passed on Review HEAD | Requires at least one claim/ref and known IDs; lacks entailment, contradiction, unsupported-claim class and calibrated uncertainty. |
| AI adapter | `ollama_backend.OllamaBackend` | `IMPLEMENTED_NOT_CERTIFIED` | seven focused Ollama unit/configuration tests passed with mocked local HTTP | Ollama-only; no certified live model evidence, and no ChatGPT, Claude or Gemini adapter found. |
| Transformation planning/execution | `transformation_engine.py`, transition contracts and Operator Registry | `IMPLEMENTED_NOT_CERTIFIED` / historical | transformation and registry tests exist | T01–T15/Registry expressly outside certified V1 and not an adopted Extension Profile. |
| LYRA translation/explanation | `src/orion/lyra/`, `lyra_execution.py` | `IMPLEMENTED_NOT_CERTIFIED` / historical, inactive | Phase-6C session tests pass | ADR-0009 keeps LYRA inactive; it owns no reasoning, evidence or decision authority. |
| Public Contract/Gateway/Understand Runtime | `public_contracts`, `gateway.OrientationGateway.handle`, `orientation_runtime.OrientationRuntime` | `IMPLEMENTED_NOT_CERTIFIED` / historical or separately governed | public contract, gateway, runtime and Phase-VII tests exist | Later classification excludes them; Review HEAD's Phase-VII test currently fails because `README.md` no longer matches the frozen corpus revision. |
| Runtime 1.1 service | `python -m orion_runtime`; `src/orion_runtime/*` | `PARTIAL`; implemented candidate, not certified/adopted | non-HTTP worker, canonical, timeout, manifest and isolation tests pass; current full run: 554 tests, 3 failures, 5 errors, 11 skips | Three release/readiness failures are real; four HTTP errors are sandbox socket-denial, not acceptance evidence; target-Linux and immutable deployment remain absent. |
| NEXAHEDRON transport/presentation | request mapping, Python transport adapter, public outcome mapper | `IMPLEMENTED_NOT_CERTIFIED` | consumer tests document blocked/complete/clarification outcomes | Requires exact separate `d34fbb2…` checkout; no Library evidence adapter; clarification lineage cannot complete through frozen Gateway. |
| Complete research-orientation session | none | `ABSENT` as an adopted ORION capability | candidate/audit/blueprint documents only | No adopted Question/Corpus → semantic Claims/Relations/Uncertainty → Human report → full-session replay chain. |

## 4. Existing integration map

```text
NEXAH Framework / OLS                 Science Lab
semantic + contract authority         question · protocol · ground truth · metrics
           | specified references                  |
           | no implemented adapter                | external evidence only
           v                                       v
      ORION Certified V1 Core  <---- adoption gate (not crossed)
 confirmed Markdown → structural chain → certified Expression → STOP
           |
           | older/separate executable surfaces, not certified
           v
 context/claim prototypes · Ollama · Public Contracts/Gateway · Runtime candidates
           |
           | exact pinned consumer boundary, fail closed
           v
      NEXAHEDRON
 Human draft → Rest → explicit confirmation → optional submit → inspect outcome
           |
           v
 Human meaning · continuation · decision · STOP

Kernel: specified below ORION by ADR-0001, but no live ORION→Kernel invocation exists.
Library/Evidence Atlas: external source/editorial and navigation authorities; no production evidence adapter exists.
```

| Link | Existing binding | Reality classification | Exact gap |
|---|---|---|---|
| NEXAH/OLS → ORION | `workspace.yaml` read-only NEXAH pin; architecture and ownership references | specified dependency/authority, no current operational binding | No adopted machine-readable OLS carrier/Interface-V1 producer-consumer pair; no conformance result consumed by NEXAH. |
| ORION → Kernel | ADR-0001 says ORION operates above Kernel through published contracts/ports | architecture boundary only | No import, command adapter, invocation test or current result-to-Kernel path. The certified core is self-contained. |
| Science Lab → ORION | O8/B1, translation/invariance/coupling reports and interface maps | external research evidence | Research-to-Architecture gate and Owner adoption have not converted any result into an ORION extension. |
| ORION → NEXAHEDRON | exact source manifest; request mapping; real in-process Gateway tests; external transport path | executable consumer seam for historical/separate public boundary | Exact checkout required; production evidence source absent; clarification lineage blocked; Runtime 1.1 not adopted. |
| Library → ORION/NEXAHEDRON | `EvidenceReference` contract and test fixture | schema and test only | No source-authoritative Library adapter; Alpha sends empty evidence and therefore receives a truthful blocked report. |
| Evidence Atlas → ORION | public navigation links to ORION evidence | information/navigation only | No runtime consumption and no authority transfer. |

## 5. Software ideas and candidate map

| Item | What exists | Current treatment; no promotion |
|---|---|---|
| Interface V1 / membrane | approved architecture/status record | `SPECIFIED_ONLY` as `MEMBRANE_V1_APPROVED_NOT_IMPLEMENTED`; no schema, producer, consumer or conformance result. |
| Runtime 1.1 | HTTP service, worker, gateway checks, manifest, isolation code, deployment files, tests and audits | Reviewable candidate under D-023 hold; not adopted or publicly claimable. |
| Earlier Public Contract + Gateway + Understand Runtime | executable Python models, validators, gateway/runtime and corpus evaluation | Historical/separately governed; useful adaptation evidence, not certified V1. |
| Context/Claim reasoning slice | immutable context manifest, claim references, validation, deterministic executor and FakeBackend | Experimental/historical; candidate substrate for bounded research sessions. |
| Ollama | local provider adapter and tests | Experimental; no equivalent adapters for ChatGPT, Claude or Gemini found. |
| TransformationEngine / T01–T15 / Operator Registry | draft graph/contract/registry and executable planning engine | Historical; no adopted Extension Profile and no equivalence to O8 or Open-Fracture operators. |
| LYRA | executable translation/explanation prototypes and session fixtures | Inactive and outside certified V1. |
| NEXAH ecosystem integration blueprint | detailed request/evidence/report sequence and conceptual API | Architecture only; later ADR-0009/Version Classification prevents capability inference. |
| ORION Research Session v0.1 | descriptive product candidate | `NOT_ACTIVATED · NO_APPLICATION_ID · REQUIRES_EVIDENCE`; D-022. |
| O8/B1 and translation/coupling families | preregistrations, implementations, reports, replays and negative/ceiling results in Science Lab | External Research; not ORION software/product capability. |
| IRIS / SIRIUS / LUCY | concepts or unresolved names | IRIS/SIRIUS unresolved; LUCY research only; none is a current runtime component. |
| General AI/corpus/RAG integration | prose, candidate diagrams and desired flows | No adopted or complete implementation. |

## 6. Open-Fracture equivalence map

| Package requirement | Existing ORION/ecosystem asset | Classification | Finding |
|---|---|---|---|
| “Similarity is not identity”; coupling is not identity | Science-Lab Translation Fidelity, operator-invariance and Hidden-Binder/non-identity work | `DUPLICATE_OR_RENAMED` | Existing method/claim boundary in a new visual vocabulary. |
| Typed translation/operator ledger | ORION TransformationEngine/Registry plus Science-Lab translation contracts | `DUPLICATE_OR_RENAMED` | Existing methods recombined; package provides no machine-readable contract or code delta. |
| Correct versus permuted coupling | Existing O8/translation/coupling controls | `NOT_AN_ORION_RESPONSIBILITY` | Scientific fixture, ground truth and comparison belong to Desk 05; exact package fixture/code/data are missing. |
| Preserve invariant and declared loss | Certified structural immutability/lossiness plus external translation studies | `PARTIAL` | Structural preservation is certified; cross-representation scientific invariance is external research, not a general ORION operator. |
| “Open Fracture” / residual ledger | negative-result, loss, unknown and STOP disciplines | `DUPLICATE_OR_RENAMED` | Useful label, but no adopted ORION object, detector, validator or measured result exists. |
| Question and bounded corpus | historical `OrientationRequest`, repository context builder/selector; candidate research-session prose | `IMPLEMENTED_NOT_CERTIFIED` | Bounded repository context exists; general immutable multi-document corpus ingest and authority resolution do not. |
| Source/claim separation | `ContextEntry`/`ProvenanceRef` versus `ReasoningClaim` | `IMPLEMENTED_NOT_CERTIFIED` | Real typed separation and unit tests exist, but it is outside certified V1 and tests references rather than semantic support. |
| Claim support / unsupported claim detection | evidence-ref membership validation | `PARTIAL` | Unknown or empty references are rejected; entailment, contradiction, support class and unsupported-but-fluent claims are not evaluated. |
| Semantic relations with provenance | certified structural/declared relations plus historical claim references | `PARTIAL` | No adopted semantic claim-relation extraction or per-relation support validator. |
| Uncertainty | scattered unknown/clarification/status fields | `ABSENT` as a general claim-level capability | No adopted uncertainty model, calibration, aggregation or conformance contract. |
| Structural Orientation Map | certified map modules | `IMPLEMENTED_AND_TESTED` | Only the structural map is certified; calling it a semantic research map would exceed evidence. |
| Semantic open-fracture orientation map | package diagrams and desired output | `PROPOSED_ONLY` | No executable binding to certified map contracts. |
| Replay and provenance | certified canonical proof chain | `IMPLEMENTED_AND_TESTED` | Covers certified deterministic structural execution, not retrieval/model/session replay. |
| Provider-backed claims | Ollama adapter | `IMPLEMENTED_NOT_CERTIFIED` | Unit-tested local adapter only; no certified provider behavior or model-independent conformance suite. |
| Human-inspectable result | NEXAHEDRON public-outcome views and historical ORION reports | `PARTIAL` | Presentation exists, but no current complete Research Session result and no production evidence adapter. |
| Human decision / STOP | NEXAHEDRON confirmation/Rest and governance; ORION certified STOP | `NOT_AN_ORION_RESPONSIBILITY` for meaning/decision; `IMPLEMENTED_AND_TESTED` for technical STOP | Human authority must remain outside ORION. |
| Benchmark A/B, H1/H2 and scientific conclusion | APP-01-H1/Science-Lab protocols | `NOT_AN_ORION_RESPONSIBILITY` | Desk 05 owns hypotheses, baselines, scores and interpretation; APP-01-H1 currently forbids ORION integration. |
| Claimed RMSE `0.008` vs `0.211` | no source code/data/result manifest found | `ABSENT` | Not evidence and not an ORION delta. |

No package component establishes a new certified capability, adopted extension, material implementation delta or material evidence delta.

## 7. Smallest existing end-to-end paths

### A. Smallest authoritative executable path

```text
frozen confirmed Markdown fixture
→ Structural Representation
→ UNDERSTAND inventory / summary / statistics
→ certified structural + declared Relations
→ Structural Navigation
→ Structural Orientation Map
→ Expression Contract / Construction / External Conformance
→ Slice-IV Certification
→ byte-identical canonical proof JSON
→ STOP at_slice_iv_certified
```

Entry point: `PYTHONPATH=src python3 scripts/slice_iv_certification_proof.py` from an exact `d34fbb2…` checkout. On 2026-08-21 this returned `successful: true`, verified the frozen WP26–WP29 source hashes, preserved provenance/input bytes and reproduced the certification byte-identically. It deliberately records Runtime, Gateway, applications, presentation, language generation and semantic interpretation as `false`.

### B. Smallest broader but non-certified claim path

```text
OrientationRequest + ContextEntry[]
→ immutable ContextManifest
→ FakeBackend or local Ollama ReasoningBackend
→ ReasoningResult with Claim[] + evidence-ref IDs
→ independent reference/identity validation
→ OrientationResponse with provenance or fail-closed rejected output
```

Entry point: `OrientationExecutor.execute`. Focused execution and Ollama unit tests pass, but this is historical/experimental, has no certified-Core bridge, does not validate entailment, and is not an adopted public interface.

### C. Smallest Human-facing consumer path

NEXAHEDRON can map Human-confirmed state to the older `OrientationRequest 1.0`, call the older Gateway/Understand Runtime boundary, and render a blocked report with no evidence or a complete report with a constructed valid test Evidence Reference. This path is executable only against the exact pinned checkout, is not certified as a whole, has no production Library adapter, and the clarification-resubmission route ends correctly at `validation_failed / runtime_outcome_invalid`. The Review HEAD was offered to the dependency verifier on 2026-08-21 and was rejected because `c62a8c… != d34fbb2…`; that fail-closed result confirms D-024.

## 8. True technical gaps for a Research Orientation Session vertical slice

The Certified Core does not need to be modified. The smallest complete semantic session still lacks these adopted and jointly verified elements:

1. **One bounded input contract and corpus manifest** that fixes question, included documents/fragments, source identity/revision/integrity, access/privacy limits and explicit omissions. Existing context objects are useful code evidence but not an adopted cross-repository contract.
2. **One semantic object contract** separating source fragments, claims, explicit inferences, relations, contradiction/support classes, uncertainty and unresolved residuals. No existing certified structural object may be silently reinterpreted to fill this gap.
3. **A provider-neutral extraction/normalization adapter with fail-closed validation.** Ollama proves one replaceable adapter pattern; it does not provide provider conformance, deterministic model behavior or semantic correctness.
4. **Support and relation verification beyond reference membership:** claim-to-fragment entailment/support, unsupported claims, contradictions, provenance per relation and explicit unknown/uncertain outcomes require executable rules and tests.
5. **An adopted bridge into or alongside the certified structural path.** Interface V1 is approved but unimplemented; no extension profile is adopted. The bridge must consume public contracts without modifying certified V1 or claiming that semantic objects are certified structural relations.
6. **A complete session replay manifest** covering exact corpus, question, contracts, adapter/model identity, prompts/settings where applicable, ordered intermediate objects, validation results, output digests, errors and STOP. Certified replay covers only the structural subchain.
7. **A current Human-inspectable report binding** that displays sources, claims, inference, relations, uncertainty/residuals and provenance without upgrading status. NEXAHEDRON supplies reusable confirmation/presentation patterns, but the research-session outcome contract and production evidence source are missing.
8. **End-to-end negative and boundary tests** for unsupported claims, false relations, omitted source, ambiguity, tampering, model/provider failure, missing evidence, replay divergence and forbidden authority transition.
9. **One accepted execution boundary.** Local in-process prototypes and Runtime 1.1 candidate code exist, but no adopted delivery path currently binds the semantic session; Runtime 1.1 cannot be used as an adopted dependency while D-023 gates remain red.

Not technical ORION gaps: the research question, ground truth, baseline choice, metric thresholds, scorer/reviewer design, privacy/consent, interpretation and usefulness decision. Those are Desk-05/Human gates. APP-01-H1 cannot be used to authorize the missing ORION work because D-025 expressly excludes ORION integration and implementation.

## 9. Desk-04 / Desk-05 interface contract

| Stage | Desk 05 — Science Lab | Desk 04 — ORION Verification | Boundary result |
|---|---|---|---|
| Freeze | Owns question, corpus authority, ground truth, baselines, hypotheses, metrics, thresholds, failure classes and scientific STOP | Verifies that supplied identities, hashes, schemas and requested operations are executable without authority expansion | No execution until both the frozen protocol and exact technical input contract are present. |
| Execute | Supplies only frozen inputs and permitted run mode; changes require a new protocol decision | Produces typed execution, adapter records, ordered logs/artifacts, provenance, conformance results, errors and technical STOP | No hidden normalization, source repair, semantic adoption or Kernel mutation. |
| Replay | Defines what constitutes scientific replay/replication and tolerance | Replays exact software path and reports byte/hash/tolerance divergence | Software replay PASS is not scientific PASS. |
| Evaluate | Owns scoring, adjudication, uncertainty interpretation, utility and scientific conclusion | Reports only observed technical outputs and validation classes | Desk 04 does not select favorable cases or interpret scientific meaning. |
| Return | Returns accepted/negative/limited result through Research-to-Architecture gate | Returns capability/conformance map and exact residual defect | Neither desk activates product, Application ID, Runtime or portfolio work. |

Mandatory inputs from Desk 05: `QUESTION`, immutable `CORPUS`, `GROUND_TRUTH`, `BASELINES`, `METRICS`, failure/STOP rules, privacy/access status and reviewer/scorer authority. Mandatory outputs from Desk 04: exact version/revision, typed inputs/outputs, adapter/model identity, ordered execution log, provenance manifest, conformance report, errors, replay record and technical STOP. Desk 05 alone evaluates the result; Thomas/The EYE alone may later adopt or prioritize it.

## 10. Recommendation

| Disposition | Recommendation | Trigger/boundary |
|---|---|---|
| `REUSE_EXISTING_PATH` | Yes: reuse the exact certified structural chain, provenance, conformance, replay and STOP unchanged. | Only exact `v1.0.0`/`d34fbb2…` identity or an independently authorized later release. |
| `ADAPT_EXISTING_PATH` | Yes, prospectively: the historical Context/Claim/Ollama/Public-Contract work and NEXAHEDRON confirmation/presentation seam are concrete reuse candidates. | Only after an owner-authorized semantic contract/interface scope; adaptation remains outside certified V1 unless separately adopted and certified. |
| `TRUE_VERTICAL_SLICE_GAP` | Yes: the semantic corpus/claim/inference/relation/uncertainty/residual contract and its complete replayable Human session binding are absent. | A bounded contract-first decision may close the gap without redesigning the certified Core. |
| `HOLD_MISSING_EVIDENCE` | Yes for Runtime 1.1 and any package quantitative claim. | Runtime: all D-023 gates plus adoption. Package: exact code/data/ground truth/results and non-overlap evidence. |
| `PARK_NO_USEFUL_DELTA` | Yes for “Open Fracture” as a separate ORION capability or research line. | Reopen only on a machine-readable non-equivalent contract, material method delta or reproducible evidence delta. |

Strategic implication: ORION already supplies a strong deterministic structural substrate and several non-certified prototypes unusually close to a source-aware research tool, but the product-defining semantic contract and verified complete session are still real gaps. The smallest defensible product is therefore not “ORION as autonomous research authority”; it is a bounded, Human-controlled, source/claim-separated inspection session whose certified structural subchain remains visibly narrower than its experimental semantic layer.

## 11. Single return handoff

```yaml
handoff_id: ORION-REALITY-MAP-RETURN-2026-08-21
from: 04 ORION Verification & Integration Engineer
to: 05 Science Lab Research Director
purpose: BOUND_THE_FROZEN_PROTOCOL_AGAINST_VERIFIED_ORION_REALITY
input:
  - this capability and integration map
  - Incoming Intake Report for ORION LAB Open Fracture V0.1
allowed_use:
  - separate Desk-05 scientific requirements from existing ORION capability
  - deduplicate Open-Fracture terminology against existing translation/coupling work
  - identify exact protocol clauses reusable inside already authorized APP-01-H1 scope
  - return one frozen question/corpus/baseline/metric/STOP package if a later ORION review is authorized
not_allowed:
  - activate ORION Research Session
  - add ORION or LLM integration to APP-01-H1
  - run a benchmark
  - modify Certified Core, Runtime, pins, OLS, NEXAHEDRON or canonical Science-Lab records
  - treat this report or a Lab PASS as product adoption
closure_condition: Desk 05 records which requirements are scientific inputs, which Open-Fracture clauses are duplicates, and which exact missing evidence prevents a runnable semantic session
strategic_pointer_to_the_eye: Decide GO only after Reader-H1 return or explicit reprioritization, an adopted bounded semantic contract, and a Desk-04 executable gap proof; keep Runtime on D-023 hold and park the intake package as an independent ORION line until material delta exists.
ticket_effect: NONE
activation_effect: NONE
```

## Verification record and STOP

Read-only verification performed on 2026-08-21:

- Tag `v1.0.0` resolves through annotated tag object `983d0857…` to exact commit `d34fbb2…`.
- An archive of exact commit `d34fbb2…` executed `scripts/slice_iv_certification_proof.py`: `successful=true`, frozen WP26–WP29 hashes matched, provenance was preserved, replay bytes matched and STOP was `at_slice_iv_certified`.
- Focused Review-HEAD tests for Slice-IV certification, execution, Ollama and historical Orientation Sessions passed (26 tests); Runtime-focused additions produced the already documented release/readiness failures.
- Full Review-HEAD suite result: 554 tests, 3 failures, 5 errors, 11 skips. Three failures are release-identity/readiness blockers; one error is a stale Phase-VII corpus hash (`README.md`); four HTTP errors arose because this sandbox prohibits loopback socket binding and therefore are not acceptance evidence.
- NEXAHEDRON dependency verification against current ORION Review HEAD stopped on the exact expected mismatch: expected `d34fbb2…`, observed `c62a8c…`.
- ORION worktree remained clean after all checks; no Frozen release, ADR, pin, manifest, code or test artifact was changed.

STOP is required now: the certified revision is unambiguous; the apparent broader capability is status-separated by controlling records; the Open-Fracture delta is unsupported; and closing the semantic-session gaps would require new authorization and implementation outside this read-only audit.

```text
PRIMARY_FINDING = CERTIFIED_STRUCTURAL_CORE_PLUS_NONCERTIFIED_REUSABLE_PROTOTYPES
ORION_RESEARCH_SESSION = TRUE_VERTICAL_SLICE_GAP · NOT_ACTIVATED
OPEN_FRACTURE = PARK_NO_USEFUL_DELTA · MERGE_PROTOCOL_FRAGMENTS_ONLY
RETURN = 05 Science Lab Research Director
STRATEGIC_POINTER = THE EYE
STOP = YES
```
