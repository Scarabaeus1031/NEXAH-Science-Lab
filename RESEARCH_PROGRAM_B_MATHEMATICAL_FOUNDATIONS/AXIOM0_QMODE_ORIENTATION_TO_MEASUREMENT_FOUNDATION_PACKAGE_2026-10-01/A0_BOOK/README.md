# NEXAH A0 Book — From Distinction to Readout

Status: `LOCAL_READER_PROOF_FROZEN / DOCUMENTATION_ONLY / NOT_PUBLIC`

Operational effect: `NONE`

Milestone: `A0_READER_PROOF_2026-10-09`

Integration freeze: `A0_INTEGRATION_FREEZE_CHECK58_2026-10-13`

This directory contains a standalone guided-reading surface for the Axiom-0 / Q-Mode foundation package. It is deliberately separate from the frozen Science Navigator runtime.

The 9 October 2026 local reader proof is the first complete eight-chapter book
cut. It combines established mathematics, bounded NEXAH records, Human View
language and a small cultural layer without promoting a new scientific claim.
The proof is internally reviewable; publication and independent reader testing
remain separate Owner decisions.

## Entry

- [A0 ASSET INDEX](A0_ASSET_INDEX.html) — searchable internal workspace inventory with visual HTML previews and direct routes to source assets
- [A0 Science Desk](A0_RESEARCH_DESK.html) — primary A0 entry
- [A0 Scientific Position](A0_SCIENTIFIC_POSITION_REPORT.html) — Assessment vom 13. Oktober mit Currentness Addendum vom 16. Oktober
- [Aperture Journey](A0_NEXAH_APERTURE_JOURNEY.html) — primärer geführter Human-Lesepfad
- [Living Blueprint](A0_LIVING_BLUEPRINT.html) — ruhige Human-/Systemkarte
- [A0 Book](index.html) — eight-chapter Foundation reader
- [Laboratory Orientation Machine](LAB_ORIENTATION_MACHINE.html) — direct visual orientation instrument
- [Axial Carrier Adapter Suite](A0_AXIAL_CARRIER_ADAPTER_SUITE.html) — shared Temporal-Z adapter for all six internal flagships

## Workspace inventory

`A0_ASSET_INDEX.html` is the internal repository map for this directory. It
indexes the complete local A0 Book tree, renders lazy header previews for all
other HTML surfaces and filters assets by title, path, work, repository role
and format. It is a navigation instrument inside the existing A0 identity,
not a public sitemap, publication surface, new Study or evidence authority.

Rebuild the machine-readable inventory after adding, moving or renaming an
asset:

```sh
node build_a0_asset_index.mjs
```

The generator writes `assets/a0-asset-index-v1.json` and the file-compatible
`assets/a0-asset-index-v1.js`. The registered-surface count remains governed
by `A0_BOOK_MANIFEST.json` and the Navigator coverage sidecar rather than by
raw file discovery.

## Reader consolidation · 16 October 2026

The shared header now exposes three typed reading intentions instead of a flat
list of equally weighted pages:

- **Human** begins with only two primary choices: Aperture Journey and Living
  Blueprint. Rainbow / Purple Rain, Observer Lens, The Living Interior, Black
  Sun / Big Moon, NEON / Trap Door and Blue / Pink Cell Return remain stable
  source-bound deep links, but are presented as scenes inside the journey.
- **Science** begins at the A0 Science Desk, which remains the A0 scientific
  authority. Scientific Position and OCB currentness sit directly below that
  entrance; A0 Science, Research Method and About / Method are ordered as
  introduction, guided method and deeper method map.
- **Builder** keeps the full Blue Body, OCB, AXIS08, Countershot, Ihara and
  related instruments. Visual Field Library and Asset Index are subordinate
  indices rather than Human entrances.

No HTML surface is deleted, merged or given a new identity. The change reduces
competing entrances while preserving all registered paths, provenance and
claim boundaries. Achievements are reachable from every shared Reader header
and have a compact A0 return inside the Science Desk.

The Science Desk now frames A0 as one series with four reader works, three
separate paper essences and one Research Desk before
the cultural Record / Play scene and the formal `00 · Introduction` promise:

1. **Science Research Desk** — the primary Science entrance with two method subpages, three stable reading lenses, five internal flagships in development, field metadata, protocols, findings, Backlog Ledger, log and sources; its **About / Method** page is the Big Map connecting method steps to the frozen Toolbox, evidence layers, software instruments, Builder lanes, bounded Machine assembly and the existing A0 joints;
2. **A0 Book** — the eight-chapter guided introduction;
3. **Mathfield** — the mathematical workshop for definitions, finite carriers, operators, joints and exact instruments;
4. **Pascal Joint** — the focused Pascal/Pentagon case and its instruments;
5. **SCC-003 Paper** — Paper A, a narrow mathematical essence;
6. **Return Paper** — Paper C, an evidence-bound synthesis of typed Return, representation recovery and identity boundaries;
7. **Method White Paper** — Paper E, the NEXAH Family Method, source-bound Records, declared Joints, Grey Lens and Human Return, with the full working draft folded behind the short Essence view;
8. **Science Research Desk** — status, routing, paper boundaries, backlog and current research control.

The works, papers and Desk are sibling reading surfaces inside A0, not chapters
of one book and not new scientific identities. Papers are intentionally
separate from works: each preserves a research line considered worth pursuing
toward publication, while retaining its review and publication boundary.
Boundary Graph, Generation Corner and comparable
interactive surfaces remain instruments inside the works. The persistent
header groups them by Human, Science and Builder intent; the breadcrumb
identifies the current lane and surface, while subordinate sections preserve
work-local pages and declared external sources.

`A0_GAME_4_LIFE_PLUS_1.html` extends the existing
`ART:A0:MATHEMATICAL_JOINTS` reader identity and points back to the closed
LIFE08 carrier. It is an editorial and instrumental addendum, not a ninth
chapter, reopened Study, new Conway rule, quaternionic Life mechanism,
cross-domain law or publication release.

The entry now begins with a two-route editorial switch: first-time readers
follow Record / Play into the eight-chapter journey, while returning readers
may enter the current research window directly. This is navigation inside the
existing A0 identity, not a second edition or research object.

The entry also carries a compact **A0 Forschung aktuell** surface and routes
returning readers to the [Science Research Desk](A0_RESEARCH_DESK.html). The
Desk is the broader Science front door: Science, Builder and Human are stable
reading lenses; A0 Foundation, NCS Return & Clockwork, GAME 4 LIFE +1,
Three-Domain Transition Test and IEEE300 Graph-to-Grid are existing flagship
routes; disciplinary homes remain controlled metadata in the Subject Overview.
The A0 works and underwindows remain the Foundation layer below that entrance.
The Desk does not replace Mission Control, the Lab Register or package-local
reports.

The protocol hierarchy is recorded in
[`33_A0_WORK_PROTOCOLS_2026-10-11.md`](../33_A0_WORK_PROTOCOLS_2026-10-11.md):
one A0 master protocol plus work protocols for the A0 Book, Mathfield, Pascal
Joint, GAME 4 LIFE +1 and Paper / Review. Underwindows inherit the protocol of
their owning work; an additional HTML surface does not create a new Study or
protocol identity. The full chronological source remains
[`22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md`](../22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md).

After this framing, the cultural opening makes the first conceptual transition
explicit: lived experience becomes a bounded record; the Introduction then
names the mathematical questions and the limits of what the book claims.

The reader-facing header links to [nexah.de](https://nexah.de/) rather than to
an internal package README. Science Navigator links are normalized to the
local Navigator preview on port `8878`: local `file://` review uses
`127.0.0.1`, while HTTP review uses the current host. The Navigator preview
must therefore be running. This keeps the Book and Navigator distinct while
avoiding browser restrictions on cross-file navigation and making the
reciprocal route—and the LIFE lineage—usable in both review modes.

## Current chapters

- [Chapter 01 — From Line to Readout](01_FROM_LINE_TO_READOUT.html)
- [Chapter 02 — Point, Line and Coordinate](02_POINT_LINE_COORDINATE.html)
- [Chapter 03 — Three Positions, Seam and Return](03_THREE_POSITIONS_SEAM_RETURN.html)
- [Chapter 04 — Discrete Carriers and Neighborhoods](04_DISCRETE_CARRIERS_NEIGHBORHOODS.html)
- [Chapter 05 — Dynamics, Transition and Stability](05_DYNAMICS_TRANSITION_STABILITY.html)
- [Chapter 06 — Projection, Fourier and Shadows](06_PROJECTION_FOURIER_SHADOWS.html)
- [Chapter 07 — Evidence, Comparison and Decision](07_EVIDENCE_COMPARISON_DECISION.html)
- [Chapter 08 — Return: One Carrier, Seven Questions](08_RETURN_ONE_CARRIER_SEVEN_QUESTIONS.html)

Chapter 08 links one complementary Lab instrument:

- [Orientation Machine](LAB_ORIENTATION_MACHINE.html) — byte-preserved copy of the inventoried `HTML_INSTRUMENT / MASTER_ORIENTATION_FAMILY` source (`SHA-256 e614584e…be760`); visual/instrument representation, not scientific proof.
- [Navigator ILAU lens](../../../SCIENCE_LAB/NAVIGATION/APP/index.html#ilau-orientation) — three curated HTML instruments bound to one validated Evidence Binder; no registry or family-count change.

## Cultural and interactive layer

- [A0 Living Blueprint — UTG/A0 orientation map, interactive concept spine and application crosswalk](A0_LIVING_BLUEPRINT.html#integration-crosswalk) — typed hierarchy from the existing UTG framework roof through A0, Mathematical Joints and the Pascal–Pentagon case to SCC-003, followed by the read-only route from Carrier and Aperture through Projection, Blue Body, Envelope, Seam and candidate Channel to typed Return. Its two-story crosswalk links the implemented Blue Body `16×3` interior adapter with the implemented GAME 4 LIFE +1 negative transfer control. The first supplies four synchronized views and exact Return; the second maps 48 keys to an `8×6` one-hot display, then shows why unchanged `B3/S23` requires the retained Source Key. No Study, graph relation, gate closure or publication state is created.
- The opening Record / Play scene makes `source -> cut -> record -> replay`
  graspable through a locally hosted 3D object.
- Chapter 06 uses the Crystal View only where projection and conditioned
  appearance become the subject.
- Chapter 08 uses Rooms of the Machine as a closing atlas, not as evidence or
  a unified mechanism.
- Both GLBs are available as downloads. Their source notes, SHA-256 bindings
  and non-claims are recorded in [`assets/3d/MANIFEST.json`](assets/3d/MANIFEST.json).
- The local viewer library and its licence are stored under `assets/vendor/`;
  the book does not require a remote runtime.

## Internal field notes

- [A0 Forschungsprotokoll — Buch, Rahmen und offene Gedanken](../22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md) — living prose workspace behind the frozen reader proof. It summarizes the book and research frame, records what is present and missing, and receives developing thoughts before any separate decision about a chapter, Study or HTML instrument.
- [A0 Findings and Paper Workspace](../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md) — documentary editorial router for bounded findings, the existing SCC-003 paper, the separate Pascal–Rosetta D30 companion draft and parked synthesis outlines. It creates no Study, paper claim, Navigator identity or publication state.
- [Pascal–Rosetta D30 companion paper draft](../33_A0_PASCAL_ROSETTA_D30_COMPANION_PAPER_DRAFT_2026-10-11.md) — an `R0_DOCUMENTED` formal-design note for `A0-BL-023 / 051`. It explains relational quotient return, the five-register partial D30 lift, old-gear non-factorization and the H3/E8 selection boundary without treating the fixture as an admitted result.
- [FIELD NOTES A0 — Void, mirror center and the 101 → 202 → 404 ladder](FIELD_NOTES_A0.md) — source-bound working note; not a chapter and not reader-facing.
- [Pentagon Double-Cover / Tube-Gate Engineering Test Package](../91_A0_PENTAGON_DOUBLE_COVER_TUBE_GATE_ENGINEERING_TEST_PACKAGE_2026-10-15.md) — source-bound A0 workbench for the two-sheet `C10 -> C5` proposal. Thirty-five finite checks bind the five `20=C(6,3)` anchors, their ten-spoke umbrella lift, paired `D1..D5 / E1..E5` sheet registers, two gate edges, one-bit Return, D30 phase separation, the typed `24` cross-carrier controls and the Hashimoto length-five-to-length-ten cycle signature without creating a Lab, `PENT-08`, geometric tiling or physical tube claim.
- [Mobile thread reconstruction — Mathematical Fieldbook and domain lanes](MOBILE_THREAD_RECONSTRUCTION_2026-10-09.md) — edited reconstruction of the mobile continuation; records the interview origin, mathematical and physics lanes, actual research subject and provisional Physics–Biology–Chemistry architecture; not a verbatim transcript or claim promotion.
- [A0 Fields and Joints Atlas — interactive HTML](A0_FIELDS_AND_JOINTS_ATLAS.html) · [documentary source record](../20_A0_FIELDS_AND_JOINTS_ATLAS_2026-10-10.md) — connected map of fields, mathematical views, typed joints, a joint builder, the initial ledger and source boundaries. This is a post-milestone companion, not a ninth chapter; it reuses the existing A0 package identity and has no Navigator or scientific-admission effect.
  Its Pattern Masterplate and four related HTML instruments are available as
  byte-identical local reading copies. NEXAH Core remains their source authority;
  paths, SHA-256 bindings and claim boundaries are recorded in
  [`assets/fields-and-joints/MANIFEST.json`](assets/fields-and-joints/MANIFEST.json).
- [A0 Mathematical Joints — Q°, FP/RR/OE and the Grid Interaction Atlas](A0_MATHEMATICAL_JOINTS.html) · [documentary source record](../21_A0_MATHEMATICAL_JOINTS_11_GRID_ORIENTATION_2026-10-10.md) — a narrow drill-down inside the mathematical field. It rebuilds the Q° switchyard as HTML, separates the current Q° observation-state definition from historical operator language, connects the verified 111×111 arithmetic result to a typed atlas of address grids, residue seams, the bounded C5/C6-in-C30 phase cover, envelopes and an explicitly open coupled-channel contract. Its former reader-facing global log now hands off to the Research Desk; the canonical master protocol remains unchanged. No new experiment was executed; source copies and hashes are recorded in [`assets/mathematical-joints/MANIFEST.json`](assets/mathematical-joints/MANIFEST.json).
- [A0 Pascal–Pentagon Operator Joints](A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html) · [successor source and placement record](../23_A0_PASCAL_PENTAGON_OPERATOR_JOINTS_2026-10-10.md) — post-milestone reading bridge for the executed PENT-01–PENT-07 and Pascal–Quaternion tests. Its new A0 entrance reads the 2 July 2026 Five-Stacks, Nine-Groups, Observer-Architecture and Universal-Ledger plates as bounded historical maps under the question `ONE SYSTEM. MANY LAYERS. INFINITE EXPRESSIONS.` It separates vertical stacks from horizontal themes, audits `540`, `14` and the exact Hardy–Ramanujan identity `1729=1³+12³=9³+10³`, and provides a typed residual calculator without promoting the ledger to a conservation law. The surface then connects the 106-node `D5` quotient, metric pentagon, 3D bipyramid, `H2 + A1` roots, dynamic boundary, `C30` phase cover and negative coupling controls without turning them into a new canonical Family. It also translates the historical six-operator/elevator plate into a typed `4×2×2=16` state product and corrects the supplied scalar phase model to the four-state cycle `sin → cos → −sin → −cos → sin`. All six owner-supplied visuals are preserved with hashes and non-claim boundaries in [`assets/pascal-pentagon-joints/MANIFEST.json`](assets/pascal-pentagon-joints/MANIFEST.json). The frozen eight-chapter proof remains the historical 9 October cut.
- [Mathfield Paper — A cyclic five-face quotient of depth-six Pascal carriers](A0_SCC_003_PASCAL_PENTAGON_PAPER.html) · [source paper draft](../25_A0_SCC_003_PASCAL_PENTAGON_PAPER_DRAFT_2026-10-10.md) — a separate, narrow reading surface for `SCC-003`, directly reachable from the A0 Mathfield. It compacts the definition, `28,49,70,91,112 -> 106` proof, facewise recurrence, exact typed `D5` action, canonical reference object and coverage-limited prior-art comparison into one mathematics note. It reuses the existing `SCC-003 / A0OE:PASCAL_PENTAGON_D5_TEST` identity; it is not a new experiment, generalized family, submission, novelty determination or publication authorization.
- [SCC-003 External Review Packet](../56_SCC_003_EXTERNAL_REVIEW_PACKET_2026-10-13/README.md) — Owner-authorized frozen handoff containing the narrow paper, formal specification, proofs, complete 106-node reference export, independent verifier, bounded prior-art audit, claim table and review form. The packet is validated but not sent or public; a named qualified recipient remains required, and no novelty or publication status changes before the review returns.
- [A0 Boundary Graph · Pascal Joint Demonstrator](A0_BOUNDARY_GRAPH_DEMONSTRATOR.html) — interactive reader-facing view for A0-BL-031. It maps the exact decomposition `(B+a)(B+b)=B²+Bb+aB+ab` between four rectangle fields, typed seam/pillar records, one hinge and an adjacency graph. Its fourth view declares `n=a+b` and displays the exact Pascal mirror pair `C(n,a)=C(n,b)` while keeping rectangle areas and Pascal multiplicities distinct. It reuses `ART:A0:MATHEMATICAL_JOINTS`, `MOD:NUMBER_VIEW_SUITE` and `ART:NUMBER:PRIMEGRID_BLOCK02A_PASCAL`; it is not a new Study, Run, selector, E8 identity or physical channel model.
- [A0 Q4 Magic-Square Joint Audit](A0_Q4_MAGIC_SQUARE_JOINT_AUDIT.html) — companion view for A0-BL-031. It identifies the sixteen labels with `Q4` through `v=x−1`, tests the complement involution against Dürer's planar `R180` placement and the Khajuraho square's toroidal `T(2,2)` placement, exposes the Pascal-4 fibers `1,4,6,4,1`, and keeps a separate factorization audit for `1771`, `4774`, `717717` and user-entered decimal words. The view corrects `5915+49` to `5964`; historical `4774`/Purple-Split language remains provenance only and is not promoted.

- [A0 Paper C — Return without identity](A0_RETURN_WITHOUT_IDENTITY_PAPER.html) · [source manuscript](../34_A0_RETURN_WITHOUT_IDENTITY_PAPER_DRAFT_2026-10-11.md) — a source-bound synthesis over five closed A0 Studies. Two code-native figures state the typed Return hierarchy and exact quaternion `C3` connector; a governed HTML atlas links Record/Play, Return/Residual, Knot/Rope and Gap/Return as illustrative sources only. The Labreports remain authoritative. This is not a new Study, Family, module, route, mechanism, submission or publication authorization.
- [A0 Paper E — NEXAH Family Method](A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html) · [full working draft](../35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md) — a concise internal White Paper separating bounded results, functional models, working hypotheses and parked tests. It links the Family Atlas and existing HTML instruments, while keeping the complete draft available as a folded appendix. It reuses the A0 package identity and creates no Study, Family, Navigator identity, activation or publication authority.
- [A0 Joint Application Demonstrator](A0_JOINT_APPLICATION_DEMONSTRATOR.html) · [RATH 49/51, Phi-5 and Shadow source audit](../52_A0_RATH_49_51_PHI5_SHADOW_JOINT_SOURCE_AUDIT_2026-10-13.md) · [CRT/QRT, Palindrome and Return engineering check](../53_A0_CRT_QRT_PALINDROME_RETURN_JOINT_ENGINEERING_CHECK_2026-10-13.md) · [Joint Application Return Protocol Suite](../54_A0_JOINT_APPLICATION_RETURN_PROTOCOL_SUITE_2026-10-13.md) — reader-facing application surface for Checks 37–54. It turns the shadow fiber, Totient profiles, CRT/QRT reconstruction, palindrome closure, collision preimages, return witnesses and source-audit controls into inspectable joints. The RATH extension preserves the exact chain `49=7²`, `φ(49)=42`, `49−42=7`; the address laboratory demonstrates unique four-coordinate CRT return, a 13-candidate `mod 13` withholding control and the common QRT `r=17` column without carrier collapse. The palindrome laboratory compares `404+707=1111`, the negative control `444+767=1211` and the neighbor `444+777=1221` over the complete frozen population of 90 three-digit palindromes. Check 54 freezes ten applications in `A0:JARP:V1`, validates 52 assertions and exposes one result vocabulary for exact returns, exact profiles, negative controls, missing witnesses and rejected namespace collapse. The typed JSON composer and protocol runner make these views reusable without turning them into a physical mechanism or new Study; one internal source-bound NN evidence lens records the return path without changing canonical module or family counts.
- [A0 Scientific Position Report](A0_SCIENTIFIC_POSITION_REPORT.html) · [full literature-informed assessment](../55_A0_SCIENTIFIC_POSITION_AND_NOVELTY_ASSESSMENT_2026-10-13.md) — a documentary evaluation of where the research now stands. The HTML view keeps the 13 October assessment baseline and adds a 16 October currentness layer for OCB v0.11.0, 50/50 registered-surface binding and Reader consolidation. It distinguishes exact result, novelty candidate, established mathematical neighborhood, internal instrument, post-hoc number fixture, empirical evidence and unsupported physical interpretation. Its main verdict remains `FORMAL RESULTS PRESENT / NOVELTY CANDIDATES PRESENT / EXTERNAL NOVELTY NOT ESTABLISHED`; SCC-003 is the strongest current mathematical novelty candidate, while Paper C is positioned as a methods synthesis and JARP as an unvalidated internal research instrument. The report reuses the A0 identity and recommends one external SCC-003 review package without activating or authorizing it.

- [Tessarec Blue Body · Fold/Contact extension](A0_TESSAREC_BLUE_BODY_LAB.html#fold-contact) · [Check 63](../63_A0_TESSAREC_PENTAGON_FOLD_CONTACT_AND_A7_ROOT7_GUARD_2026-10-13.md) — extends the existing flagship with a four-wall square-box fold operator, a separate triangular/kite branch, an animated `OPEN / TOUCH / OVERLAP_TUCK` contact cycle and the exact closure threshold `phi/sqrt(2)`. Number labels `1111/3333/4444/7777` remain a Totient sidecar; A7 and the existing Root7 lens are explicitly nonidentical namespaces. This is a bounded engineering demonstrator, not a new surface, Study, Navigator identity or physical realization.
- [Blue / Pink Dodeca Cell Return](A0_BLUE_PINK_DODECA_CELL_RETURN.html#cells) · [3D Pentagon Body Player](A0_TESSAREC_BLUE_BODY_LAB.html#pentagon-body-player) — two linked projections of the existing `MOD:TESSAREC` body family. The first exposes Day/Blue and Night/Pink simultaneously as four H3 satellite bodies plus one central Return body with `4×12+12=60` selectable pentagonal face slots. The second drives the existing 48-state record through eleven complete sequence schedules, a rotatable body, three live pentagon layers, an `8×6` LIFE projection, a synchronized Blue/Pink shell, a Q4 House ledger and a typed Return trace. Its Ihara C5 inner-ring relay is a bounded non-backtracking cycle adapter; the Fibonacci extension reuses the deterministic `u_k=frac(k/φ)` schedule as a rank-quantized switch; the coupled extension exposes `exp(2πiu_k)` as Euler circle phase and then applies the existing `×7 mod 48` permutation; and the Rose extension applies the exact `+2 mod 5` pentagram orbit on every declared C5 ring. The visible Fibonacci–Euler regularity is construction-bound, while the owner-visual labels `13`, `157`, `2041` and Venus are provenance only. The House types `Pillar=vertex`, `Channel=edge` and `Hinge=incidence`, while its Kite remains the declared `A2 → 3-fold` hypothesis. The historical Q° One-Pillar sources motivate only the View/Mirror display axis. These source-bound demonstrators do not establish carrier identity, a deeper Fibonacci–Euler generator, a natural Fibonacci law, a Venus relation, a canonical VM operator, natural common body dynamics, physical mechanism, packing or tiling theorem.
- [Fibonacci Ring Operator Comparator figure](results/a0-fibonacci-ring-operator-comparator-r1-figure-2026-10-14.svg) · [Check 87 protocol](../87_A0_FIBONACCI_RING_OPERATOR_COMPARATOR_PROTOCOL_2026-10-14.md) · [Check 88 result](../88_A0_FIBONACCI_RING_OPERATOR_COMPARATOR_RESULT_2026-10-14.md) — separates grid address `(1,1)` from decimal scalar `1.1`, verifies `1.1²=1.21` and `1.1×3.68=4.048`, then compares matched uniform, Fibonacci and seeded-random schedules. The deterministic synthetic fixture ranks `UNIFORM < FIBONACCI < SEEDED_RANDOM`; it is an engineering preflight and does not close scientific `G6_SAMPLING`.

The current Point 03 and the Pascal–Pentagon companion now embed the registered Core explorer as two book projections of the same PENT-01–PENT-07 source-bound instrument. Neither projection is PENT-08, a new run or a second evidence identity.

Open work is preserved in the [A0 Research Backlog and Open Joints](../24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md) and exposed through its read-only [A0 Backlog HTML projection](A0_RESEARCH_BACKLOG.html). The projection is now an underwindow of the [A0 Research Desk](A0_RESEARCH_DESK.html#backlog); its filters, counts and statements remain intact. It is a preparation-only subledger of Mission Control's existing `Relational identifiability under representation change` backlog, not an active queue or new Study.

The chapters present established mathematics, exact NEXAH records and open NEXAH interpretations in parallel Science View and Human View language.

## Reader-facing source policy

- One visible primary artifact per section.
- At most one directly complementary HTML or GLB when it materially improves understanding.
- Further related modules are grouped behind the Science Navigator instead of being presented as a link catalogue.
- Primary records are shown in the chapter whenever practical; the Navigator remains the route into the wider evidence landscape.

## Boundary

- This is not a new theory of physics.
- Visual analogy is not evidence.
- LIFE, grids and number structures are worked records, not identity claims.
- Admission to the Science Navigator requires a separate successor-build decision.
- The local reader proof is not a publication, independent reader return,
  Human-utility result or evidence of a universal NEXAH theory.

## Freeze

- [Milestone record](MILESTONE_A0_READER_PROOF_2026-10-09.md)
- [SHA-256 manifest](MILESTONE_SHA256.txt)
- [Check 58 integration-freeze record](FREEZE_A0_INTEGRATION_CHECK58_2026-10-13.md)
- [Check 58 machine-readable SHA-256 manifest](A0_INTEGRATION_CHECK58_FREEZE_MANIFEST.json)

The Check 58 freeze closes the current integration pass at 32/32 registered
HTML surfaces, zero dead local links and complete Work / Source / Status /
Claim-Boundary metadata. It binds the Orientation Machine, JARP, RATH,
Totient, Temporal Z and the shared Axial Carrier Adapter as visible A0
instruments. The freeze does not activate a Study, create a new scientific
identity, establish a physical mechanism or authorize publication.

## Integration contract

The book may link outward to existing evidence and navigation surfaces. Check
58 is returned to the existing Navigator A0 evidence lens and to Mission
Control as a source-bound documentary update; canonical entity and relation
counts remain unchanged.
