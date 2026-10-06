# NEXAH Navigation Ring 1

Status: `ACTIVE_CORE_NAVIGATION / NO_ARCHIVE_REWRITE / NO_CLAIM_PROMOTION`

Maintained: `2026-10-06`

Architecture and full-catalog planning:

- [`NEXAH_MASTER_NAVIGATOR_BUILD_PLAN_V2_2026-10-06.md`](NEXAH_MASTER_NAVIGATOR_BUILD_PLAN_V2_2026-10-06.md) — current publication-ready build plan
- [`NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md`](NEXAH_MASTER_NAVIGATOR_VISUAL_LANGUAGE_V1_2026-10-06.md) — nexah.de-related dark Instrument Mode, typography and UI rules
- [`CONTRACTS/`](CONTRACTS/) — entity, relation and public-manifest schemas, fixtures, integrity runner and review record
- [`DESIGN_FRAMES/`](DESIGN_FRAMES/) — three responsive static acceptance frames; sample content only, not the Navigator application
- [`BUILD/`](BUILD/) — deterministic fixture and three-registry Internal/Public exporters with fail-closed rejection reports
- [`APP/`](APP/) — functional internal read-only Navigator pilot using the validated 140-entity manifest
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
- [`build_html_artifact_registry.mjs`](build_html_artifact_registry.mjs)
- [`validate_html_artifact_registry.mjs`](validate_html_artifact_registry.mjs)

Registry v2 is the data baseline for the future Master Navigator. It separates
14 conceptual module families, 33 physical surfaces and 8 typed relations.
The current Ring-1 browser registry remains stable until an explicit navigation
promotion is approved.

The artifact registry adds complete 111/111 file coverage beneath Module
Registry v2. Each HTML has a stable identity, explanation, centrality,
content/representation role, lifecycle, owning record or candidate record and
claim ceiling. Existing family, intake, validation and custody documents were
used to distinguish parallel representations from new modules and exact
copies. Only two pages remain provisional; neither is automatically promoted.

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
