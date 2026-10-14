# NEXAH Science Lab & Navigator

## Framework, Capabilities, Evidence and Vocabulary

**Version:** `1.1`

**Maintained through:** `2026-10-14`

**Status:** `INTERNAL SYNTHESIS / NAVIGATOR V2.1 CURRENT COMPANION / V1 FREEZE RETAINED / NO CLAIM PROMOTION`

**Current through:** `2026-10-14`

**Authority:** Human Owner. Source records retain scientific and operational
authority.

**Operational effect:** `NONE / NO AUTOMATIC ACTIVATION / NO PUBLICATION`

> NEXAH helps a situated human compare bounded views without confusing a view
> with its source, a resemblance with a mechanism, or an instrument with an
> authority.

This handbook is the common explanatory entrance to the NEXAH Science Lab and
the NEXAH Science Navigator. It connects the human question, the research
method, the current Navigator capabilities, the evidence architecture and the
controlled vocabulary in one readable document.

It does not replace the [Lab Constitution](LAB_CONSTITUTION.md), Mission
Control, package-local evidence records, the mathematical
[glossary](../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/11_MATHEMATICAL_FOUNDATIONS_GLOSSARY.md),
the [Module Registry](NAVIGATION/NEXAH_MODULE_REGISTRY_V2_2026-10-05.json) or
the [Navigator capability register](NAVIGATION/NEXAH_NAVIGATOR_CAPABILITY_AND_CONNECTOR_REGISTER_2026-10-06.md).
Where a summary here differs from a controlling record, the controlling record
wins.

The Navigator v1 baseline is frozen by the
[Mission Control freeze return](MISSION_CONTROL_RETURN_NAVIGATOR_V1_FREEZE_AND_NEXAH_ASSESSMENT_2026-10-07.md).
The current internal composition is documented separately in the
[Navigator V2.1 current-state record](NAVIGATION/NEXAH_NAVIGATOR_V2_1_CURRENT_STATE_2026-10-07.md).
V2.1 retains the v1 freeze as predecessor evidence and adds bounded generated
lenses; it does not create a public release or new claim authority.

## 1. The short explanation

NEXAH begins with a practical difficulty: a human never encounters a complex
field from every possible position at once. Every observation, diagram,
measurement, model or interface is already a bounded view. It selects, frames,
transforms and records some relations while leaving others invisible,
compressed or unresolved.

The NEXAH Science Lab turns questions about such views into inspectable
research records. It asks what the carrier is, how a view was produced, which
operation was applied, what survives the operation, what is lost, what is
introduced, what remains unresolved and what can be reconstructed. Negative
and null results remain evidence when their tests and boundaries are valid.

The NEXAH Science Navigator is the read-only orientation instrument over this
landscape. It helps a reader find modules, instruments, families, relations,
evidence and limits. It does not decide what is true, activate research,
certify a universal theory or authorize publication.

Since `SL-GOV-004`, it is also the Science Lab's canonical Source and Relation
Graph. This does not turn the interface into a source warehouse: original
records remain in their repositories, `LAB_REGISTER.md` remains the Study and
lifecycle register, and Mission Control receives only a generated governance
projection. New work follows `SEARCH -> MATCH -> BIND -> BUILD -> RETURN ->
GOVERN` so existing identities and evidence are found before another object is
created.

The shortest common path is:

```text
FIELD OR SOURCE
  -> DECLARED CARRIER AND QUESTION
  -> SELECTED FRAME / APERTURE / CUT
  -> TRACE, VIEW OR RECORD
  -> DECLARED TRANSFORMATION OR COMPARISON
  -> RETAINED / LOST / ADDED / UNRESOLVED
  -> RESIDUAL, AMBIGUITY OR RECONSTRUCTION
  -> EVIDENCE AND CLAIM CEILING
  -> RETURN TO HUMAN INTERPRETATION
  -> NEXT QUESTION / ABSTAIN / STOP
```

## 2. Why the Science Lab exists

The Science Lab exists to turn bounded questions into reproducible and
honestly classified records. It is not a folder of attractive images and not
an automatic promotion engine for ideas. A study must preserve its question,
scope, carrier, method, controls, provenance, result, failure modes and claim
boundary.

This produces four important separations:

1. **Source and representation remain distinct.** A map, plot, GLB or HTML
   instrument is not the object it depicts.
2. **Operation and interpretation remain distinct.** Software may transform or
   compare records; meaning and responsibility remain human.
3. **Local success and general validity remain distinct.** A passing fixture
   establishes only what its declared test supports.
4. **Discovery and admission remain distinct.** Finding an artifact does not
   make it current, canonical, public or scientifically stronger.

The Lab therefore treats `PASS`, `FAIL`, `NULL`, `UNINFORMATIVE`, `ABSTAIN` and
`OPEN` as meaningful states. A correct negative result can be more valuable
than an attractive but unbounded positive image.

## 3. The human and the instrument

NEXAH keeps the situated human (`I`) separate from the bounded instrument
(`IT`). The distinction is a responsibility boundary.

| Human (`I`) | Instrument (`IT`) |
|---|---|
| supplies purpose, context and a question | receives declared records and parameters |
| can revise the question or reject the frame | applies declared operations |
| interprets relevance and consequence | reports structure, difference, residual and error state |
| can abstain or stop | cannot inherit human authority from a successful computation |
| remains responsible for activation and publication | remains bounded by its contract and data |

The instrument can make relations legible. It cannot turn legibility into
truth by itself. The Navigator follows the same rule: it presents governed
paths through the research but does not become the authority of the records it
links.

## 4. One ecosystem, distinct responsibilities

| Layer | Primary responsibility | Explicit boundary |
|---|---|---|
| **NEXAH** | public and intellectual entrance to the wider ecosystem | public explanation is not internal research authority |
| **Mission Control** | currentness, activation, authority and portfolio priority | not replaced by Navigator status cards |
| **Science Lab** | discovery, experiments, evidence and bounded interpretation | package-local records retain scientific authority |
| **Science Navigator** | orientation, retrieval, comparison and explicit connection paths | no activation, certification or publication authority |
| **OLS 1.0** | normative semantic language | Navigator visuals cannot silently extend OLS |
| **ORION** | narrow certified deterministic structures | a visual or Lab fixture does not create an ORION capability |
| **NEXAHEDRON / OVS** | human-facing and experimental representation spaces | visual expression is not automatic scientific evidence |

The relationship can be read as:

```text
MISSION CONTROL governs currentness and authorization.
SCIENCE LAB governs research records and bounded findings.
NAVIGATOR makes their relations inspectable.
OLS governs normative language where adopted.
ORION governs its declared deterministic core.
NEXAHEDRON / OVS provides representational and experiential space.
THE HUMAN retains interpretation, responsibility and STOP.
```

## 5. How the Navigator is organized

The [Science Navigator](NAVIGATION/APP/index.html#home) currently groups its
routes into six question-led domains.

### 5.1 Orientation

**Question:** What is this place, what is current and where should I begin?

Orientation contains the first-visitor explanation, the research question,
Current Focus and the role boundaries. It is deliberately concise. It points
deeper without pretending that a landing page can carry the evidence itself.

### 5.2 Framework

**Question:** Which descriptive structures organize transitions, fields and
comparative models?

Framework contains Unified Transition Geometry, comparative dynamics and
ladder views. These are organizing structures. Each object-specific formal
model and validated application must still establish its own carrier,
operators, evidence and limits.

### 5.3 Families

**Question:** Which relational task does an object perform, and how can its
sequence or lineage be followed?

Families contains the canonical Connection Family map, directed sequences and
lineage views. A family is a functional lens, not a claim that all members
share one mechanism.

### 5.4 Language

**Question:** Which terms, symbols and local operators are used, and how do
they connect to established vocabulary?

Language contains controlled vocabulary and the Envelope lens. Its editorial
rule is:

> Meaning first. Established vocabulary second. NEXAH term third. Code last.

### 5.5 Atlas

**Question:** Which modules, instruments and registered surfaces exist, and
which one is the current entry?

Atlas presents modules, surfaces, catalog records, launch paths and operational
comparisons. Registration makes an object retrievable; it does not promote its
claim.

### 5.6 Evidence

**Question:** What was tested, what survived, what failed and what is still not
established?

Evidence exposes evidence records, typed relations, provenance and public
admission state. Open links remain open; negative results remain visible; the
public manifest remains fail-closed.

## 6. What the Navigator can do

The following capability map describes the current internal pilot.

| Capability | What it enables | Boundary |
|---|---|---|
| First-visitor orientation and About | understand purpose, structure and authority before entering dense views | explanation, not scientific authority |
| Current Focus | see five currently relevant, lifecycle-bound research routes | current orientation is not activation or promotion |
| Controlled Vocabulary | read a term in plain language, connect it to established vocabulary and inspect its source | local terms remain local |
| Catalog search and filters | find registered objects by text, type, family and role | registry projection only |
| Stable routes and browser history | share and revisit a particular view or entity | a route does not certify its target |
| Family Connection Map | inspect seven canonical relational lenses and open frontiers | relation view, not mechanism identity |
| Connection Atlas | compare registered modules and their links | inventory is not a family or theory claim |
| Module, surface and evidence detail | move from overview to controlling object and provenance | source records remain controlling |
| Instrument-first launch | open registered HTML instruments and current master surfaces | launch is not approval or publication |
| Typed relations | see why two objects are connected and what the connection does not establish | every edge needs evidence and a claim ceiling |
| Sequence view | follow directed representation routes such as Primegrid | sequence does not imply a single generator |
| Lineage view | inspect historical, visual and media ancestry | repeated imagery is not independent confirmation |
| Prime · Base · Mode lens | trace one finite number carrier through prime order, modulus, base, product coordinates, grids and polygons | a shared number token or visual form does not establish object, operator or mechanism identity |
| Comparative carrier lenses | compare several views while retaining carrier and residual distinctions | similar operations on different carriers are not identical |
| UTG, Dynamics, Envelope and Ladders | inspect framework-level structures and object-specific roles | framework recurrence is not universal mechanism |
| Evidence and admission inspectors | see results, controls, rejection state and publication boundary | only the Human Owner can authorize publication |

Two non-capabilities are equally important:

- **Human utility has not been established.** Machine answerability and an
  internal audit are not a reader study.
- **There is no admitted Public Navigator.** The public manifest is empty
  until an allowlist, release receipt and explicit authorization exist.

## 7. Current governed baseline

As of 14 October 2026, the current governed Source Graph contains:

- **16 conceptual modules**;
- **45 registered module surfaces**;
- **235 inventoried HTML artifacts** (45 curated, 77 documented, 113 provisional);
- **266 deduplicated internal entities**;
- **29 typed relations** in the complete internal build;
- **0 publicly admitted entities**;
- `publication_authorized = false`.

The current V2.1 internal composition adds an admitted LIFE overlay of three
entities and three relations, for a composed view of **269 / 32**, while the
base remains **266 / 29**. Nineteen governed component slices expose the stable
routes, the complete
20-record LIFE programme lens and the Observatory crosswalk of seven canonical
families × eight typed inspection fields. The current structural app audit is
`244/244 PASS`; Human utility and public admission remain unestablished.

The source-bound `#prime-base-mode` lens adds nine verified source receipts,
fourteen bounded research nodes, sixteen typed relations and eight explicit
type boundaries without entering the canonical counts. It separates prime
value, prime index, base, modulus, product coordinate, grid, polygon and
spectral mode. Exact CRT structure, bounded empirical findings, negative
results and open research questions therefore remain visible in one route
without being flattened into a unified mechanism.

The 16 conceptual modules are:

1. NEXAH Family Connection Map;
2. HZ/FZ Compass Instrument;
3. E8 / Coxeter Orbit Topology Lab;
4. Transversum / Euler Antipode Two-Cut Return;
5. NEXAH to ERITH / 3+1 Dual Belt;
6. Tessarec Carrier Family;
7. Observatory / MIWA Carrier Family;
8. Five-H / One-Q Phase Cut;
9. Common Runtime / Comparison Infrastructure;
10. HTML Orientation Demonstrator Series;
11. Operator Demonstrator / Orientation Kernel Series;
12. Rosetta / Geodesic Weather Intake;
13. Root7 / Number and View Test Suite;
14. Readout Reconstruction / OIL-RIS Multi-Lens;
15. Roedelheim Observatory Thread Loom;
16. IEEE-300 Graph-to-Grid Validation.

The list is a routing and custody baseline. It does not mean that every module
has equal maturity or that all relations are established. Lifecycle, evidence
state and claim ceiling remain object-specific.

### 7.1 IEEE-300, residue antipode and persistent address

The sixteenth module demonstrates the Handbook's separation between carrier,
view, address and return. Its carrier is a solved IEEE-300 network. R2 passes a
narrow representation contract: local label-independent relations drive a
fixed `12 x 12` moving grid, respond to a registered topology change, survive
bus relabeling and separate from the synthetic carrier.

The follow-up `MORPHOLOGY_01` is deliberately retained as mixed-negative. Both
solver policies converge through `1.032` and fail at `1.033`, but H3 and the
`12 x 7 x 144` Circle do not beat matched rotations, Circle does not preserve
the required order, resolution stability fails and topology replication is
insufficient. A reproducible view is therefore not automatically a preferred
geometry.

Two source-bound translations clarify the method without promoting a new
claim:

- `41–42–43 <-> 1031–1032–1033` shares the ordered residues `5–6–7 mod 9`.
  The local reflection exchanges `5` and `7` and fixes `6`; its oriented lift
  reverses the sign channel. This matches the grammar of the global PRIMEGRID
  antipode, but is not the same operator without an explicit intertwiner.
- the persistent register translates `7² -> 8²` by `64=49+14+1`. A node may
  move between map frames while its typed address remains `C2`. The 14 headers
  and the prime-position statement `P14=43` are different uses of the same
  integer, not an implicit conversion rule.

This route is registered as a Number/View bridge plus a bounded
persistent-address method relation. Neither relation turns the Rosetta record,
the residue reflection or a visual geometry into an IEEE mechanism.

### 7.2 Carrier, cut and residual — executed two-carrier control

CA-IDENT-09 and CA-IDENT-10 turn the Handbook's carrier/view distinction into
an executable stress test. The first stage fixes integers `1..3000` and changes
only the 19/20/21-column representation. The second stage fixes 14,132
birth/survival/death occurrences from LIFE05D `RANDOM-17` and changes only the
31/32/33-column representation.

In both stages persistent identity, the declared target and the inverse return
remain exact. Topology and view-only decisions do not. The reusable rule is:

```text
preserve identity
  -> declare the cut
  -> compare relations
  -> retain the residual
  -> abstain from carrier-level language when only the view survives
```

This is an internal calibration method, not a Prime/LIFE mechanism or an
eighth Connection Family. The canonical short record is the
[Carrier–View–Residual Finding](LABREPORTS/SYNTHESIS/NEXAH_CARRIER_VIEW_RESIDUAL_FINDING_2026-10-08.md).
Further LIFE-run replication requires a new preregistration and an explicit
cross-run-generalization question.

### 7.3 A0 findings and paper routing

The source-bound `#a0-orientation-evidence` lens now carries a documentary
finding-to-paper flow without adding a Study, Family, graph relation or active
research cycle. Sixteen existing A0 findings are routed into four distinct lanes:

1. **Paper A — SCC-003 finite quotient:** the narrow 106-vertex theorem note;
2. **Paper B — Pascal–Rosetta D30 companion:** an `R0_DOCUMENTED`, non-admitted
   design note for the typed phase lift and its negative boundaries;
3. **Paper C — Return without identity:** a parked synthesis outline over the
   closed A0-BL-021, A0-BL-035 and A0-BL-045 results;
4. **Paper D — typed archaeology:** a preparation-only provenance outline for
   Pascal/Fibonacci recurrence, seam topology and observer labels.

The operative sequence is:

```text
bounded source
  -> finding record
  -> claim ceiling
  -> paper lane or backlog
  -> independent review or Owner gate
  -> separate publication authorization
```

This routing is editorial, not evidentiary. SCC-003 remains narrow; D30 is not
inserted into its theorem; the parked outlines are not draft papers; and
Navigator visibility does not authorize submission or publication. The
controlling workspace is the
[A0 Findings and Paper Workspace](../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01/32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md).

### 7.4 A0 module and surface coverage

The A0 Book manifest currently registers **33 HTML surfaces in nine work
groups**. All 33 are bound through the existing
`NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1` lens and its already governed A0,
Number View, Orientation, Return, LIFE and Tessarec identities. The exact
mapping is machine-readable in the
[A0 Module Surface Coverage record](NAVIGATION/EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_MODULE_SURFACE_COVERAGE_V1_2026-10-14.json).

This is complete coverage, not module multiplication: it creates no new
canonical node or relation, activates no Study, promotes no evidence and
authorizes no publication. The 16 conceptual modules above therefore remain
the governed baseline.

## 8. Connection Families

The canonical `CF:F1–F7` namespace organizes relational work. It must not be
merged with the historical `HL:F1–F8` HTML shelves or the proposed
`CAND:F8_AXIS_EXTENSION`.

The Connection Families are functional lenses: they help answer what kind of
relational task a record performs. They do not define seven universal forces,
mechanisms or natural kinds. The canonical map and its exact edge boundaries
are maintained in the [Family Connection Map v2](FAMILY_CONNECTION_MAP_V2_2026-10-05.md)
and the [taxonomy crosswalk](NAVIGATION/NEXAH_TAXONOMY_CROSSWALK_V2_2026-10-05.md).

The core reading rule is:

```text
FRAMEWORK supplies shared questions.
FAMILIES organize relational functions.
OBJECTS retain their mathematics and provenance.
EVIDENCE remains local to tested records.
RELATIONS explain connection without erasing non-identity.
```

## 9. A worked route: Primegrid, Pascal and the 101 channel

The current Primegrid route is useful because it shows how several visual and
mathematical representations can be connected without declaring them one
object.

```text
BLOCK 01  finite state lift
  -> BLOCK 02  finite Fourier return
  -> BLOCK 02A  Pascal multiplicities
  -> BLOCK 02B  trinary / antipodal reading
  -> BLOCK 03  prime-address control
  -> READOUT RECONSTRUCTION / GLB GATEWAY
```

Pascal coefficients describe multiplicities of paths. Their row sums produce
powers of two, while a representation may expose fewer visible nodes than the
number of histories. The `121` bridge demonstrates that equal numerals can
encode different structures: a Pascal row, a radix reading and an `11 × 11`
grid are not identical merely because `121` occurs in each description.

The `101` channel similarly remains a declared address and route. Relations
such as `97–99–101`, doubling sequences or `3301 - 3200 = 101` may be inspected
as exact arithmetic statements or source-bound markers. They do not by
themselves establish a prime-specific coding advantage, a physical channel or
one hidden mechanism.

Block 03 is retained as a valid negative control: the tested prime-address
construction did not establish the proposed coding advantage. Retaining that
result is part of the architecture, not a failure of presentation.

## 10. A worked route: OIL/RIS Multi-Lens and reconstruction

OIL/RIS is a source-bound visual kinematic grammar:

```text
OIL = outer orbit · inner orbit · link/transfer orbit
RIS = rotation · inversion · shift
```

The current Multi-Lens fixture asks a bounded question: can several registered
lossy views reconstruct the tested finite relation state when their addresses
and overlaps agree?

In the declared fixture, aligned views can support reconstruction of the
tested relation. An incompatible address or overlap returns `ABSTAIN`. The
source remains two-fold ambiguous where the test does not distinguish its
alternatives. This is a meaningful bounded result.

It is not a recovery of orbital physics, a universal OIL/RIS operator or the
historical composition order of rotation, inversion and shift. The recovered
names, visual paths and test fixture must therefore remain separated from any
unrecovered formula.

The Readout Reconstruction module connects MRB/Pascal carriers, ACR controls,
groove/readout metaphors, reversible mixing, lossy projections, residual
reconstruction and the canonical OIL/RIS and P/Q GLB views. Its claim is about
typed representation and reconstruction paths. Visibility recovery is not
complete source recovery.

## 11. HTML, GLB and visual archaeology

The Navigator contains historical and recovered media because research
meaning can be distributed across code, diagrams, labels, interaction and 3D
scenes. Archaeology is therefore a custody process.

An incoming artifact is classified before it changes navigation:

- **master** — declared current entry for a bounded module;
- **support** — explanatory or operational companion;
- **variant** — related representation with a meaningful difference;
- **historical source** — evidence of earlier language, structure or intent;
- **custody copy** — preserved duplicate, not a new independent object;
- **candidate / deferred** — potentially relevant but not yet admitted.

A GLB is the binary form of the glTF three-dimensional interchange format. It
can preserve scene graph, meshes, transforms and animation. A registered GLB
is a representation surface, not an executable test and not additional
scientific evidence merely because it is spatial or visually rich.

The same rule applies to HTML instruments: interactivity can expose an
operator or comparison more clearly, but animation does not add samples to the
underlying evidence.

A synchronized **view adapter** must therefore publish its address rule and
loss boundary. The GAME 4 LIFE +1 reference example uses `n=g mod 8` for its
gearbox and `k=g mod 6` for two separately typed prime/channel lanes. A shared
clock is not a shared generator: source identities remain intact, collisions
and information loss stay visible, and no Navigator relation is created merely
because two readouts advance together.

The large HTML/3D estate is therefore maintained in three deliberately
different layers: the full custody atlas, the current selected catalog and the
Navigator. On 8 October the reproducible current catalog contains 53 current
3D records, 215 current HTML records and 28 grouped logical families; only 16
families are on the Science/Builder shortlist. The two IEEE-300 reports are
grouped into one existing logical family with no linked current 3D record and
no additional Navigator route.

Selection alone is still not usefulness. Every shortlisted family is now
classified as `HELPS_DECIDE`, `HELPS_TEST`, `HELPS_FIND` or `RELATED_ONLY` in
the [current usefulness and compression gate](REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/CURRENT_SELECTED_MODULE_CATALOG_2026-09-30/CURRENT_USEFULNESS_AND_COMPRESSION_GATE_2026-10-08.md).
At the current return, none of the 16 families has yet earned
`HELPS_DECIDE`. This is the explicit missing layer: further connection work is
paused until a present Human question names the decision that a result would
change.

## 12. Evidence, status and claim ceilings

A **claim ceiling** is the strongest statement a record may support inside its
declared scope. It is neither a confidence decoration nor a general permission
to transfer a result.

Every useful Navigator relation should answer five questions:

1. Which exact source and target are connected?
2. What is the mapping type: equivalence, specialization, composition,
   method, representation, analogy, provenance, non-identity or open relation?
3. Which record supplies the evidence?
4. What survives the connection?
5. What must not be inferred?

The Science Lab distinguishes at least these evidence levels:

| Level | Meaning |
|---|---|
| visual intuition | motivates a question; does not define the object |
| local definition | stipulated meaning inside one declared scope |
| formal candidate | expressible proposal not yet adopted or proved |
| implemented fixture | executable bounded object with declared inputs and outputs |
| verified component | declared test passed within its fixture and controls |
| validated application | domain-specific controlled result; does not generalize automatically |
| negative or null result | tested proposal failed, was uninformative or supported abstention |
| unresolved | source, identity, mapping or interpretation remains open |

No level silently inherits the authority of another domain. A successful
finite reconstruction does not validate an astronomical interpretation. A
historical label does not define a modern operator. A visual correspondence
does not transfer a theorem.

## 13. Controlled vocabulary

This section is an explanatory first-use glossary. The maintained
[Mathematical Foundations Glossary](../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/11_MATHEMATICAL_FOUNDATIONS_GLOSSARY.md)
remains the fuller technical source.

### Carrier

The declared object on which a representation, measurement or operator acts:
a finite state set, signal, graph, manifold, sequence or dataset. Similar
operator names on different carriers do not establish identity.

### Frame, aperture and cut

A **frame** specifies the coordinates, perspective or comparison context. An
**aperture** is the admitted window or subset through which a record is
produced. A **cut** is the declared selection or observation event. These roles
may interact but must not be treated as synonyms without an explicit map.

### Projection

A mapping from a source into a reduced, selected or visible view. Projection
does not imply invertibility, losslessness or complete source recovery.

### Reconstruction

An attempt to recover a declared state or relation from one or more views. A
reconstruction claim must state uniqueness, ambiguity, residual and failure
conditions.

### Residual

The declared difference left after a transformation, comparison or attempted
reconstruction. A residual is typed by its carrier, metric and operation; it is
not automatically noise, energy or universal remainder.

### ILAU

A compact comparison ledger:

```text
I = invariant / retained
L = lost
A = added / introduced
U = unresolved
```

ILAU classifies what happens across a declared comparison. It does not explain
cause by itself.

### Orientation Language Specification (`OLS`)

The normative semantic language at the boundary between human, record and
instrument where adopted. Navigator copy can explain OLS-facing ideas but may
not silently add normative OLS terms.

### Theory of Perspective (`TOP`)

The short cross-disciplinary name for the method-centred reading of source,
selection, representation, comparison, residual and human return. TOP is a
perspective instrument, not a new natural theory.

### Unified Transition Geometry (`UTG`)

An exploratory framework for describing boundaries, transitions, directions,
fields and returns across distinct systems. UTG is not a validated universal
geometry or proof of one shared mechanism.

### Connection Family (`CF:F1–F7`)

One of seven canonical functional lenses used by the Navigator to organize
recurring relational work. It is not the historical `HL:*` shelf system, a
candidate eighth family or a universal mechanism class.

### Envelope

A declared boundary, modulation, containment, record or stability layer around
a carrier. The particular subtype must be stated. Envelope is not one
universal mathematical object or an additional Connection Family.

### OIL/RIS

Outer orbit, inner orbit and link/transfer orbit; rotation, inversion and
shift. This is source-bound visual vocabulary, not orbital physics or a fully
recovered executable composition.

### MRB

The inherited expansion begins as **Modular Redundancy Binder**. The numbered
series later broadens into mirrors, radix, return, zipper and Pascal-thread
representations. Therefore each item must retain its functional subtitle; the
series label does not mean every case tests redundancy.

### ACR

A numbered audit series covering closure, representation, compatibility,
readout, projection and reconstruction. ACR-27 is explicitly titled **Angle
Closure & Representation Audit**. No controlled series-wide expansion has
been established, so the abbreviation remains unresolved at series level.

### `ø` — typed split/cut record

Inside the declared Multi-Lens fixture, `ø` partitions the complete source
into two disjoint branches whose union reconstructs the source. It is not the
empty-set symbol `∅`, not a universal glyph meaning and not an undeclared
operator on another carrier.

### `œ` — registered seam/transition

Inside the declared Multi-Lens fixture, `œ` joins registered views with a
compatible address and overlap. It is not a standard mathematical operator and
has no intrinsic meaning outside its fixture.

### GLB

The binary form of the glTF three-dimensional interchange format. In the
Navigator it is a registered representation surface with custody and source
metadata where verified. It is not an executable test or additional evidence
by itself.

### Claim ceiling

The strongest statement a record may support within its declared evidence and
scope. It remains visible beside objects and relations so that a reader can
follow a connection without importing a stronger claim.

## 14. What NEXAH does not claim

This handbook does not establish:

- a universal theory, geometry, operator or physical mechanism;
- identity between mathematical, visual, biological, astronomical or
  engineering systems because they share a diagram;
- new mathematics from local notation or historical glyphs;
- a prime-specific coding advantage from the Primegrid route;
- complete source recovery from a bounded or lossy view;
- public readiness, product capability or human benefit;
- ORION certification, OLS extension or Mission Control authorization;
- independent confirmation from repeated copies or multiple media;
- publication permission.

The scientifically useful proposition is narrower: declared carriers,
transformations, views, residuals, evidence and non-identities can be kept in
one inspectable navigation architecture without erasing their differences.

## 15. Reading paths

### New visitor

1. [Science Navigator Home](NAVIGATION/APP/index.html#home)
2. [About the Navigator](NAVIGATION/APP/index.html#about)
3. [Controlled Vocabulary](NAVIGATION/APP/index.html#glossary)
4. one Current Focus route
5. the evidence and claim ceiling attached to that route

### Research reader

1. [Current Total Overview](NEXAH_CURRENT_TOTAL_OVERVIEW_2026-09-18.md)
2. [Research Synthesis — Compact View](NEXAH_RESEARCH_SYNTHESIS_COMPACT_2026-09-14.md)
3. [Family Connection Map v2](FAMILY_CONNECTION_MAP_V2_2026-10-05.md)
4. package-local preregistration, result and decision records
5. [Mathematical Foundations Glossary](../RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/11_MATHEMATICAL_FOUNDATIONS_GLOSSARY.md)

### Navigator maintainer

1. [Current State and Crosswalk](NAVIGATION/NAVIGATOR_CURRENT_STATE_AND_CROSSWALK_2026-10-07.md)
2. [Entry Target Architecture](NAVIGATION/NAVIGATOR_ENTRY_TARGET_ARCHITECTURE_V1_2026-10-07.md)
3. [Capability and Connector Register](NAVIGATION/NEXAH_NAVIGATOR_CAPABILITY_AND_CONNECTOR_REGISTER_2026-10-06.md)
4. [Architecture Blueprint](NAVIGATION/NEXAH_MASTER_NAVIGATOR_ARCHITECTURE_BLUEPRINT_2026-10-05.md)
5. [Build Plan v2](NAVIGATION/NEXAH_MASTER_NAVIGATOR_BUILD_PLAN_V2_2026-10-06.md)
6. [Module Registry v2](NAVIGATION/NEXAH_MODULE_REGISTRY_V2_2026-10-05.json)

### Contributor or reviewer

1. [Contributor Onramp](CONTRIBUTOR_ONRAMP.md)
2. [Lab Constitution](LAB_CONSTITUTION.md)
3. [Run Contract](RUN_CONTRACT.md)
4. the relevant study package
5. its controls, provenance and closure record

## 16. Maintenance contract

This handbook should be updated when one of the following changes materially:

- the Science Lab or Navigator authority boundary;
- the six-domain information architecture;
- the current capability set;
- module, surface, entity or relation counts;
- the controlled first-use vocabulary;
- a canonical family or namespace;
- public admission state;
- the current worked examples.

Mechanical counts should be synchronized from validated registries. New terms
must identify their plain-language function, established or adjacent
vocabulary, NEXAH-specific usage, non-equivalences, status and controlling
source. A handbook revision may improve explanation; it may not silently
promote a scientific claim, activate a study or authorize publication.

## 17. Current conclusion

The Science Lab and Navigator now form a coherent but deliberately bounded
research environment:

- the Lab preserves questions, tests, evidence, failures and limits;
- the Navigator makes their relationships traversable;
- the glossary connects local language to established disciplines;
- the registries preserve identity, custody and lifecycle;
- the Human Owner retains authority, interpretation and publication control.

The strongest current contribution is not the assertion that all represented
systems are one. It is the opposite discipline: several views can be connected
closely enough to compare, reconstruct and learn while their carriers,
evidence and non-identities remain visible.
