# NEXAH Master Navigator — Build Plan v2

Date: `2026-10-06`

Status:
`WP3 INTERNAL PILOT ACTIVE / PUBLIC PROFILE FAIL-CLOSED / NO PUBLICATION AUTHORIZED`

Supersedes the implementation sequence, but not the inventory findings, of
[`NEXAH_MASTER_NAVIGATOR_ARCHITECTURE_BLUEPRINT_2026-10-05.md`](NEXAH_MASTER_NAVIGATOR_ARCHITECTURE_BLUEPRINT_2026-10-05.md).

## 1. Product decision

Build one reusable, read-only Navigator core with two explicitly different
projections:

```text
                         NEXAH NAVIGATOR CORE
                  schema · UI · routing · explanation
                         /                    \
             INTERNAL PROFILE             PUBLIC PROFILE
             Mission Control              curated release
             full local locators          stable public URLs
             operational context          released records only
             private/current detail       reader-oriented explanation
```

The internal Mission Control Navigator is not itself the publication target.
The public Navigator must be generated from an allowlisted public manifest and
must remain useful without access to the private filesystem or Mission Control.

The Navigator is an orientation instrument. It does not become a scientific
authority, runtime platform, universal ontology, publication decision or
automatic promotion mechanism.

## 2. Product promise

A reader should be able to move from one object to another while seeing:

1. what the object is;
2. which module and family own it;
3. which surface is being shown;
4. why a connection exists;
5. what kind of connection it is;
6. what evidence supports it;
7. what the evidence does not establish;
8. where the controlling source lives;
9. what remains open, lost, residual or provisional.

The distinctive product promise is therefore not “show many files in a
graph”. It is:

> make multiple bounded views traversable without collapsing them into one
> identity, mechanism or truth claim.

## 3. Audiences and entrances

### Internal profile

Primary users: Human Owner, Mission Control, Science and Builder review.

Entrances:

- currentness and active-priority state;
- repository, source ID and custody path;
- complete module, artifact and evidence registers;
- provisional, incoming, frozen and private records;
- validation, hash and broken-link diagnostics.

### Public profile

Primary users: interested readers, collaborators, researchers, designers and
reviewers without repository knowledge.

Entrances:

- What is NEXAH?
- Explore one pattern through several views.
- Open an instrument.
- Follow a connection.
- Inspect what is supported, open or rejected.
- Read the original public source.

Internal IDs remain visible as secondary provenance. Human-readable names and
questions lead the public interface.

## 4. Ecosystem ownership

| Layer | Recommended owner | Responsibility |
|---|---|---|
| Navigator schema and reusable UI core | NEXAH Core | stable entity, relation and public-rendering contracts |
| Module, artifact and evidence source data | Science Lab | native records, verdict history, claim ceilings and validation |
| Internal currentness projection | Mission Control | full local catalog, activation state and operational truth |
| Public editorial selection | NEXAH Experience | reader path, language, release selection and publication context |
| Public interactive deployment | NEXAHEDRON or `nexah.de` | hosted experience after an explicit release decision |

Repository ownership must not be simulated by copying authority. The build
pipeline reads the owning records and emits a bounded projection with source
IDs and release receipts.

The exact public host is a gate before public pilot deployment, not a blocker
for schema, exporter or local UI work.

## 5. Data architecture

### 5.1 Canonical entity layers

```text
FAMILY        relation vocabulary and navigation question
MODULE        stable conceptual or executable family
SURFACE       HTML, view, panel or interface belonging to a module
MEDIA         image, 3D object, dataset or downloadable package
EVIDENCE      study, test, control, result or successor study
RECORD        controlling scientific, implementation or governance source
RELATION      typed edge with explanation and claim boundary
RELEASE       public selection, rights state, URLs and build receipt
```

Module Registry v2, the 111-row HTML Artifact Registry and the Polar-Janus
evidence slice are input adapters, not the final public schema.

### 5.2 Required relation contract

Every visible edge must contain:

```text
relation_id
source_id
target_id
relation_type
explanation
evidence_record_ids[]
preserves[]
does_not_imply[]
claim_boundary
confidence_or_status
```

Initial relation types:

```text
exact-copy
version-successor
shared-source
contains-view
represents
method-grammar
tested-transform
empirical-support
negative-control
historical-predecessor
application-analogy
open-candidate
non-identity
```

Visual similarity alone may be registered only as `open-candidate` or
`application-analogy`; it cannot silently become `tested-transform` or
`empirical-support`.

### 5.3 Dual manifest output

The exporter produces two independent artifacts:

```text
dist/internal/navigator.internal.json
dist/public/navigator.public.json
```

The internal manifest may contain local paths and unresolved records. The
public manifest must contain only:

- stable public IDs and relative or HTTPS URLs;
- explicitly allowlisted modules and surfaces;
- publishable source summaries;
- public claim ceilings and evidence status;
- rights and attribution metadata;
- a dated release and validation receipt.

The public exporter fails closed when a referenced item has no release state,
rights state, public URL, claim ceiling or controlling record.

## 6. Publication boundary

Public admission is deny-by-default. An item enters a public build only when
all required fields pass:

```text
public_release = true
release_owner
public_title
public_summary
public_url_or_bundled_asset
rights_status
attribution
claim_ceiling
controlling_record
relation_explanations_complete
no_private_dependency
```

Automated checks must reject:

- absolute filesystem paths;
- Mission Control private locators;
- unapproved incoming or custody material;
- missing or local-only dependencies;
- embedded secrets or personal contact data;
- iframe sources outside the release allowlist;
- a historical PASS without current interpretation;
- an untyped or unexplained relation;
- a provisional artifact presented as canonical.

## 7. Interface architecture

### 7.1 Public navigation model

The primary interface is a guided relation path, not a force-directed graph.

```text
START OBJECT
  → related object
  → relation type
  → why the edge exists
  → what is preserved
  → what is not implied
  → evidence and source
```

A graph or spatial atlas may be offered as a secondary overview. It must not
be the only way to navigate.

### 7.2 Required public views

1. **Orientation home** — concise purpose, current public release and three
   reader entrances.
2. **Connection paths** — curated sequences such as Q7 → Q11 → Tessarec or
   Carrier → Cut → Trace → Return.
3. **Family overview** — named Connection Families with questions, not bare
   `F1` labels.
4. **Module detail** — summary, current public surface, related views,
   relations, evidence and claim ceiling.
5. **Instrument view** — safe preview or direct opening of a released HTML.
6. **Evidence view** — package-local verdict beside current interpretation,
   including negative and no-result states.
7. **Source view** — public provenance, record and release receipt.
8. **Catalog view** — searchable released subset; archive and internal items
   are not implied by absence.

### 7.3 Internal additions

The internal profile adds:

- Mission Control truth and currentness;
- repository/path/hash inspection;
- complete 111-row HTML inventory;
- validation failures and broken locators;
- private, frozen, provisional and incoming filters;
- public-admission readiness and export diagnostics.

## 8. Technology and portability

V1 remains a static web application:

- semantic HTML, CSS and browser JavaScript;
- generated JSON manifests;
- no mandatory server, database, framework or account;
- relative asset paths in release bundles;
- optional local development server for safe previews;
- deployable to GitHub Pages, static hosting, NEXAHEDRON or `nexah.de`;
- content-security policy and sandboxed instrument previews;
- responsive layout and keyboard navigation;
- reduced-motion support and adequate contrast;
- deep links that survive page reload and browser history.

Framework adoption is permitted only if the static exported bundle remains
portable and the dependency cost is justified by accessibility, routing or
maintainability.

## 9. Work packages and gates

### WP0 — Planning and boundary lock

Status: `DONE / OWNER DIRECTION RECORDED / NO BUILD ACTIVATION`

- accept this two-profile architecture;
- confirm canonical source-code repository;
- retain Mission Control as authority, not public content source;
- record public-host decision as a later gate;
- freeze the first public-pilot scope before implementation.

Exit gate: architecture, ownership and non-goals accepted.

### WP1 — Navigator schema v1

Status: `DRAFT 2020-12 VALIDATION PASS / FIVE-SCHEMA FAMILY COMPLETE / TECHNICAL FREEZE READY`

- define JSON Schemas for entity, relation, internal manifest, public manifest
  and release receipt;
- map existing `CF`, `HL`, `MOD`, `ART`, Evidence and Record fields;
- define stable slugs and versioning rules;
- provide small valid and invalid fixtures.

Review receipt:
[`NAVIGATOR_CONTRACT_REVIEW_V1_2026-10-06.md`](CONTRACTS/NAVIGATOR_CONTRACT_REVIEW_V1_2026-10-06.md).
The dependency-free integrity runner passes both the valid fixture and the
required rejection signals. Strict Draft 2020-12 compilation, formats, local
`$ref` resolution, the internal fixture and public fixtures also pass. Entity,
Relation, Internal Manifest, Public Manifest and Release Receipt now form the
complete v1 schema family.

Exit gate: schema validation passes; no bare `F` identifiers or untyped edges.

### WP2 — Source adapters and exporter

Status: `THREE-REGISTRY INTERNAL ADAPTER PASS / PUBLIC FAIL-CLOSED / ALLOWLIST OPEN`

- ingest Module Registry v2;
- ingest all 111 HTML Artifact records;
- ingest the Polar-Janus slice and later evidence slices;
- bind Mission Control sources only in the internal adapter;
- emit deterministic internal and public manifests;
- produce a rejected-public-items report.

The fixture pilot emits canonical Internal/Public manifests plus a rejected
items report. The first real-source adapter now joins Module Registry v2, HTML
Artifact Registry v1 and the Polar-Janus evidence slice into 140 deduplicated
Internal entities and 14 typed relations. Two isolated runs are byte-identical
and strict Draft 2020-12 validation passes. With no Human Owner allowlist, the
Public manifest remains empty and all 140 entities are rejected as
`NO_PUBLIC_ALLOWLIST`; publication authority remains false.

Exit gate: repeated builds are byte-identical and the public bundle contains
no absolute path or non-allowlisted object.

### WP3 — Shared Navigator UI core

Status: `INTERNAL READ-ONLY PILOT IMPLEMENTED / 34-CHECK APP AUDIT PASS / WP6 PREFLIGHT 5_OF_5`

- implement route state, search, filters and accessible detail panels;
- implement relation explanations and claim-boundary display;
- implement public and internal themes/configuration without branching the
  data model;
- preserve direct links and browser back/forward behavior.

Exit gate: all core views operate on fixture manifests with keyboard-only use.

The first functional shell is available at
[`APP/index.html`](APP/index.html). It uses the approved dark Instrument Mode
and the same validated entity/relation contract intended for both profiles.
The internal build packages the 140-entity, 14-relation manifest for direct
`file://` use and implements stable hash routes, full-text search, type and
family filters, module/surface/evidence detail, typed relation explanations,
claim ceilings, package-local verdict/current-interpretation pairs and source
receipts. Its current dependency-free app audit passes 39 checks. No public entity
catalog is wired into this pilot; only the fail-closed release state is shown.

The first utility preflight prompted a bounded UI refinement: role filters,
relation-detail deep links, guided F2/Q7→Q11/Solar paths, declared master
surfaces and a fail-closed Admission view are now explicit. The expanded app
audit passed 24 checks at that checkpoint. The frozen five-task answerability runner passes 5/5
(`10/10`) and is retained in
[`APP/WP6_INTERNAL_PREFLIGHT_V1_2026-10-06.md`](APP/WP6_INTERNAL_PREFLIGHT_V1_2026-10-06.md).
This is a machine-readable preflight, not a human utility result.

The first Human Owner walkthrough identified one concrete access-depth defect:
the 111 HTMLs were registered but module pages made users inspect a Surface
before opening its instrument. The repaired shell is now instrument-first:
each module exposes its declared master HTML as the primary action, every
registered module Surface has separate `Open HTML` and `Inspect` actions, and
Surface pages distinguish the HTML instrument from its controlling record.

The next Owner observation found that `Browse the system` still entered a
precision list instead of a visual overview. The repaired entrance now opens a
clickable seven-family atlas: F1–F7 remain named, modules are visible as
clickable nodes, declared master instruments can be launched directly and the
full Family Connection Map remains the richer spatial instrument. The Catalog
is retained as a separate search layer.

The third Owner observation identified a deeper missing grammar: F1–F7 are not
only parallel labels but can be read as a bounded directed sequence. A new
Sequence View now presents Envelope/Observer Frame → Diagonal/Root and The Rest
→ Hopf/F40 Connector → open F6 Candidate Frontier → F7 Return/Audit. Functional
descriptions lead; ERITH, Tessarec, E8/H3, Hopf/F40 and other established terms
remain visible aliases and all stable registry IDs remain unchanged. The view
retains `F4→F6`, `F5→F6` and `REST→F3` as `OPEN_BRIDGE` rather than treating F6
as a demonstrated derived mechanism.

The next Owner synthesis extends the visual grammar without changing the
canonical registry. The Navigator now distinguishes three namespaces:
`CF:F1–F7` for the current relation families, `HL:F1–F8` for historical HTML
shelves, and `CAND:F8_AXIS_EXTENSION` for the newly proposed F4/F5 axis
extension. The last is not `HL:F8`, not yet a canonical Connection Family and
not a positive result. The Sequence View records the proposed F4 sender / F5
axis-carrier / F6 receiver reading and compares proposed F1↔F7 pentagonal and
F6 hexagonal carriers with Q4, LOKI-Q4 and the registered E8 240-root carrier.
The existing P6R01 result remains controlling for the geometric boundary: a
mathematically defined “pentagon holds hexagon” relation is not established.

### WP4 — Internal integration pilot

Status: `PARTIALLY ENTERED THROUGH WP3 SHELL / MISSION CONTROL LIVE FIELDS OPEN`

- connect the complete internal manifest;
- keep the existing Mission Control reader and source explorer;
- add Family, Module, Surface and Evidence views;
- expose public-admission readiness without changing authority.

Exit gate: a Human Owner can answer the ten orientation questions in the
original blueprint without opening the filesystem manually.

### WP5 — Public pilot selection

- select approximately 12–20 strong modules or paths;
- prefer understandable, source-bound and visually strong examples;
- include at least one positive, one negative, one historical-revision and one
  no-result evidence path;
- complete rights, language, attribution and public URL fields;
- exclude unresolved private dependencies.

Suggested candidates for review, not automatic admission:

- Family Connection Map;
- 3+1 Dual Belt;
- MIWA / LOKI;
- Tessarec Q° × Iota and Root Space;
- Object–Shadow–Sentence / Rosetta views;
- Q° Port / Conic Gate and Saturn–Titan QRT as bounded applications;
- Polar-Janus phase quadrature as a negative-evidence path;
- selected exact Projection and Relation fixtures.

Exit gate: Human Owner signs the public allowlist and release claim ceiling.

### WP6 — Utility and comprehension test

Compare three conditions:

```text
filesystem/search baseline
current Mission Control documents
Master Navigator
```

Tasks:

1. find an artifact's source, module and claim ceiling;
2. explain Q7 → Q11 → Tessarec without mechanism inflation;
3. distinguish historical Polar PASS from current status;
4. find alternate views and the current master;
5. identify which object is safe for public presentation.

Metrics:

- completion time;
- wrong-source rate;
- wrong-claim or false-promotion rate;
- missed-relation rate;
- confidence calibration;
- explanation accuracy;
- reader-reported cognitive load.

Exit gate: predeclared improvement over the filesystem baseline without a rise
in false claims. Exact thresholds are frozen before the test.

### WP7 — Public release candidate

- build the static public bundle;
- run privacy, link, accessibility, performance and browser checks;
- create source, rights and SHA-256 release manifests;
- publish only after a separate release decision;
- retain the previous bundle for rollback.

Exit gate: B5 Human validation for the bounded orientation tasks and explicit
release authorization. Public availability is not scientific validation.

### WP8 — Maintenance

- version data and UI separately;
- regenerate instead of hand-editing release manifests;
- report stale sources, missing URLs and changed hashes;
- require Mission Control return for public-ring promotion;
- keep historical releases reproducible.

## 10. First-release scope discipline

V1 must not attempt to expose the whole legacy warehouse publicly. It should
support the complete internal corpus while the public pilot remains small.

```text
INTERNAL COVERAGE: complete current registers
PUBLIC PILOT:      12–20 selected modules or paths
LEGACY 3D:         constellation-level entrances only
PRIVATE MC DATA:   excluded
AUTOMATION:        no execution or autonomous promotion
```

The first release proves orientation and relation clarity, not catalog volume.

## 11. Acceptance criteria

### Epistemic

- every relation is typed and explained;
- every evidence card separates local verdict and current interpretation;
- every module and released artifact has a claim ceiling;
- negative, mixed, provisional and no-result states remain visible;
- absence from the public cut is never presented as nonexistence.

### Publication safety

- zero absolute local paths in the public build;
- zero non-allowlisted assets;
- zero private Mission Control records;
- all public assets have rights and attribution state;
- all external content is sandboxed or linked rather than silently embedded.

### Technical

- deterministic manifest and bundle generation;
- schema, link and hash validation;
- direct deep links and browser history;
- keyboard-complete operation;
- responsive operation from mobile to desktop;
- no runtime errors in the supported browser set;
- usable static build without a backend.

### Utility

- the bounded comprehension test is preregistered;
- external readers can reconstruct selected connections accurately;
- the Navigator improves orientation without increasing false closure;
- release language does not exceed the underlying evidence.

## 12. Explicit non-goals

- no universal knowledge platform;
- no autonomous scientific inference;
- no claim that repeated geometry proves one mechanism;
- no replacement of source repositories or Mission Control;
- no bulk publication of the 645-HTML or 1,850-asset legacy corpus;
- no login, collaboration suite, database service or editing workflow in V1;
- no automatic conversion of historical PASS labels into current adoption;
- no deployment before public-admission and privacy gates pass.

## 13. Decisions required before implementation

Only three decisions block WP1–WP4:

1. accept the shared-core / dual-profile architecture;
2. confirm the canonical source-code home, recommended as NEXAH Core with
   Science Lab adapters and Mission Control/Public projections;
3. accept the public pilot as a later allowlisted release rather than the full
   internal corpus.

The exact public domain, visual polish level and final 12–20 pilot items do not
block schema and internal-pilot development.

## 14. Recommended next action

Exercise the implemented internal pilot against the ten orientation questions
and connect the remaining Mission Control currentness/admission diagnostics.
The approved visual gate, formal Draft 2020-12 gate and deterministic
three-registry adapter are complete:

1. [`Internal Navigator pilot`](APP/index.html);
2. [`Design frames`](DESIGN_FRAMES/NEXAH_NAVIGATOR_DESIGN_FRAMES_V1_2026-10-06.html);
3. [`Contract review receipt`](CONTRACTS/NAVIGATOR_CONTRACT_REVIEW_V1_2026-10-06.md);
4. [`Strict Draft 2020-12 runner`](CONTRACTS/validate_navigator_jsonschema_2020.cjs).

The six prepared contracts remain the implementation boundary:

1. [`navigator-entity.schema.json`](CONTRACTS/navigator-entity.schema.json);
2. [`navigator-relation.schema.json`](CONTRACTS/navigator-relation.schema.json);
3. [`navigator-public-manifest.schema.json`](CONTRACTS/navigator-public-manifest.schema.json);
4. [`Internal / Public Field Matrix`](CONTRACTS/NAVIGATOR_INTERNAL_PUBLIC_FIELD_MATRIX_V1_2026-10-06.md);
5. [`Public Admission Checklist`](CONTRACTS/NAVIGATOR_PUBLIC_ADMISSION_CHECKLIST_V1_2026-10-06.md);
6. [`Utility Test and Scoring Rubric`](CONTRACTS/NAVIGATOR_UTILITY_TEST_RUBRIC_V1_2026-10-06.md).

Brand and interface continuity are defined separately in
[`NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md`](NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md).

Next, run the WP6 task rubric on the internal pilot and add live Mission Control
currentness/admission state without transferring authority into the Navigator.
Keep the public profile empty until a Human Owner allowlist, rights record,
public URLs and explicit release receipt exist.
