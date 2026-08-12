# Ecosystem architecture status ledger

Ledger authority: synchronization status and maintenance queue only  
Semantic/product/scientific authority: none  
Last verified: 2026-08-13

This is the **one ledger** and contains the **one update queue**. It references
immutable evidence; it does not duplicate scientific evidence.

## Row schema

Required fields:

`ID | SOURCE | SOURCE_HASH | SOURCE_STATUS | DATE | ARCHITECTURE_IMPACT | OWNER |
AFFECTED_SYSTEMS | ADOPTION_STATUS | CANONICAL_TARGETS | SYNC_STATUS |
LAST_VERIFIED | NEXT_ACTION`

Allowed sync states:

`CURRENT | REVIEW_REQUIRED | UPDATE_REQUIRED | BLOCKED | HISTORICAL |
SUPERSEDED | NOT_APPLICABLE`

Recommended adoption states:

`NOT_ADOPTED | PENDING_OWNER_REVIEW | ADOPTED | ADOPTED_WITH_CHANGE | DEFERRED |
REJECTED`.

## Current baseline ledger

| ID | Source / hash | Source status / date | Impact | Owner | Affected systems | Adoption | Canonical targets | Sync | Last verified | Next action |
|---|---|---|---|---|---|---|---|---|---|---|
| EASL-001 | ORION ADR-0009 `a3dbefeebb4714431a7e3087350adee5b1aa9cac7751346b788da9a6046b25cc`; Master Architecture `b40a8e8bff55cbee033f1d8b061f240a3f933e9cf853b9561ed488ed3662f550`; Ownership `2857af08ac8c1b036db0cf68f5a29c36ec1ba7de59f5089ce8604495c00decd9`; provenance commit `d023b96672d6c29c8fadda1b91e247f48d9b1288` | Owner-adopted documentation committed and pushed on `codex/orion-orientation-operators`; default `main` promotion not performed / 2026-08-13 | `ARCHITECTURE_CANDIDATE` resolved | Owner / ORION | ORION, ecosystem docs, visual | `ADOPTED_WITH_CHANGE` | ADR-0009; Master Architecture; Ownership; indexes | `REVIEW_REQUIRED` | 2026-08-13 | Owner decides whether/when the exact provenance commit is promoted to the default branch; do not merge automatically. |
| EASL-002 | ORION V1 classification `96619a5cc5632a3615fa21c2744c7609266f901e89fa452e7e77bddbfb43645e` | Current V1 / 2026-08 | `NO_ARCHITECTURE_IMPACT` | ORION | ORION | `ADOPTED` | V1 classification / reading order | `CURRENT` | 2026-08-11 | Recheck only on V1 classification or release change. |
| EASL-003 | NEXAH Ecosystem Constitution `b185af1aea97fe5e68ca98f6bdb3212e83e87685292898e6a95f106d0a287edb` | Current reviewed source / 2026-08 | `NO_ARCHITECTURE_IMPACT` | NEXAH | NEXAH, ecosystem | `ADOPTED` | NEXAH governance | `CURRENT` | 2026-08-11 | Recheck on normative/ownership change. |
| EASL-004 | ADR-0009 `a3dbefeebb4714431a7e3087350adee5b1aa9cac7751346b788da9a6046b25cc`; Master Architecture `b40a8e8bff55cbee033f1d8b061f240a3f933e9cf853b9561ed488ed3662f550` | Interface V1 approved, not implemented / 2026-08 | `INTERFACE_IMPACT` | Interface Owners | ORION, NEXAH | `ADOPTED` as design only | Interface V1 decision records | `CURRENT` | 2026-08-11 | Preserve `MEMBRANE_V1_APPROVED_NOT_IMPLEMENTED`; implementation requires separate authorization. |
| EASL-005 | ORION classification `96619a5cc5632a3615fa21c2744c7609266f901e89fa452e7e77bddbfb43645e` | LYRA inactive / 2026-08 | `NO_ARCHITECTURE_IMPACT` | ORION Owner | ORION, Experience, visual | `ADOPTED` status | V1 classification; visual status label | `CURRENT` | 2026-08-11 | Flag any current document claiming active certified LYRA. |
| EASL-006 | Phase 4B manifest `1b49ad98bbd13372a37bacf17e75d4fba453e6ed8f632bc94906c5ae6bdf0818` | Owner architecture freeze / 2026-08-11; package currently uncommitted | `ARCHITECTURE_CANDIDATE` resolved | Owner / Human authority | ecosystem, Experience, visual | `ADOPTED_WITH_CHANGE` | Phase 4B freeze; Master Visual V1 | `REVIEW_REQUIRED` | 2026-08-11 | Preserve exact package and obtain direct repository-history authorization before committing; no implementation. |
| EASL-007 | NEXAHEDRON authority `c113632cadc007cb827c18f8df1da9ff20baf660db526430a0625670a6aa7231`; Experience principles `31a5499a849872359fcf7675a8c4fb499a685e66d6f402a447449f136325d646` | Current implementation/architecture / 2026-08 | `NO_ARCHITECTURE_IMPACT` | Experience / NEXAHEDRON | Experience, Human boundary | `ADOPTED` current boundaries | Their own architecture docs | `CURRENT` | 2026-08-11 | Recheck on interaction, session, reflection or authority change. |
| EASL-008 | Lab master status `c14a70373699cb770909d5f62aef14fb933129b82b6fb6ba875912eb4f700816`; portfolio `12409616e9f7446c23bfcab94cd02e13298a9846c97d3d89cf68ff73fc7e7b4e` | External Research authority / 2026-08 | `NO_ARCHITECTURE_IMPACT` | Science Lab | ecosystem | `ADOPTED` boundary | Lab governance/status | `CURRENT` | 2026-08-11 | Apply disposition invariant to every new CLOSED Labreport. |
| EASL-009 | Master Visual V1 `/Users/tho2020/.codex/visualizations/2026/08/10/019fec6c-4b5b-7ec3-bb6d-c6e54cf41e11/master-ecosystem-overview-v1.html`; SHA-256 `42da93f0fc8cb851f99ed8efb6bfcece66f50782a5b4c6e27d1674e14af76d1b`; registration `06_MASTER_VISUAL_V1_REGISTRATION.md` SHA-256 `0d9298aedd600999db0a30a6bd7a399fa1ed1f3e869235ca2f86a12722d6a442` | `DERIVED_ARCHITECTURE_ARTIFACT`; semantic content verified; visual version 1.0.0; embedded status `REVIEW_REQUIRED` | `NO_ARCHITECTURE_IMPACT` | Documentation Owner | ecosystem visual | `NOT_APPLICABLE` (derived, no adoption authority) | Master Visual + registration sidecar | `REVIEW_REQUIRED` | 2026-08-11 | Preserve V1; publish with sidecar or issue a separately authorized traceability-only PATCH. |
| EASL-010 | Historical materiality backfill `05_HISTORICAL_MATERIALITY_BACKFILL.md`; SHA-256 `b8d05a7f4ae176bec3945dfba83e53f7fd145ca9cf57a205377257a916c57fa1` | Material pre-ledger set dispositioned; bounded trigger queue remains | `NO_ARCHITECTURE_IMPACT` for the reviewed set | Science Lab / Owner only for future adoption | ORION, NEXAH, interface candidates | `NOT_ADOPTED` by default; MHB-001..MHB-007 explicit | None | `CURRENT` | 2026-08-11 | Apply the bounded trigger rule to newly indexed/cited/published material reports; do not inventory every directory. |
| EASL-011 | NEXAH `GOVERNANCE/CURRENT_ECOSYSTEM_ARCHITECTURE_STATUS.md` SHA-256 `e8d0d83c22886c87eb672d6ace460531b257eff7d080724a8f5413291c146f05`; Governance Index SHA-256 `f32ac0287157c1ea61eb8796aa0829582961acf7eddc83c87e8a87b275dd98ee` | Minimal adopted-boundary transcription / uncommitted | `ARCHITECTURE_SYNC` only; no new decision | NEXAH governance | NEXAH readers, ecosystem docs | Existing decisions only | NEXAH governance status/index | `REVIEW_REQUIRED` | 2026-08-11 | Repository Owner must explicitly authorize commit; content is a reference/transcription, not new architecture. |
| EASL-012 | `NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1/FINAL_APPLICATION_AND_USEFULNESS_ROADMAP_REPORT.md`; SHA-256 `7f08258aab09f8b0fda7fcea2d99ff7e62671b7a55445771cc0004762d70692b` | Phase 5A planning / derived documentation | `NO_ARCHITECTURE_IMPACT` | Planning Owner; future Application owner unresolved | future NEXAH Applications work | `NOT_ADOPTED` as capability; planning only | None | `NOT_APPLICABLE` | 2026-08-11 | Keep outside Core/Research evidence; after Owner adoption transcribe only the active pilot contract into NEXAH `APPLICATIONS/` under existing application governance. |
| EASL-013 | Continuity placement `07_CONTINUITY_SYSTEM_PLACEMENT.md`; SHA-256 `13fd8549e67e929b15353b7db40ddd229ffc1bc6fc9dd9e12458b63ed9c36e18` | Single maintenance system selected; package uncommitted | `NO_ARCHITECTURE_IMPACT` | Ecosystem maintenance / owning repositories retain semantics | all repositories | `NOT_APPLICABLE` | This continuity package only | `REVIEW_REQUIRED` | 2026-08-11 | Version the exact continuity package only after direct repository-history authorization; never create a parallel tracker. |

Full source hashes are recorded where a source exists. `NOT_AVAILABLE` and
`NOT_YET_ESTABLISHED` are explicit findings, never substitutes for a hash after
the corresponding artifact or inventory exists. New entries must use full
hashes or an immutable manifest reference.

## Single update queue

Only non-current actionable items appear here. Queue membership does not grant
permission to perform the action.

| Queue ID | Ledger item | What changed | Affects | Required review/action | Authority needed | State |
|---|---|---|---|---|---|---|
| UQ-001 | EASL-001 | Exact adopted ORION documentation is durable on remote feature branch `codex/orion-orientation-operators`; default `main` does not yet contain provenance commit `d023b96672d6c29c8fadda1b91e247f48d9b1288` | ORION canonical/default-branch provenance | Owner reviews and separately authorizes default-branch promotion if desired; no automatic merge | Owner / repository authority | `REVIEW_REQUIRED` |
| UQ-004 | EASL-011 | Minimal NEXAH ecosystem-status transcription is exact but uncommitted | NEXAH reader baseline | Review and commit only with direct repository-history authorization | NEXAH repository Owner | `REVIEW_REQUIRED` |
| UQ-005 | EASL-009 | Visual content verifies, but embedded ledger hash is not independently reconstructible and files are outside a publication repository | Derived visual traceability/publication | Publish V1 with sidecar or authorize a traceability-only PATCH; do not silently overwrite | Documentation Owner | `REVIEW_REQUIRED` |
| UQ-006 | EASL-006, EASL-013 | Owner-adopted LUCY freeze and the single continuity package exist only as uncommitted Science Lab repository content | Baseline provenance and maintenance durability | Review exact package allowlist and explicitly authorize repository-history commit | Science Lab repository Owner / ecosystem maintenance authority | `REVIEW_REQUIRED` |

UQ-001's ambiguous local working-tree state was narrowed on 2026-08-13 by
exact five-file ORION provenance commit
`d023b96672d6c29c8fadda1b91e247f48d9b1288`, pushed to
`origin/codex/orion-orientation-operators`. All frozen content hashes were
preserved and unrelated ORION work remained untouched. The queue remains open
only for an explicit default-branch disposition.

UQ-003 is resolved by the materiality-filtered MHB-001..MHB-007 dispositions
and bounded trigger queue in EASL-010. This does not claim exhaustive review of
every historical directory.

## Ledger update rule

Append or amend a row only when a trigger occurs. Preserve previous source hash
and state in version control/history; do not silently overwrite meaning. Remove
an item from the queue only after recording the authorized decision, changed
target hashes and verification result in its ledger row.
