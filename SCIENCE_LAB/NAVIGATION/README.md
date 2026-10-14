# NEXAH Navigation Ring 1

Status: `ACTIVE_CORE_NAVIGATION / NO_ARCHIVE_REWRITE / NO_CLAIM_PROMOTION`

Maintained: `2026-10-10`

Navigator v1 state: `FROZEN / INTERNAL / ASSESSMENT NEXT`. See the
[Mission Control freeze return](../MISSION_CONTROL_RETURN_NAVIGATOR_V1_FREEZE_AND_NEXAH_ASSESSMENT_2026-10-07.md).

## Governance and Source Graph

The Navigator belongs to the NEXAH Science Lab and is the Lab's central Source
and Relation Graph. Begin every structural task with
[`GOVERNANCE/NAVIGATOR_GOVERNANCE_INDEX_2026-10-10.md`](GOVERNANCE/NAVIGATOR_GOVERNANCE_INDEX_2026-10-10.md).
The validated base registry remains canonical; admitted overlays and
source-bound lenses are indexed without silently changing base counts.
Mission Control receives a generated read-only control projection and does not
maintain a second scientific graph.

The application route [`APP/index.html#lab-register`](APP/index.html#lab-register)
is the central Lab-window over the Human Owner-maintained
[`../LAB_REGISTER.md`](../LAB_REGISTER.md). It is generated and read-only:
study identity, lifecycle and disposition remain in the register; the
Navigator supplies search, context and return paths.

Architecture and full-catalog planning:

- [`../MISSION_CONTROL_RETURN_NAVIGATOR_V1_FREEZE_AND_NEXAH_ASSESSMENT_2026-10-07.md`](../MISSION_CONTROL_RETURN_NAVIGATOR_V1_FREEZE_AND_NEXAH_ASSESSMENT_2026-10-07.md) — current freeze decision, repair boundary and NEXAH assessment gate
- [`NAVIGATOR_V2_CANDIDATE_THEME_HORIZON_2026-10-07.md`](NAVIGATOR_V2_CANDIDATE_THEME_HORIZON_2026-10-07.md) — assessment-only repository archaeology of missing large themes, led by Nested Scale / Matryoshka; no v1 change or candidate promotion
- [`NAVIGATOR_V2_REPRESENTATION_LEDGER_AND_RESOLUTION_LADDER_2026-10-07.md`](NAVIGATOR_V2_REPRESENTATION_LEDGER_AND_RESOLUTION_LADDER_2026-10-07.md) — assessment of the missing edge-accounting layer and the discrete support → count → weight → uncertainty distinction; preserves the final no-validator boundary
- [`NAVIGATOR_V2_UNIVERSAL_OPERATOR_LEDGER_ASSESSMENT_2026-10-07.md`](NAVIGATOR_V2_UNIVERSAL_OPERATOR_LEDGER_ASSESSMENT_2026-10-07.md) — separates residual bookkeeping, operator-role classification and genuine domain balance; joins the equation-term view to the Representation and Evidence Ledgers without adopting a universal physical law
- [`../NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07.md`](../NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07.md) — explanatory framework paper joining Science Lab purpose, Navigator capabilities, evidence rules, worked routes and glossary
- [`NEXAH_MASTER_NAVIGATOR_BUILD_PLAN_V2_2026-10-06.md`](NEXAH_MASTER_NAVIGATOR_BUILD_PLAN_V2_2026-10-06.md) — current publication-ready build plan
- [`NEXAH_NAVIGATOR_CAPABILITY_AND_CONNECTOR_REGISTER_2026-10-06.md`](NEXAH_NAVIGATOR_CAPABILITY_AND_CONNECTOR_REGISTER_2026-10-06.md) — current capability inventory, grouped information architecture and typed connector gate
- [`NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md`](NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md) — nexah.de-related dark Instrument Mode, typography and UI rules
- [`CONTRACTS/`](CONTRACTS/) — entity, relation and public-manifest schemas, fixtures, integrity runner and review record
- [`DESIGN_FRAMES/`](DESIGN_FRAMES/) — three responsive static acceptance frames; sample content only, not the Navigator application
- [`BUILD/`](BUILD/) — deterministic fixture and three-registry Internal/Public exporters with fail-closed rejection reports
- [`APP/`](APP/) — functional internal read-only Navigator pilot using the validated 226-entity manifest, grouped domains, Current Focus and controlled Vocabulary
- [`../CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/`](../CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/) — locked four-cut / multi-generation residual audit; coverage stopped, descriptive no-gain retained without claim promotion
- [`../CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/`](../CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/) — prospective rare-event quota, training-only conditional history gate and finite observer-resolution audit; primary gain with gate-specificity failure
- [`NAVIGATOR_CURRENT_STATE_AND_CROSSWALK_2026-10-07.md`](NAVIGATOR_CURRENT_STATE_AND_CROSSWALK_2026-10-07.md) — pre-redesign route, capability, intake and terminology baseline
- [`NAVIGATOR_ENTRY_TARGET_ARCHITECTURE_V1_2026-10-07.md`](NAVIGATOR_ENTRY_TARGET_ARCHITECTURE_V1_2026-10-07.md) — implemented entry-depth, domain, About and vocabulary blueprint
- [`NAVIGATOR_ENTRY_CONTENT_V1_2026-10-07.json`](NAVIGATOR_ENTRY_CONTENT_V1_2026-10-07.json) — governed six-domain, five-focus and twelve-term entry content
- [`../MISSION_CONTROL_RETURN_PRIMEGRID_NAVIGATOR_CONSOLIDATION_2026-10-07.md`](../MISSION_CONTROL_RETURN_PRIMEGRID_NAVIGATOR_CONSOLIDATION_2026-10-07.md) — current Mission Control synchronization and verified Primegrid representation circle
- [`NEXAH_MASTER_NAVIGATOR_ARCHITECTURE_BLUEPRINT_2026-10-05.md`](NEXAH_MASTER_NAVIGATOR_ARCHITECTURE_BLUEPRINT_2026-10-05.md)
- [`NEXAH_TAXONOMY_CROSSWALK_V2_2026-10-05.md`](NEXAH_TAXONOMY_CROSSWALK_V2_2026-10-05.md)
- [`NEXAH_MODULE_REGISTRY_V2_2026-10-05.json`](NEXAH_MODULE_REGISTRY_V2_2026-10-05.json)
- [`validate_module_registry_v2.mjs`](validate_module_registry_v2.mjs)
- [`HTML_CATALOG_SNAPSHOT_2026-10-05.json`](HTML_CATALOG_SNAPSHOT_2026-10-05.json)
- [`audit_html_catalog.mjs`](audit_html_catalog.mjs)
- [`HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json`](HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json)
- [`HTML_CURATION_COVERAGE_2026-10-06.md`](HTML_CURATION_COVERAGE_2026-10-06.md)
- [`SOLAR_CLOCKWORK_APPLICATION_BRIDGE_2026-10-06.md`](SOLAR_CLOCKWORK_APPLICATION_BRIDGE_2026-10-06.md)
- [`POLAR_JANUS_EVIDENCE_BRIDGE_2026-10-06.md`](POLAR_JANUS_EVIDENCE_BRIDGE_2026-10-06.md)
- [`POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json`](POLAR_JANUS_EVIDENCE_SLICE_V1_2026-10-06.json)
- [`validate_evidence_connection_slice.mjs`](validate_evidence_connection_slice.mjs)
- [`EVIDENCE/PRIME_BRIDGE_LINEAGE_2026-10-06/`](EVIDENCE/PRIME_BRIDGE_LINEAGE_2026-10-06/) — hashed owner visuals, current and census-only GLB anchors, and the bounded 2–3 / 8.8 / PG88 / bridge lineage used by the app's `#lineage` route
- [`EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/`](EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/) — claim-safe UTG mission, four hashed framework plates, media constellations, maturity ladder and prepared Mission Control return used by the app's `#utg` route
- [`EVIDENCE/BREATHING_PRIME_CRYSTAL_INSTRUMENT_2026-10-08/`](EVIDENCE/BREATHING_PRIME_CRYSTAL_INSTRUMENT_2026-10-08/) — read-only calibration family joining the exact integer carrier, executed [`CA-IDENT-09 / PBC-01`](../CASE_STUDIES/NEXAH_VIEW_INDUCED_TOPOLOGY_CALIBRATION_CA_IDENT_09_2026-10-08/README.md) calibration and bounded [`CA-IDENT-10 / LIFE-VIEW-01`](../CASE_STUDIES/NEXAH_LIFE_THREE_CUT_EVENT_TRANSFER_CA_IDENT_10_2026-10-08/README.md) transfer; Prime/LIFE causality and universal LIFE claims remain excluded
- [`EVIDENCE/ROOT7_LOOK_ORIENTATION_2026-10-08/`](EVIDENCE/ROOT7_LOOK_ORIENTATION_2026-10-08/) — source-first, read-only `#root7` orientation lens over the exact 8→16 fixture, the historical bridge master and the closed bounded ROOT7 decision; no new module, family or research cycle
- [`EVIDENCE/PRIME_BASE_MODE_2026-10-10/`](EVIDENCE/PRIME_BASE_MODE_2026-10-10/) — validated, source-bound `#prime-base-mode` archaeology lens with 9 hash-bound sources, 14 bounded nodes, 16 typed relations and 8 type boundaries; no canonical count, family or publication change

The two-stage result is intentionally compressed rather than promoted into a
new route or family. The controlling interpretation is the
[`Carrier–View–Residual Finding`](../LABREPORTS/SYNTHESIS/NEXAH_CARRIER_VIEW_RESIDUAL_FINDING_2026-10-08.md):
preserve identity, declare the cut, compare relations and keep the residual.
- [`build_html_artifact_registry.mjs`](build_html_artifact_registry.mjs)
- [`validate_html_artifact_registry.mjs`](validate_html_artifact_registry.mjs)

Registry v2 is the data baseline for the Master Navigator. It separates
16 conceptual modules, 44 registered module surfaces and 23 typed module relations;
the complete current internal build expands this to 226 entities and 29 relations.
The current Ring-1 browser registry remains stable until an explicit navigation
promotion is approved.

The refreshed artifact snapshot adds complete file coverage for its source
catalog beneath Module Registry v2, including the three Primegrid surfaces.
Each catalogued HTML has a stable identity, explanation, centrality,
content/representation role, lifecycle, owning record or candidate record and
claim ceiling. Existing family, intake, validation and custody documents were
used to distinguish parallel representations from new modules and exact
copies. Only six pages remain provisional; none is automatically promoted.

Together with the registered evidence slices, the internal manifest now
contains 29 typed relations. Connector additions remain evidence-bound in the
capability and connector register; unresolved bridges stay explicitly open,
and the added Pascal return is a bounded representation relation.

The Polar-Janus evidence slice pilots the next Navigator layer: tests, local
verdicts, later interpretations, controls and successor studies. It remains a
bounded slice rather than a claim of complete experiment coverage.

## Purpose

Navigation Ring 1 joins the active browser instruments to the canonical Family
Connection Map without flattening their local controls or rewriting historical
source material. Every connected page exposes the same compact orientation
record:

1. current module,
2. family chain,
3. direct route into the atlas,
4. Mission Control return,
5. short explanation of why the connection exists,
6. related active instruments,
7. module record.

## Canonical registry

[`NEXAH_MODULE_REGISTRY_RING1.js`](NEXAH_MODULE_REGISTRY_RING1.js) is the
browser-readable canonical register. It contains root-relative paths from
`SCIENCE_LAB`, route identifiers, relation explanations, records, related
modules and the presentation mode (`flow` or `immersive`).

[`NEXAH_NAVIGATION_RING1.js`](NEXAH_NAVIGATION_RING1.js) renders the shared
navigation component. Both files are local and remain compatible with direct
`file://` use; no server or package runtime is required.

## Included modules

| ID | Module | Atlas route | Family chain |
|---|---|---|---|
| `atlas` | Family Connection Map v2 | `#all` | F1–F7 overview |
| `mission-control` | HZ/FZ Compass Mission Control | `#all` | F7 transversal |
| `e8-graph` | E8 Mutation Family Graph | `#e8` | F1 → F3 → F5 → F7 |
| `family-synthesis` | Family Synthesis Demonstrator | `#e8` | F1 → F3 → F5 → F7 |
| `typed-coupling` | Typed Coupling Workbench | `#e8` | F1 → F3 → F5 → F7 |
| `word-orbit` | Word & Orbit Sequencer | `#e8` | F1 → F3 → F5 → F7 |
| `two-cut` | Euler · Antipode · Two-Cut Return | `#transversum` | F1 → F2 → F7 |
| `dual-belt` | NEXAH ⇄ ERITH · 3+1 Dual Belt | `#erith` | F1 → F2 → F3 → F1 → F7 |
| `tessarec` | Tessarec Q° × ι · Pearl | `#tessarec` | F2 → F5 → F1 → F2 → F7 |

## Integration boundary

- Ring 1 includes active instruments only.
- Archive, source-snapshot, repair-input and custody copies remain untouched.
- A navigation connection does not promote a scientific claim.
- A route explains the registered relationship; it does not assert mechanism
  identity between modules.
- Further pages enter the ring only after they receive a stable module ID,
  route, record and claim boundary.

## Deep-link contract

The Family Connection Map accepts the following hash routes:

`#all`, `#e8`, `#erith`, `#inside`, `#tessarec`, `#hopf`, `#rest`,
`#transversum`, `#frontier`.

Browser back/forward navigation restores the selected route.
