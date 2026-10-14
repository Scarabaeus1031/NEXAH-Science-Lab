# NEXAH Navigator — Current State and Crosswalk

Date: `2026-10-07`  
Status: `CURRENT-STATE BASELINE / CROSSWALK BEFORE REDESIGN`  
Scope: existing Navigator routes, registered corpus, authority boundaries,
terminology and the 2026-10-07 intake

> Historical design baseline. The reconciled 8 October runtime state is
> `173 entities / 29 relations`, plus the separately admitted LIFE overlay for
> a composed `176 / 32`; the current app audit is `156/156 PASS`. See
> [NEXAH Navigator V2.1 — Current State](NEXAH_NAVIGATOR_V2_1_CURRENT_STATE_2026-10-07.md)
> and the [IEEE-300 Mission Control return](../MISSION_CONTROL_RETURN_IEEE300_GRAPH_GRID_VALIDATION_2026-10-08.md).

## 1. Method

This document records the current system before proposing a new information
architecture. It separates four questions:

1. What exists now?
2. What function does it actually perform?
3. Which governed domain and authority does it belong to?
4. Which terminology or interface work remains open?

The proposed domain in a crosswalk row is a placement hypothesis, not yet an
implemented navigation change.

## 2. Validated current corpus

| Object class | Current count | Source |
|---|---:|---|
| Internal entities | 170 | validated internal manifest |
| Typed relations | 23 | validated internal manifest |
| Modules | 15 | validated internal manifest |
| HTML / instrument surfaces | 140 | validated internal manifest |
| Evidence entities | 15 | validated internal manifest |
| Publicly admitted entities | 0 | fail-closed public manifest |
| Application checks | 91/91 PASS | `APP/audit_app.mjs` |

The capability register's summary of 14 module families, 39 surfaces, 121
HTML artifacts, 150 entities and 21 relations is an earlier snapshot. It must
not be used as the current numerical baseline.

## 3. Current route inventory

The current sidebar exposes fourteen routes at one visual level.

| Current route | What is there now | Actual task | Primary capability | Placement hypothesis | Boundary / open issue |
|---|---|---|---|---|---|
| `#home` · Orientation | hero, value, metrics, hierarchy, family map, visual bridge, research question, entrances, secondary links, invitation | first orientation plus many secondary tasks | orient | Orientation | overloaded; mixes threshold, map, atlas and editorial explanation |
| `#about` · About | research problem, UTG, families, evidence, ecosystem roles, question and invitation | identity and responsibility explanation | orient | persistent utility | overlaps Home; lacks compact `does / does not` summary |
| `#utg` · UTG | framework mission, maturity and media constellations | inspect exploratory framework | explore | Framework | UTG must remain framework, not validated universal theory |
| `#dynamics` · Dynamics | comparative dynamical systems and evidence layers | compare carrier-specific transition work | explore / verify | Framework | visual recurrence does not establish a shared mechanism |
| `#envelope` · Envelope | nine typed envelope uses and declarations | inspect a transversal research grammar | explore | Language | not a new Connection Family; semantic home is Language |
| `#ladders` · Ladders | eight bounded ladder comparisons and historical archive | compare recurring ordered structures | explore / verify | Framework, cross-link Language | shared silhouette does not establish a common generator |
| `#atlas` · Atlas | clickable family-organized module and instrument inventory | discover what exists and launch it | explore / retrieve | Atlas | inventory view, not the same as the relation map |
| `#sequence` · Sequence | bounded directed reading across functional families and open bridges | follow an ordered interpretation path | explore | Families | open bridges stay open; not a derivation proof |
| `#lineage` · Lineage | visual, model and GLB provenance collections | trace origin, variant and custody | retrieve / verify | Families, cross-link Evidence | lineage is not identity or scientific promotion |
| `#catalog` · Catalog | searchable complete internal entity register | precision retrieval and filtering | retrieve | Atlas | dense internal tool; should not lead the first visit |
| `#relations` · Relations | typed edges, explanations and negative boundaries | inspect why a connection exists | verify | Evidence | relation does not imply causal or mechanism identity |
| `#families` · Families | seven functional family summaries and counts | choose a relational lens | explore | Families | families organize work; they do not certify identity |
| `#evidence` · Evidence | package-local verdict beside current interpretation | inspect evidence and claim ceiling | verify | Evidence | later interpretation cannot rewrite the local result |
| `#admission` · Admission | public rejection reasons and missing gates | inspect release readiness | govern internally | Evidence / internal control | no publication authority; must remain fail-closed |

## 4. Non-route surfaces that affect the entrance

| Surface | Current role | Crosswalk role | Important distinction |
|---|---|---|---|
| Family Connection Map | spatial and typed relation overview | Families · relation view | not the same as the Atlas inventory view |
| Mission Control | currentness, activation and portfolio authority | authority source | not a Navigator content section |
| Science Lab records | experiments, evidence and bounded interpretation | controlling research record | not replaced by Navigator summaries |
| OLS 1.0 | normative semantic language | terminology authority where applicable | no silent extension from visual vocabulary |
| ORION | certified deterministic structures | narrow structural authority | not authority for Human meaning or all research |
| NEXAHEDRON / OVS | representation and experimental visual syntax | Human/visual expression | not OLS or publication authority |
| `nexah.de` | public and intellectual ecosystem entrance | public handoff | not identical with the internal research Navigator |

## 5. Capability crosswalk

| Capability from the register | Reader task | Existing carrier | Current maturity | Architecture implication |
|---|---|---|---|---|
| First-visitor orientation | understand place, value and limits | Home, About | implemented, too dense | preserve one calm threshold |
| Search and filters | find a known object | Catalog | implemented | deep Atlas tool |
| Stable deep links | return to a precise object | all hash routes | implemented | preserve every current hash |
| Family Connection Map | inspect relation geography | standalone map | implemented | Families relation view |
| Connection Atlas | inspect inventory by family | Atlas | implemented | Atlas inventory view |
| Module/surface/evidence detail | inspect one registered object | Entity routes | implemented | instrument depth |
| Instrument-first launch | open the working HTML directly | Module and Surface detail | implemented | retain as primary deep action |
| Typed relations and negative boundaries | understand an edge without overclaiming | Relations and details | implemented | Evidence function |
| Sequence and Lineage | follow bounded order and provenance | Sequence, Lineage | implemented | Families, with Evidence cross-links |
| Primegrid representation circle | compare finite state, DFT and Pascal views | Sequence plus registered surfaces | implemented, bounded | no new top-level route needed |
| UTG, Dynamics and Envelope lenses | inspect framework and transversal grammar | UTG, Dynamics, Envelope | implemented | Framework and Language must stay distinct |
| Admission inspector | inspect why publication is rejected | Admission | implemented, fail-closed | internal control below Evidence |
| OLS/ORION/NEXAHEDRON role explanation | distinguish responsibilities | About | implemented in prose | make authority map faster to scan |
| Human utility validation | test whether people orient correctly | utility protocol | not established | redesign still requires Owner walkthrough |
| Public Navigator | released public projection | empty public manifest | not admitted | no public language implied by redesign |

## 6. 2026-10-07 intake crosswalk

These objects form one current work cluster, but they do not form one new
canonical module or family merely because they were reviewed together.

| Intake object | Existing registered home | Functional reading | Cross-links | Current boundary | Open work |
|---|---|---|---|---|---|
| Primegrid / Pascal / 101 | Tessarec and Number/View surfaces; Sequence | finite state, quotient, Hamming-weight/Pascal and prime-control views | Families · Atlas · Evidence | equal counts and visual correspondences do not establish operator identity or coding gain | consolidate the 101/121/3301 explanations and term mappings |
| OIL / RIS Multi-Lens | Readout Reconstruction module and supporting visuals | `OIL = outer orbit · inner orbit · link/transfer orbit`; `RIS = rotation · inversion · shift` | Language · Atlas · Evidence | source-bound visual kinematic grammar; not an orbital-physics claim and no historical operator composition has been recovered | retain the source expansion while keeping formulas and composition order explicitly open |
| `ø` | Primegrid addendum and Multi-Lens audit | typed split/cut record; two declared branches partition a complete finite source | Language | fixture-bound meaning; must not be confused with the mathematical empty-set symbol `∅` or assumed universal | distinguish the verified local core from carrier-specific uses such as aperture or masking |
| `œ` | Primegrid addendum and Multi-Lens audit | typed registered seam/transition joining declared views with a common address | Language | fixture-bound meaning; not a standard mathematical operator or universal ligature semantics | show the registered local definition and require context outside the tested fixture |
| Readout Reconstruction | `MOD:READOUT_RECONSTRUCTION` | projection, occlusion, multi-view registration and bounded reconstruction | Atlas · Language · Evidence | visibility recovery is not full source recovery | connect each visual to a declared operator and evidence level |
| GLB Gateway | `ART:READOUT:GLB_GATEWAY` | spatial entrance to registered 3D representations | Atlas · Lineage | 3D representation is not additional proof | verify pairings, titles, paths and custody for each GLB |
| ACR audit series | registered or package-local evidence surfaces | exact arithmetic, representation and boundary checks | Evidence | a PASS validates only its declared bounded check | expose expansions and one-line meanings for ACR identifiers |
| MRB / Pascal Threads | MRB-01–10 custody series | series originating as `Modular Redundancy Binder`; later cases extend into mirrors, radix, return, zipper and Pascal-thread audits | Framework · Evidence | the original expansion does not make every later case a redundancy test; equal number does not imply equal structure | present the series name historically and each case by its functional subtitle |
| Desktop archaeology queue | custody package and registers | incoming HTML/GLB candidates | Atlas · Evidence | discovery is not admission | classify master/support/variant/historical/copy and record provenance |

## 7. Terminology crosswalk — current priority set

The governing display rule is:

> Meaning first · established vocabulary second · NEXAH term third · code last.

| Display meaning | Established or adjacent vocabulary | NEXAH/local term | Code or glyph | Status | Required boundary |
|---|---|---|---|---|---|
| common descriptive framework for transitions | dynamical systems, event surfaces, return maps, transversality | Unified Transition Geometry | UTG | locally defined exploratory framework | not a validated universal theory |
| observing through several bounded views | multi-view reconstruction, registration, inverse problem, sensor fusion | outer/inner/link orbits plus rotation/inversion/shift | OIL/RIS | source expansion recovered; historical executable composition remains open | multiple views do not guarantee unique reconstruction |
| division or masking intermediate | cut, partition, section, aperture, occlusion, quotient | typed split/cut record | `ø` | tested inside declared finite fixtures | not `∅`; outside the fixture, carrier and operator must be declared |
| transition or binding intermediate | seam, gluing, transition map, registration, return with memory | registered seam/transition | `œ` | tested inside declared finite fixtures | not a standard operator; no intrinsic meaning outside the fixture |
| limit on what a statement may assert | scope condition, validity domain, evidential bound | claim ceiling | — | controlled Navigator term | not a confidence decoration |
| object on which an operator acts | state space, signal, graph, manifold, dataset | carrier | — | established-adjacent use | same operator name across carriers does not imply identity |
| mapping into a reduced or visible view | projection, observation map, masking | projection / fold | P / F where declared | established term plus local notation | projection may be non-injective |
| inference of hidden state from views | inverse problem, reconstruction, state estimation | reconstruction / readout | R where declared | established term plus local notation | recovered visibility is not full source identity |
| opposite point or paired orientation | antipodal point, involution, complement where defined | antipode / Janus pair | carrier-specific | established only when the mapping is defined | numeric reversal alone is not an antipodal map |
| binomial multiplicity structure | Pascal triangle/simplex, binomial coefficients | Pascal threads / pyramid | MRB context | mixed established/local language | numerical coincidence does not transfer structure |
| relation family | typed relation class, functional lens | Connection Family | `CF:F1–F7` | canonical Navigator namespace | not a universal mechanism class |
| historical HTML shelf | archive classification | HTML shelf | `HL:F1–F8` | historical namespace | never conflate with `CF:*` |
| proposed axis extension | research hypothesis / unresolved relation | axis extension | `CAND:F8_AXIS_EXTENSION` | candidate | not canonical F8 and not `HL:F8` |
| evidence package audit | verification record / audit | ACR series; ACR-27 is explicitly titled `Angle Closure & Representation Audit` | `ACR-*` | series-wide expansion is not yet established | use each record's functional title; PASS remains local to the declared test |
| modular and representation-boundary study | modular redundancy, CRT, multiplicity and junction audit | Modular Redundancy Binder series | `MRB-*` | source expansion recovered from MRB-01; later scope is broader | use each case subtitle; the inherited label is not a theorem class |
| 3D interchange asset | glTF binary scene | GLB | `.glb` | established file format | a model asset is not an executable or evidence result |
| normative language layer | controlled vocabulary / ontology | Orientation Language System | OLS | existing NEXAH authority | Navigator cannot silently extend it |

## 8. Recovered terminology receipts

| Term | Controlling receipt | Finding |
|---|---|---|
| OIL/RIS | `RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/11_MATHEMATICAL_FOUNDATIONS_GLOSSARY.md` | OIL expands to outer orbit, inner orbit and link/transfer orbit; RIS expands to rotation, inversion and shift. The generator supplies names, geometry and animation, not a source-defined executable composition. |
| `ø` / `œ` | Multi-Lens preregistration and assessment; Primegrid 101/O-lane addendum | `ø` is a declared split/cut and `œ` a registered seam/transition inside the finite fixture. Neither has an intrinsic universal meaning. |
| MRB | MRB-01 README | the series begins as `Modular Redundancy Binder Test`; later numbered cases broaden the functional scope. |
| ACR | ACR-27 source and subsequent ACR chain reports | ACR-27 is `Angle Closure & Representation Audit`; later records form a broader adapter/audit sequence. A single series-wide expansion has not yet been located and must not be invented. |

## 9. Terminology record required before interface copy

Every abbreviation, glyph or NEXAH-specific term used on Home, About or
Current Focus must have a small controlled record:

```text
term_id
display_name
plain_language_definition
expansion
established_or_adjacent_vocabulary
nexah_specific_usage
does_not_mean
status: established | locally_defined | candidate | historical
controlling_source
related_entity_ids
first_use_copy
```

Unknown expansions must be shown as unresolved; they must not be invented for
editorial smoothness.

## 10. Current-state findings that constrain redesign

1. Home is currently broader than an orientation threshold.
2. About contains the correct responsibility model but duplicates parts of Home.
3. Fourteen routes appear visually equal even though they represent different
   reader depths and authority levels.
4. The Family Connection Map and Connection Atlas are complementary but still
   easy to confuse.
5. Recent work cuts across several existing domains and therefore needs an
   orientation projection, not a new canonical family.
6. Several local abbreviations and glyphs are not yet safe for unexplained
   first use.
7. The numerical baseline in one maintained planning record has drifted behind
   the validated manifest.

## 11. Gate before target architecture

Architecture and final copy should be drafted only after:

- the route and capability placements above are accepted or corrected;
- the ACR series naming policy is decided without projecting ACR-27's title
  automatically onto all later records;
- the recovered OIL/RIS, MRB, `ø` and `œ` receipts are accepted as the
  controlled first-use wording;
- the current-focus objects have explicit lifecycle and controlling records;
- the numerical planning baseline is reconciled with the current manifest.

No interface implementation is authorized by this crosswalk alone.
