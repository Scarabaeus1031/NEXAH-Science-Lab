# Navigator v2 — Representation Ledger and Resolution Ladder

**Date:** `2026-10-07`

**Status:** `ASSESSMENT_ONLY / NAVIGATOR_V1_FROZEN / STRUCTURED_PROVENANCE_CANDIDATE / NO_VALIDATOR_AUTHORIZATION / NO_PROMOTION`

## 1. Question

This note records two connected observations:

1. the frozen Navigator can connect heterogeneous HTML surfaces and modules
   coherently without asserting that they are identical; and
2. the missing visible layer may be the NEXAH **Representation Ledger** — the
   accounting record for what every transformation preserves, loses, adds,
   collides, leaves uncertain and returns.

It also examines the related owner hypothesis that NEXAH starts from discrete
states or addresses and introduces probabilistic weights as observations become
finer or more numerous.

## 2. Scoped coherence statement

The strongest statement currently supported is:

> Within the frozen Navigator v1 corpus, registered entities retain stable
> identities, registered relations carry typed explanations and claim
> boundaries, and representational connection does not imply module,
> mechanism or evidence identity.

This is an architectural statement, not yet a universal statement about every
HTML file in every NEXAH repository. The frozen baseline covers the governed
Navigator corpus: 15 conceptual modules, 42 registered module surfaces, the
140/140 inventoried HTML source catalog, 170 internal entities and 23 typed
relations. Material outside that declared corpus remains archive, intake,
candidate or unreviewed material until separately registered.

The statement can later be tested through:

- referential integrity of every registered relation;
- presence of a source-owned explanation and claim ceiling;
- explicit `non-identity` or `does_not_imply` boundaries;
- absence of silent evidence transfer;
- preservation of open, negative and unresolved results;
- reconstruction of routes by a reader without folder knowledge.

## 3. The Ledger exists — but is not a Navigator layer

The repository contains a substantial Representation Ledger programme through
Schema V2, V3 bounded revision and a final independent review.

Its record model already covers:

- source, operator and target boundaries;
- atomic, composite and unresolved edges;
- preservation, loss and collision claims;
- uncertainty and invertibility;
- task relevance;
- evidence and provenance;
- assertion scope: whole edge, component, subpath, derived projection or
  unresolved scope;
- five separate epistemic dimensions: implementation, execution,
  reproducibility, provenance and claim support;
- versioned claims and negative-history retention.

The final independent review did **not** authorize the stronger validator
path. It found a blocking cross-revision claim-identity defect in Case D and
returned:

```text
FINAL_DECISION = LEDGER_REDUCES_TO_STRUCTURED_PROVENANCE
MINIMAL_VALIDATOR_SPECIFICATION = NOT_AUTHORIZED
```

Therefore the Ledger is useful now as a documentary and provenance model. It
must not be presented as an adopted canonical NEXAH runtime, a scientific
truth validator or an automatically enforced accounting system.

## 4. Proposed Navigator role

The Representation Ledger should be assessed as the **accounting layer beneath
the relation graph**, not as another Connection Family.

```text
Navigator relation
    ↓
source boundary → operator boundary → target boundary
    ↓
preservation / loss / addition / collision / uncertainty / invertibility
    ↓
evidence + provenance + epistemic status + claim history
    ↓
return / unresolved remainder
```

This would explain why the Navigator can connect modules without collapsing
them. The graph supplies orientation; the Ledger supplies the scientific and
historical account of each consequential edge.

Architectural placement:

- **Framework:** what a representation edge consists of;
- **Evidence:** what supports each assertion and with which status;
- **Atlas:** optional edge-level inspection;
- **Families:** the relation remains assigned to `CF:F1–F7` rather than to a
  new ledger family;
- **Language:** first-use explanations of scope, uncertainty, invertibility and
  claim history.

## 5. Discrete structure and probabilistic weights

The repository supports a more precise version of the owner hypothesis:

> NEXAH often begins with a finite or discrete carrier — addresses, states,
> cells, edges, events or classes. Counts and probabilities may then be attached
> to transitions or observations under a declared sampling and estimation
> contract. Refinement can reveal distinctions, but it does not automatically
> produce probability or greater truth.

The layers should be kept separate:

| Layer | Record | Typical question |
|---|---|---|
| `R0 Identity` | discrete carrier, address or state set | What states exist in this declared model? |
| `R1 Support` | unweighted relation or transition graph | Which transitions were observed or permitted? |
| `R2 Count` | event/transition counts | How often did each registered event occur? |
| `R3 Weight` | normalized frequency or model probability | Under which sample/model is the edge weighted? |
| `R4 Uncertainty` | interval, posterior, error or unknown | How stable and well-estimated is that weight? |
| `R5 Decision` | threshold, classification or abstention | What action is permitted under the declared rule? |

This is a **resolution and weight ladder**, not an ontological ladder. Higher
rows require additional contracts and do not supersede lower rows.

## 6. What current tests show

The Operator Invariance Battery provides a direct counterexample to a simple
monotone reading:

- a nonlinear injective representation preserved coarse transition support
  while changing weights;
- one-step delay preserved support while changing weights;
- factor-two sampling preserved support while changing weights substantially;
- a lossy square projection changed the support topology itself;
- an inserted structural shortcut changed probabilities while the coarse
  support summary missed the change.

The Translation Fidelity work makes the same distinction at greater depth:

- binary support can miss rare and asymmetric transition changes;
- exact counts and probabilities detect finer differences;
- factor-two sampling and delay can destroy exact weighted equality;
- probability bins lose within-bin information;
- a visually or mathematically lossy ambient map need not lose information on
  one finite fixture.

Therefore:

```text
DISCRETE SUPPORT MAY SURVIVE WHILE WEIGHTS CHANGE
FINER RESOLUTION MAY REVEAL DIFFERENCES
FINER RESOLUTION DOES NOT GUARANTEE BETTER ESTIMATION
PROBABILITY REQUIRES A DECLARED SAMPLE OR MODEL
HIGHER RESOLUTION DOES NOT MEAN HIGHER TRUTH
```

The archived `NEXAH Living Discrete Probabilistic Field` visual is especially
instructive: it was retained as an archive candidate because its probability
contract was absent. The picture anticipates the idea; it does not establish
the mathematics.

## 7. Connection to Matryoshka / Scale

The scale lens and the resolution ladder are related but not identical:

- **Matryoshka** records containment among carriers, frames and scales;
- **scale transition** records movement between declared scale spaces;
- **resolution** records distinguishable granularity within a measurement or
  representation;
- **sampling** records how observations are selected;
- **probability/weight** records normalized counts or a declared statistical
  model;
- **uncertainty** records what remains unknown about a measurement, estimate or
  claim.

A future v2 fixture should vary these coordinates independently. Otherwise a
change caused by sampling could be misread as a change of scale, and a finer
display could be misread as a more certain scientific statement.

## 8. Dice composition as the finite probability bridge

The registered Cube Lab and the UTG total report already contain the missing
concrete example, but it is not yet exposed as one Navigator explanation.

For two fair six-sided dice, begin with the discrete product carrier:

```text
Omega = {1,...,6} x {1,...,6}
|Omega| = 36 ordered microstates
S(a,b) = a+b
```

The sum map projects 36 equally weighted ordered pairs onto eleven visible sum
classes `2,...,12`. Their preimage multiplicities are:

```text
1,2,3,4,5,6,5,4,3,2,1
```

and therefore:

```text
P(S=s) = |S^(-1)(s)| / 36.
```

The central seven has probability `6/36 = 1/6` because six distinct ordered
relations project to that visible result. The probability is not stored in the
glyph `7`; it is induced by the carrier, fairness assumption and sum operator.

This supplies an exact instance of the resolution ladder:

```text
ordered dice states
→ sum relation
→ preimage multiplicity
→ normalized probability
→ optional uncertainty only when probabilities are estimated from samples
```

For `n` independent D6 dice, the microstate count is `6^n`; the visible sum
distribution is the `n`-fold convolution. Relation counts therefore multiply
before the projection compresses them. For three D6 dice, for example, sums
`13` and `14` have respectively `21` and `15` ordered realizations. This is a
combinatorial fact of that carrier, not a consequence of 13 being prime.

### 8.1 Keep the P13/P14 hinge separate

The existing Meta-Architecture Trace records another exact route:

```text
P13 = 41
41 + 1 = 42 = 6 x 7 = 2 x 3 x 7
43 = P14
```

Here the relation fan-out occurs around the composite hinge `42`: prime-index
address, successor/predecessor, product decomposition and the bounded `6 x 7`
room/axis reading coexist. These are multiple typed relations to one arithmetic
record. They are not dice probabilities.

Thus two different multiplication effects must remain distinct:

| Carrier | What multiplies | What becomes weighted |
|---|---|---|
| Dice product space | ordered microstates (`6^n`) | projected outcome classes by preimage count |
| P13–42–P14 hinge | typed arithmetic relations and decompositions | nothing probabilistic unless a sample model is separately declared |

An explicit binder may compare both as many-to-one relation structures. It
must not identify `13`, `14`, `41`, `42`, `43`, dice sums and prime indices.

## 9. Candidate fixture

A minimal assessment fixture could use one finite state-transition record and
four views:

1. exact discrete state identities;
2. binary transition support;
3. event counts;
4. estimated transition probabilities with uncertainty.

It should then apply:

- one representation-preserving relabeling;
- one factor-two coarsening;
- one refinement with the same underlying observations;
- one lossy projection;
- one new sample with changed counts;
- one unresolved or abstaining return.

For every edge, the record must state source, operator, target, scope,
preservation, loss, collision, uncertainty, invertibility, provenance and
claim support. The goal is not to validate the V3 schema or revive its blocked
validator path. The goal is to test whether an edge-level accounting view helps
a reader understand the frozen Navigator architecture.

## 10. Candidate decision

```text
COHERENCE_STATEMENT = SUPPORTED_WITHIN_FROZEN_REGISTERED_CORPUS
ALL_REPOSITORY_HTML_COHERENTLY_CONNECTED = NOT_ESTABLISHED
REPRESENTATION_LEDGER_EXISTS = YES
LEDGER_AS_NAVIGATOR_LAYER = MISSING
LEDGER_CURRENT_ROLE = STRUCTURED_PROVENANCE_CANDIDATE
LEDGER_VALIDATOR_AUTHORIZED = NO
DISCRETE_FIRST_PATTERN = PRESENT_IN_MULTIPLE_FIXTURES
PROBABILITY_FROM_FINENESS_ALONE = NO
RESOLUTION_AND_WEIGHT_LADDER = CANDIDATE_FRAMEWORK_LENS
TWO_D6_PROBABILITY_BRIDGE = EXACT_FINITE_EXAMPLE
THREE_D6_SUM_13_14_MULTIPLICITIES = 21_AND_15
P13_42_P14_HINGE = EXACT_ARITHMETIC_NON_PROBABILISTIC
DICE_AND_PRIME_HINGE = RELATED_BY_METHOD_ONLY
MATRYOSHKA_AND_RESOLUTION = RELATED_BUT_NON_IDENTICAL
NAVIGATOR_V1 = UNCHANGED
```

## 11. Sources reviewed

- `NEXAH_REPRESENTATION_LEDGER_SCHEMA_V2_REVISION/`
- `NEXAH_REPRESENTATION_LEDGER_V3_BOUNDED_REVISION/`
- `NEXAH_REPRESENTATION_LEDGER_V3_FINAL_INDEPENDENT_REVIEW/`
- `NEXAH_OPERATOR_INVARIANCE_BATTERY/04_ADVERSARIAL_FALSIFICATION.md`
- `NEXAH_TRANSLATION_FIDELITY_EXPERIMENT/04_INFORMATION_AND_ADVERSARIAL_ANALYSIS.md`
- `HOOK_MIRROR_ROPE_KHIPPU_TRANSLATION_2026-09-04/17_ROTATING_FRAME_AND_RESOLUTION_SCHEMA.md`
- `RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/RESEARCH_DIRECTION/03_NON_CLAIMS.md`
- `MISSION_03_INTAKE_RESOLUTION_DECISION_GATE/05_LANDING_PAD_ROUTING_MANIFEST.md`
- `SCIENCE_LAB/CASE_STUDIES/NEXAH_BLOCK01_CUBE_FACE_PROJECTION_RETURN_2026-10-06/`
- `SCIENCE_LAB/NAVIGATION/EVIDENCE/UNIFIED_TRANSITION_GEOMETRY_2026-10-06/UTG_THREAD_TOTAL_REPORT_2026-10-06.md`
- `SCIENCE_LAB/NAVIGATION/EVIDENCE/NEXAH_META_ARCHITECTURE_TRACE_2026-10-06/`
- `SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/13_12321_COUPLING_KEY_JANUS_AXIS.md`
