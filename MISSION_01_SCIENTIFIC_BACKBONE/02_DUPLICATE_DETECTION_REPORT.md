# Duplicate Detection Report

## Decision rule

A duplicate is not necessarily identical text. It is a label that claims operator-level independence while its observable behavior is already covered by a retained primitive, a concept/declaration, or a narrower implementation function.

Historical material should be preserved. Duplicate status changes navigation and naming, not provenance.

## A. Canonical Library Registry: 17 controlled visual concepts

The Registry is authoritative for Library identity. OLS is authoritative for primitive semantics. The 17 Registry records can remain controlled visual concepts, but they should not be presented as a second primitive operator inventory.

| Registry ID | Current name | Reduced interpretation | Canonical destination | Maturity |
|---|---|---|---|---|
| NX-OP-0001 | Circle | Visual topology/motif: center, extent, return | REPRESENT; cyclic relation as declared structure | DUPLICATE |
| NX-OP-0002 | Aperture | Selective frame or admissibility boundary | SELECT + context/position; sometimes REPRESENT | DUPLICATE |
| NX-OP-0003 | Observer | Situated semantic role, not an operation | OLS `observer` concept + OBSERVE | DUPLICATE |
| NX-OP-0004 | Needle | Directional indicator | ORIENT output or REPRESENTed vector | DUPLICATE |
| NX-OP-0005 | Transition | Declared change between states, explicitly not an invocation | OLS `transition` concept; TRANSFORM only when intentional contract applies | DUPLICATE |
| NX-OP-0006 | Boundary | Scoped limit record or declaration | context/authority/validity declarations; BoundaryRecord candidate | DUPLICATE |
| NX-OP-0007 | Memory | Capacity or persistence motif | RECORD; experiential learning remains separate | DUPLICATE |
| NX-OP-0008 | Bridge | Declared relation or representation map | relation concept; REPRESENT/TRANSFORM specialization | DUPLICATE |
| NX-OP-0009 | Field | Representation or context carrier | REPRESENT + context; domain-specific field mathematics where declared | DUPLICATE |
| NX-OP-0010 | Orientation | Product and semantic concept | ORIENT | DUPLICATE |
| NX-OP-0011 | Relation | Declared association | OLS `relation` concept; COMPARE may inspect it | DUPLICATE |
| NX-OP-0012 | Projection | Partial or lossy representation map | REPRESENT or TRANSFORM specialization | DUPLICATE |
| NX-OP-0013 | Fold | Form-change specialization | TRANSFORM | DUPLICATE |
| NX-OP-0014 | Gradient | Ordered difference represented over a field | OLS `difference` + REPRESENT/COMPARE | DUPLICATE |
| NX-OP-0015 | Navigation | Orient plus optional bounded selection | ORIENT + SELECT | DUPLICATE |
| NX-OP-0016 | Janus | Complementary-perspective visual principle | COMPARE; distinct from Janus DCO | DUPLICATE |
| NX-OP-0017 | Scale | Declaration affecting interpretation | OLS `scale` declaration | DUPLICATE |

Recommendation: keep IDs and source-Work links for compatibility. Add a field such as `semantic_kind: visual_concept` and a `canonical_semantic_refs` list. Do not rename or delete the Registry records in the first simplification pass.

## B. Work-level Move vocabulary

Operator Recurrence Review 02 independently recovered function families but explicitly denied canonical authority and a fixed grammar.

| Work labels | Reduced family | Destination | Maturity |
|---|---|---|---|
| Observe, Sense, Witness | situated attention | OBSERVE; distinctions can remain as domain verbs | DUPLICATE |
| Connect, Bridge, Pair, Interweave | relation formation | relation concept; REPRESENT | DUPLICATE |
| Rotate, Move, Orbit | directional reference change | TRANSFORM specialization | DUPLICATE |
| Mirror, Reflect, Dual | counterpart comparison | COMPARE or TRANSFORM, depending on behavior | DUPLICATE |
| Flip, Twist, Inside/Outside, Exchange | sidedness/form change | TRANSFORM specializations; do not merge their geometry | DUPLICATE |
| Fold, Compact, Contain | form transformation | TRANSFORM | DUPLICATE |
| Project, Map, Translate | representation change | REPRESENT/TRANSFORM | DUPLICATE |
| Resonate, Align, Amplify, Coherence | alignment family | COMPARE plus a declared domain measure | DUPLICATE |
| Return, Re-enter, Homecoming, Release | cyclic continuity | process/transition structure; not one operator | DUPLICATE |
| Adapt, Co-orient, Response | reciprocal development | relations plus domain transitions | DUPLICATE |
| Remember, Trace | persistence | RECORD or provenance | DUPLICATE |
| Zoom, Scale | level change | scale declaration + TRANSFORM | DUPLICATE |
| Choose, Combine, Stack, Apply | composition meta-function | SELECT and OLS composition rules | DUPLICATE |
| Emerge | usually an outcome, sometimes a Work verb | do not promote | OBSOLETE as a base Move claim |

Preserve counterexamples: reflection is not reversal; relation is not co-orientation; return is not release; resonance labels do not establish one mechanism.

## C. Atlas Operator Framework: Q → S → P → J → H → N

The source document says these are conceptual reconstruction layers rather than strictly defined numerical operators. Treat the chain as a historical pipeline architecture.

| Label | Existing function | Reduced destination | Maturity |
|---|---|---|---|
| Q — Ground | Declare admissible operating space | context, constraints, representation domain | OBSOLETE as operator |
| S — Seed | Declare initial state | state, identity, time/position input | OBSOLETE as operator |
| P — Partition | Construct coherent-domain representation | REPRESENT; implementation clustering/partition function | DUPLICATE |
| J — Janus | Reconstruct transitions/boundaries in the Atlas document | REPRESENT + COMPARE; name conflicts with JANUS principle and DCO | OBSOLETE |
| H — Hamilton Transport | Reconstruct corridors/skeletons/spines | REPRESENT; domain algorithm suite | DUPLICATE |
| N — Nexah Reconstruction | Aggregate traces into an Atlas | REPRESENT → ORIENT composition | DUPLICATE |

The chain should remain cited as experimental history. It should not be the canonical Operator Atlas because it conflates declarations, inputs, algorithms, outputs, and semantic operations.

## D. Gate naming

| Label | Finding | Decision | Maturity |
|---|---|---|---|
| gate | region or structural feature | retain as domain concept | WORKING |
| Gate Operator / Unified Gate Operator | scalar instability score | rename canonically to **Gate Instability Measure** | WORKING |
| transition detector | contradicted by later ablation evidence | remove from current summaries; preserve historically | OBSOLETE |
| gate activation / gate probability | not supplied by `G(x)` alone | require separate model and validation | SPECULATIVE |

## E. JANUS naming collision

Three identities are already separated by architecture and must remain separate:

| Identity | Function | Decision | Maturity |
|---|---|---|---|
| JANUS | complementary-perspective principle | visual/architectural concept, not a numeric operator | DUPLICATE at primitive level |
| Janus Bridge | planned representation translation | keep as architecture candidate; define loss and round-trip tests before implementation | SPECULATIVE |
| Janus Directional Coherence Measure | forward/backward local-difference comparison | retain under research namespace | SPECULATIVE |

The Atlas Framework's `J` and historical Rope/Aperture/Transition uses should not acquire this third identity without an explicit contract and migration note.

## F. Frozen IEEE Geometry measurements

The six v1 functions are implemented, deterministic, failure-aware, and useful. They are local measurement functions, not cross-repository semantic primitives.

| ID | Reduced class | Status |
|---|---|---|
| adjacent-displacement-v1 | representation-specific metric evaluation | WORKING |
| normalized-local-drift-v1 | displacement normalized by declared parameter spacing | WORKING |
| campaign-path-length-v1 | cumulative path functional | WORKING |
| direction-change-v1 | local directional comparison | WORKING |
| discrete-curvature-v1 | derived local curvature estimate | WORKING |
| distance-to-last-converged-v1 | sampled solver-boundary distance | WORKING |

Keep them in the IEEE application manifest. Reference `OP-COMPARE`, `OP-REPRESENT`, or `OP-VALIDATE` only when the corresponding OLS contract is actually invoked.

## G. Historical names to freeze

The following labels occur in exploratory or Work material but do not have a current cross-repository contract: Wonder Operator, Butterfly Operator, Question Operator, Compass Operator, Regime Operator, Transition Manifold Operator, Branch Selection Operator, Slice Operator, multi-operator π/φ/√2 controls, JANUS Rope Operator, Aperture Gate Operator, and similar versioned variants.

Disposition:

- preserve in their existing files;
- exclude from current operator indexes;
- label `historical`, `work_vocabulary`, or `research_candidate` at the directory/index level;
- do not create new canonical definitions merely to normalize old names.

## Canonical visual decision

One current visual should represent each retained layer:

1. OLS universal process: one five-stage contract diagram.
2. Profile operators: one ownership table, not five decorative variants.
3. Gate Instability Measure: `nexah_unified_gate_operator_v25.png`, with the corrected instability-only caption.
4. Janus DCO: one equation-and-input diagram after its contract is frozen; no current visual is yet designated canonical.

All other visual variants remain evidence or history, not navigation surfaces.
