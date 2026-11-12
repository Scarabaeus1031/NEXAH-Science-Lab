# Return without identity

Subtitle: Exact return, representation recovery and typed residuals in finite
Pascal carriers

Date: `2026-10-11`

Status: `INTERNAL_MATHEMATICS_METHODS_DRAFT / SOURCE_BOUND / NOT_SUBMITTED / NOT_PUBLICATION_AUTHORIZED`

Paper lane: `A0 Paper C`

Evidence identities reused:

- `A0-BL-021`
- `A0-BL-035`
- `A0-BL-045`
- `A0-BL-052`
- `A0-BL-053`
- `A0OE:PASCAL_QUATERNION_TEST`

## Abstract

A system may return to a previously occupied state without recovering the
path, representation or identity by which that state was reached. We examine
this distinction across five source-bound finite Pascal-carrier studies. A
dynamic-boundary enumeration produces 100 histories but only 56 typed terminal
classes, proving that endpoint return does not generally recover history. A
local Splinter description removes address collisions only at one signature
per history and therefore does not provide a compressed selector. A signed
double-pentagon bridge satisfies the exact algebraic law
`(Q'_epsilon)^2=epsilon I`, while its global seam and Euclidean metric role
remain separately typed. Finally, the map

```text
Phi(a,b,c) = (a+b+c)1 + ai + bj + ck
```

is injective and exactly `C3`-equivariant on every finite trinomial carrier
`P_N`; conjugation by `u=(1+i+j+k)/2` realizes the cyclic coordinate action
and conjugation by `u^-1` gives exact Return. The restricted action is faithful
for `N>=1`, but not on the singleton `P_0`. Together these cases support a
typed methodology: endpoint return, structural return, representation
recovery, operator inversion and history recovery are distinct claims. The
paper makes no physical-mechanism, historical-intent, worldwide-novelty or
publication-readiness claim.

## 1. Research question

The paper asks one bounded synthesis question:

> Which information is preserved when a declared finite carrier returns, and
> which stronger notions of identity remain unestablished?

The question is methodological but evaluated only through the named exact
finite objects. The paper does not propose a universal theory of return.

## 2. Why this is separate from SCC-003

SCC-003 defines one finite cyclic quotient of five depth-six Pascal carriers
and proves its typed `D5` symmetry. Its object, theorem and contribution are
deliberately narrow.

This paper compares several non-identical Return contracts across different
finite objects. It uses the SCC-003 lineage as one source context but neither
extends the SCC-003 quotient theorem nor adds the quaternion connector to its
automorphism group. Combining both manuscripts would blur:

- a theorem about one finite quotient;
- a methods comparison across several carriers and representations;
- closed scientific results versus formal design fixtures;
- intrinsic structure versus explicitly supplied bridges.

Accordingly, SCC-003 remains Paper A and this manuscript remains Paper C.

## 3. Typed Return vocabulary

Let `X` be a declared carrier, `T` an operator or transport, `R` a declared
representation and `I` a tested invariant. The following questions must be
recorded separately:

1. **Endpoint return:** does `T^k(x)=x` for the tested state?
2. **Structural return:** does the relevant adjacency, weight, seam or typed
   incidence structure return?
3. **Representation return:** does the recorded representation recover the
   same typed coordinates?
4. **Operator return:** is there a declared inverse or return operator?
5. **History return:** can the route or operation sequence be reconstructed?
6. **Identity return:** do all fields required by the declared identity
   contract agree?

No implication between these levels is assumed without proof. In particular,
endpoint equality does not imply history recovery, and visual resemblance does
not establish structural or identity return.

## 4. Case I — Dynamic boundary and history loss

The closed A0-BL-021 enumeration considers every admissible two-face extension
of the open five-face carrier. Its exact result is:

```text
100 frozen histories -> 56 typed terminal classes.
```

Therefore the terminal typed state is not a sufficient statistic for the
construction history. Multiple valid paths reach the same terminal class.
This is a validated negative result, not a failed experiment.

The result establishes a first separation:

```text
same terminal state != same history.
```

Controlling source: [A0-BL-021 Labreport](../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_001.md).

## 5. Case II — Splinter and the cost of local identification

A0-BL-035 asks whether a local seam-and-corner signature resolves the
terminal ambiguity with genuine compression. The tested signatures remove
collisions only by producing 100 signatures for 100 histories. They recover an
address but do not yield a smaller sufficient selector.

The result establishes:

```text
collision-free description != compressed identification.
```

The Splinter is therefore retained as a partial local representation, not a
new canonical operator or vocabulary primitive.

Controlling source: [A0-BL-035 Labreport](../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_035_SPLINTER_LOCAL_EXTRACTION_001.md).

## 6. Case III — Signed double-pentagon Return

A0-BL-045 separates three questions that share similar diagrams but not the
same mathematics:

- which global seam closes the doubled strip;
- which algebraic bridge returns the state;
- which map preserves the declared Euclidean pillar metric.

For the explicitly supplied reciprocal bridge,

```text
Q'_epsilon(a,b) = (epsilon Q^-5 b, Q^5 a),
(Q'_epsilon)^2 = epsilon I.
```

Thus `epsilon=+1` gives exact return after two half-orbits, whereas
`epsilon=-1` gives anti-return after two and exact oriented-state return after
four. The local matrix invariants do not select the untwisted versus twisted
global seam. The algebraic bridge is also non-orthogonal in the declared
Euclidean metric, while the pillar reflection is an isometry.

The result establishes:

```text
algebraic return != seam selection != metric isometry.
```

Controlling source: [A0-BL-045 Labreport](../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_045_PASCAL_Q5_RETURN_FORK_001.md).

## 7. Case IV — Quaternion representation and exact inverse Return

For the trinomial carrier

```text
P_N = {(a,b,c) in Z_{>=0}^3 : a+b+c <= N},
```

define

```text
Phi(a,b,c) = (a+b+c)1 + ai + bj + ck.
```

### Proposition 1 — Injectivity

The imaginary coefficients of `Phi(a,b,c)` are exactly `a,b,c`. Equality of
two images therefore implies equality of all three coordinates. Hence `Phi`
is injective on `R^3` and in particular on every `P_N`.

### Proposition 2 — Exact cyclic equivariance

Let

```text
u = (1+i+j+k)/2.
```

Exact quaternion multiplication gives

```text
Ad_u(i)=j,
Ad_u(j)=k,
Ad_u(k)=i.
```

The scalar coordinate is fixed under conjugation, so

```text
Ad_u(Phi(a,b,c)) = Phi(c,a,b).
```

Furthermore `u^3=-1`; because central signs act trivially by conjugation,
`Ad_u` has order three.

### Proposition 3 — Exact Return

Conjugation by `u^-1` is the inverse transformation:

```text
Ad_{u^-1}(Ad_u(q)) = q
```

for every quaternion `q`, hence for every represented carrier state.

### Proposition 4 — Proper/improper boundary

The even coordinate permutations form `A3=C3` and are realized by the proper
rotation above. Coordinate transpositions have determinant `-1` in the
ambient three-coordinate space and are not realizable as unit-quaternion inner
rotations.

For `N>=1`, `P_N` contains `0,e1,e2,e3`, so the restricted coordinate action
is faithful. For `N=0`, the carrier is the singleton `{0}` and every coordinate
permutation restricts to the identity. Thus the connector theorem holds for
all `N>=0`, while faithful restricted action requires `N>=1`.

Controlling sources:

- [A0-BL-052 Labreport](../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_052_PASCAL_QUATERNION_FOUR_CHANNEL_RETURN_001.md)
- [A0-BL-053 Labreport](../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_053_PASCAL_QUATERNION_SYMBOLIC_PROOF_REVIEW_001.md)

## 8. Comparative result

| Case | What returns | What does not follow |
|---|---|---|
| Dynamic boundary | a typed terminal class may recur | unique history |
| Splinter | a collision-free local address | compression or canonical selector |
| Double pentagon | state under an explicitly supplied signed bridge | intrinsic seam choice or Euclidean isometry |
| Quaternion connector | full represented state under exact inverse conjugation | reflections, fifth component or Pascal coefficient generation |

The common conclusion is not that all systems share one mechanism. It is that
every Return claim must name its carrier, representation, operator, invariant,
information boundary and failure condition.

## 9. Negative and non-identity results retained

The synthesis preserves the following boundaries:

- terminal state does not identify route history;
- local uniqueness does not imply compression;
- matrix trace and determinant do not select global seam topology;
- an algebraic involution need not be a metric isometry;
- proper quaternion rotations do not realize improper reflections;
- the scalar coordinate is Pascal depth, not a fifth imaginary component;
- `Q_432(x)=432/x`, prime readouts, `4^2/5^2` counts and visual color roles do
  not derive or select the quaternion connector;
- Record/Play, Crystal, Shadow, Neon and related diagrams are explanatory
  cartographies unless bound to one of the controlling sources above.

## 10. Contribution statement

The permitted internal contribution statement is:

> Across five exact finite Pascal-carrier studies, apparently similar Return
> statements separate into endpoint, structural, representational, operator,
> history and identity claims. One quaternion representation admits an exact
> all-`N` cyclic intertwiner and inverse Return, while nearby history,
> compression, seam and reflection claims fail or require additional typed
> information.

This statement is internally source-bound. It is not yet a novelty,
significance, priority or publication claim.

## 11. Evidence and reproducibility

### Visual and HTML source layer

The reader-facing A0 surface is
[A0 Paper C — Return without identity](A0_BOOK/A0_RETURN_WITHOUT_IDENTITY_PAPER.html).
It adds two code-native synthesis figures: the typed Return ladder and the
quaternion `C3` connector. They explain the argument but do not replace any
proof, result object or Labreport.

Four already governed ILAU instruments are linked as illustrative sources:

- `ILAU:RECORD_PLAY_432` — shared state/readout, without operator identity;
- `ILAU:RETURN_RESIDUAL_LOCK` — point, direction and curvature residuals;
- `ILAU:KNOT_ROPE_BODY` — route closure with possible directional residual;
- `ILAU:FROM_GAP_TO_RETURN` — cover, cut, kernel, gap and Return vocabulary.

The Core quaternion switchyard and Pascal Pentagon Explorer remain technical
source-bound readers. The governing rule is unchanged:

```text
Labreport / formal package = evidence authority
HTML / SVG / GLB           = illustration and navigation
```

The visual layer creates no new Study, Family, module, route, canonical graph
relation, proof identity or physical mechanism claim.


- A0-BL-021, 035 and 045 are closed exact finite studies with local replay.
- A0-BL-052 is a closed exact finite connector result.
- A0-BL-053 supplies the all-`N` symbolic proof, internal clean-room
  implementation, byte-identical replay and separate verifier.
- A0-BL-053 remains `R2_LOCAL_REPLAY`, not `R4_EXTERNAL_REPLICATION`.
- No evidence is imported from the visual instruments merely because their
  geometry resembles one of the formal objects.

### 11.1 Documentary instrument example — Three-Domain Game Atlas

The [Three-Domain Game Atlas](A0_BOOK/assets/game-of-worlds-play/three-domain-transition-test/index.html#atlas)
adds a bounded executable example to the visual layer. Its nine panels share
one generation clock but retain separate carriers and operators. Two panels
are especially useful for the Return vocabulary:

- `k·NEG / Q°` records the negative-event ledger together with an exact held
  generation. It is a local state checkpoint, not a reconstruction of every
  contributing mechanism.
- Blue Body 48 carries the held generation to one declared `Q4×P3` address.
  This is an address witness, not proof that the neighboring Euler, Fibonacci,
  Ihara or cellular panels are the same carrier.

Switching a lens while preserving the held generation illustrates view
persistence; it does not promote endpoint or address agreement to history,
operator or full-identity Return. The canonical documentary record is the
[Science Desk return](A0_BOOK/A0_RESEARCH_DESK.html#three-domain-blue-body-return-20261021),
with a [machine-readable receipt](A0_BOOK/results/a0-game-of-worlds-three-domain-atlas-return-2026-10-21.json).
This example adds no formal case, proof, Study or evidence to Paper C.

### 11.2 Bounded 28-address fold ledger

The existing A0 material contains two exact but non-identical 28-counts:

```text
4 * 7              = 28
1+2+3+4+5+6+7      = 28.
```

The first is the declared TESA/Zither address product. The second is the
cardinality of a seven-row triangular register. Their equal cardinality
permits a chosen bijection between the two finite sets, but does not select a
canonical bijection, preserve adjacency or identify the carriers.

For the labelled address set

```text
A = {1,2,...,28},
```

the complement rule

```text
c(i) = 29-i
```

is an exact involution: `c(c(i))=i`. It partitions `A` into fourteen pairs
whose labels sum to `29`. The label `29` is the complement constant and may
be displayed as an external witness; it is not a twenty-ninth member of `A`.

A pentagonal tile may therefore be used as a fold/view controller for this
ledger only after the source address, fold map and retained residual are
declared. Exact Return then means recovering the original address from the
folded view plus the stated witness. A drawing with 28 marks, a pentagonal
outline or a shared count alone establishes none of the following:

- an adjacency-preserving transport;
- an identification with the SCC-003 quotient;
- a new seam, vertex or mechanism;
- a canonical relation between the TESA and triangular registers.

This ledger is a documentary worked example of the Return vocabulary, not a
sixth formal case and not a new Finding. The controlling A0 synthesis retains
the cross-carrier transport as `OPEN/HOLD`; SCC-003 remains unchanged.

Controlling records:

- [A0 Thread Synthesis](A0_BOOK/results/a0-thread-science-desk-synthesis-2026-10-30.md)
- [Grid/operator application synthesis](101_A0_GRID_OPERATOR_APPLICATION_SYNTHESIS_2026-10-15.md)

Public review projection:

- [SCC-003 supplementary fold review](https://review.nexah.de/scc-003-r1/#review-fold-title)
  is the bounded human-review surface for this worked example.
- Its implementation is frozen at `NEXAH-Experience main@4ca47a1`, source
  `src/pages/scc-003-r1/index.astro#review-fold-title`.
- The projection does not add a case, Finding, Study, Navigator identity or
  SCC-003 claim. Scientific disposition remains owned by this Paper C source
  and the A0 Science Desk.

<a id="ullinium-methods-1-5-comparator"></a>

### 11.3 Five provenance encodings: exact Return without algorithmic privilege

The Ullinium closing comparator was followed by a frozen engineering
comparison of five encodings over the same labelled graph-gluing task. The
population contains 10,000 deterministic trials: 2,000 each from cycle, tree,
ladder-grid, planar-fan and connected-general graph families. The overlap
selector rotates through one vertex, one edge and one length-two path.

The five methods are:

1. anonymous adjacency only;
2. a property graph carrying source-origin properties;
3. a bipartite incidence/projection graph;
4. an explicit cospan/pushout with source maps;
5. the NEXAH Loss/Return Receipt with layer maps, seam preimages, source
   digest, return status and claim boundary.

| encoding | exact labelled Return | corruption / false-seam detection | mean canonical JSON bytes |
|---|---:|---:|---:|
| adjacency only | `0 / 10,000` | not available | `239.22` |
| property graph | `10,000 / 10,000` | `10,000 / 10,000` each | `1,921.36` |
| bipartite incidence | `10,000 / 10,000` | `10,000 / 10,000` each | `2,787.90` |
| cospan / pushout | `10,000 / 10,000` | `10,000 / 10,000` each | `1,173.46` |
| NEXAH Return Receipt | `10,000 / 10,000` | `10,000 / 10,000` each | `2,389.50` |

All seven preregistered validity gates pass. The result is therefore not that
NEXAH discovered a stronger inverse. Property, incidence and cospan methods
already retain sufficient provenance for exact labelled reconstruction, and
the cospan/pushout is the smallest standard payload in this implementation.
NEXAH uses `2.04×` that payload while providing the same exactness and
fail-closed integrity.

The bounded conclusion is:

```text
EQUIVALENT_RECOVERY_WITH_EXPLICIT_GOVERNANCE_OVERHEAD
```

What remains distinct is the packaging of layer, seam, declared loss, Return
status and claim ceiling in one receipt. That integration may be useful for
auditable research operation, but this benchmark establishes neither a new
graph algorithm nor a compression, robustness or mathematical novelty
advantage. It is a documentary engineering comparator, not a sixth formal
Paper-C case and not a new `F-A0` Finding.

Controlling records:

- [Frozen methods 1–5 preregistration](A0_BOOK/results/A0_ULLINIUM_METHODS_1_5_PREREGISTRATION_2026-11-11.md)
- [Machine-readable result](A0_BOOK/results/a0-ullinium-methods-1-5-result-2026-11-11.json)
- [Comparator runner](A0_BOOK/a0_ullinium_methods_1_5_benchmark.cjs)
- [Science Desk return](A0_BOOK/A0_RESEARCH_DESK.html#ullinium-closing-comparator-return-20261111)

## 12. External-review gate

Before submission, publication, conference circulation or public academic
assertion, a qualified independent human reviewer must receive:

1. this manuscript;
2. the five controlling Labreports;
3. the A0-BL-052 and A0-BL-053 proof/replay packages;
4. a precise request to test definitions, proofs, case comparability and claim
   boundaries;
5. permission to return criticism, correction, non-replication or rejection.

The review must not be framed as a request for endorsement. After the returned
review, publication still requires a separate Human Owner decision.

## 13. Current manuscript state

```text
INTERNAL PAPER DRAFT: YES
SCIENTIFIC SOURCES CLOSED: YES, FOR THE FIVE NAMED STUDIES
INTERNAL USE AUTHORIZED: YES
EXTERNAL INDEPENDENT REVIEW: NO
R4 EXTERNAL REPLICATION: NO
NOVELTY REVIEW: NO
SUBMISSION AUTHORIZED: NO
PUBLIC RELEASE AUTHORIZED: NO
```
