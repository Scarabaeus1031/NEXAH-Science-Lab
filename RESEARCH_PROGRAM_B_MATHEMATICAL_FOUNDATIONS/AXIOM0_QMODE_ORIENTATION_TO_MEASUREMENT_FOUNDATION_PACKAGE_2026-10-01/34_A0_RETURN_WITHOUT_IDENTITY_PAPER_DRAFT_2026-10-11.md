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

### Editorial currentness and paper boundary — 2026-11-23

The November Primecube, Prime Projection / Helix and Riemann-mirror additions
are synchronized here as examples of one question only: **what exactly
returns, and what stronger identity does not follow?** They add no sixth
formal Study and do not modify the five source studies supporting the paper's
main contribution statement.

- This Paper C owns the distinction between source return, address return,
  view return, operator return and identity return.
- [Paper E](35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md)
  owns the `Source -> Operator -> View -> Return` workflow and its falsifiers.
- [Paper F](36_A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER_DRAFT_2026-10-12.md)
  owns frame, envelope, shadow-fibre and observer-cut language.
- Papers A, B and D receive no proposition, evidence or status change from
  these examples.

Accordingly, the later preparation notes are read as one coordinated current
methods bundle, not as independent discoveries accumulated by visual
similarity. External review, novelty review, submission and publication remain
unauthorized.

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

### Literature and contribution boundary

The inner action used here is classical. In the binary tetrahedral group of
Hurwitz units, the generator `-(1+i+j+k)/2` acts by conjugation and cyclically
permutes `i,j,k`; replacing it by its negative leaves conjugation unchanged.
Accordingly, this paper does **not** claim novelty for the order-three
quaternion rotation, the cyclic coordinate action, or the proper/improper
rotation boundary.

The role of this case is instead methodological: it binds a standard exact
action to a declared finite trinomial carrier through an injective
representation, names the inverse Return, states the `N=0` faithfulness
exception, and prevents reflection, generic view rotation, coefficient
generation and physical mechanism claims from being merged with it. The
specific `Phi` packaging is retained as a source-bound construction, not
promoted as an independently novel quaternion theorem.

Literature anchors:

- M. Bakuradze, *Mod 2 Morava K-theory for Frobenius complements of exponent
  dividing 2^n · 9*, Journal of Homotopy and Related Structures 6(1)
  (2011), 65–69.
  <https://tcms.org.ge/Journals/JHRS/xvolumes/2011/n1a3/v6n1a3hl.pdf>
- D. Harland and N. S. Manton, *Rolling Skyrmions and the nuclear spin-orbit
  force*, Nuclear Physics B 935 (2018), 210–241.
  <https://doi.org/10.1016/j.nuclphysb.2018.08.006>

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

<a id="carrier-witness-residual-comparator"></a>

### 11.4 Carrier, witness and residual: an analytic Return comparator

The integrated Mathfield view adds a compact analytic comparator to the paper's
method layer. It does not add a sixth formal case to the five closed Studies.
For a shared phase parameter `t`, define

```text
C(t) = sin(t)
E(t) = e^t
R_dyad(t) = C(t) - E(t).
```

After one complete angular turn,

```text
C(t+2π)-C(t) = 0,
E(t+2π)-E(t) = e^t(e^(2π)-1),
R_dyad(t+2π)-R_dyad(t) = -e^t(e^(2π)-1).
```

The periodic carrier therefore returns exactly, while the exponential witness
does not. The residual does not become a new object or an error to be hidden;
it is the exact record of why the composite readout fails identity return.
This gives a minimal executable example of the paper's typed hierarchy:

```text
carrier return != witness return != composite identity return.
```

The example is elementary and analytically complete. Its contribution is the
typing and presentation of the seam, not a new theorem about `sin`, `exp`,
dyadic fields, Zeta, physics or natural systems. The Dyadic Audit, Antipode
Return, SNCE connector and K-channel sources remain evidence sidecars with
their original scopes. The Ramanujan/Pentagon comparator remains outside this
Paper-C argument.

Controlling records:

- [integrated Mathfield comparator](A0_BOOK/A0_MATHEMATICAL_JOINTS.html#return-layer-audit)
- [Science Desk disposition](A0_BOOK/A0_RESEARCH_DESK.html#return-layer-paper-routing-20261115)
- [Findings/Paper triage](32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md#carrier-witness-residual-return--2026-11-15)
- [machine receipt](A0_BOOK/results/a0-return-layer-desk-binding-2026-11-15.json)

<a id="post-freeze-typed-return-comparators"></a>

### 11.5 Post-freeze typed Return comparators

*Preparation note dated 18 November 2026; not a sixth formal Study, not a new
Finding and not publication-facing evidence.*

Two existing instrument returns sharpen the paper's distinction between a
returned address, a returned view and identity return.

First, the Blue/Pink Dodeca comparator holds `204° PHASE_ADDRESS` and
`135° VIEW_ANCHOR` as different types. The arithmetic difference `69°` is
valid, but it is not a Return operator. Their common pivot states where two
routes are compared; it does not identify the routes or the fields.

Second, the PI comparator places three declared Janus involutions beside a
contraction negative control. The involutions return under their typed local
contracts; the contraction fails that predicate. A–I–D–A′ and Outer/Inner are
view labels for this comparison, not additions to the paper's formal
vocabulary.

Together these examples support the existing Paper-C method rule:

```text
same numeric neighbourhood != same type != same Return predicate != identity.
```

Controlling records:

- [finding extraction](32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md#post-freeze-five-host-finding-extraction--2026-11-18)
- [Science Desk routing](A0_BOOK/A0_RESEARCH_DESK.html#post-freeze-findings-paper-routing-20261118)
- [typed angle comparator](A0_BOOK/A0_BLUE_PINK_DODECA_CELL_RETURN.html#returnAngleComparator)
- [PI comparator](A0_BOOK/A0_PLATINUM_IRIDIUM_PI_LENS.html#numbermagickPiComparator)

<a id="emerald-carrier-mediator-return"></a>

### 11.6 Emerald carrier / mediator Return

*Preparation note dated 20 November 2026; method illustration only, not a
sixth formal Study and not a new Finding.*

The Emerald Still Field supplies a deliberately small Return example. One
held source carrier is shown through an animated two-well view, a code-native
still view, a freely orbitable GLB view and a thirteen-position lamella view.
The declared phase sequence is

```text
AM -> P -> PM -> P.
```

`P` is the local mediator and Return address of this display. The sequence
shows that a view can leave and revisit an address while the source identity
remains held. It does not establish that the intermediate views are identical,
that the carrier has returned physically, or that the visible wells encode an
energy, resonance or equilibrium mechanism.

This supports the existing Paper-C distinction:

```text
source identity != view state != displayed phase != Return predicate.
```

The GIF and GLB are provenance-bound sources; the GLB has no native animation,
so camera motion remains a representation operation. PI and Lamella retain
their existing contracts and are referenced rather than absorbed.

The neighboring Prime Plate comparator supplies the discrete companion
boundary. A prime label, its `p mod 9` cell, the mirrored cell `8-cell`, the
Pascal sum `1024` and the historical sector-ledger endpoint `1024` may agree
in a displayed address while retaining different types and Return predicates.
This is an illustration of non-identity, not a sixth carrier Study or a new
prime theorem.

Controlling records:

- [finding extraction](32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md#november-a0-emerald-synthesis-return--2026-11-20)
- [Emerald instrument](A0_BOOK/A0_ARCHITECTURE_OF_DIFFERENCE.html#emerald-still-field)
- [Prime Plate comparator](A0_BOOK/A0_ARCHITECTURE_OF_DIFFERENCE.html#prime-plate-navigator)
- [source manifest](A0_BOOK/assets/emerald-still-field/MANIFEST.json)
- [machine receipt](A0_BOOK/results/a0-november-emerald-paper-routing-2026-11-20.json)

<a id="numbergame-typed-return-synthesis"></a>

### 11.7 Numbergame typed Return synthesis

*Preparation note dated 21 November 2026; not a sixth formal Study, not a new
Finding and not publication-facing evidence.*

The Numbergame/Fibonacci return supplies four compact instances of the paper's
central distinction between returning state, returning representation and
identity.

1. The ordered Fibonacci state `S_n=(F_n,F_(n+1))` returns simultaneously in
   the declared modulo-7, modulo-11 and modulo-37 registers after
   `lcm(16,10,76)=1520` steps. Golden-angle and uniform spiral displays do not
   alter that state.
2. The modular grid address `x=n mod 111`, `y=floor(n/111)` folds a linear
   sequence into periodic bands. The visible diagonal is a property of the
   declared address map, not an identity between the overlay and its carrier.
3. Decimal reversal, circle reflection and rotation are separate maps:
   `M_digit`, `M_circle(n)=-n mod 280`, and `R_107(n)=n+107 mod 280`.
   `M_digit^2=I` and `M_circle^2=I` are local Return contracts; neither implies
   preservation of primality or source identity.
4. The 20-sector clock gives `360 degrees / 20 = 18 degrees`, five sectors as
   `90 degrees`, and ten sectors as `180 degrees = 50 percent`. The displayed
   junction `ANGLE:90 + VALUE:50 -> ADDRESS:140` is therefore a typed codec,
   not an equality of angle and percentage.

The retained negative control is equally important: modular divisibility
sensors do not form a universal primality certificate. A silent sensor, a
shared number or a similar picture does not establish identity, generator or
mechanism.

This strengthens the existing Paper-C rule:

```text
exact Return under one declared predicate
!= Return under another predicate
!= preservation of identity.
```

Controlling records:

- [Science Desk synthesis](A0_BOOK/A0_RESEARCH_DESK.html#numbergame-fibonacci-prime-vendissimal-return-20261121)
- [formal NumberMagick host](A0_BOOK/A0_NUMBERMAGICK_GRID_RESEARCH.html#prime-address-countershot)
- [Findings/Paper triage](32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md#numbergame-fibonacci-scientific-relevance--2026-11-21)
- [machine receipt](A0_BOOK/results/a0-numbergame-fibonacci-prime-vendissimal-synthesis-2026-11-21.json)

<a id="tm-lim-janus-cube-handoff"></a>

### 11.8 TM/LIM, Janus and the Cube handoff

*Preparation note dated 21 November 2026; not an additional formal Study,
Finding or publication-facing claim.*

The Numbermagick/Cube handoff supplies a compact example in which projection
Return, pose Return and record Return must remain distinct. Let the two
one-sided states at a declared seam be

```text
x_minus = lim(t -> t0-) x(t)
x_plus  = lim(t -> t0+) x(t).
```

A local Transfer/Mirror map may identify their displayed cyclic address while
retaining their side. Writing the side as `epsilon in {-1,+1}`, the declared
Janus flip is

```text
T(a, epsilon) = (a, -epsilon),     T^2 = id.
```

Thus `AM -> AM' -> AM''` is represented internally as
`AM_plus(pass=0) -> AM_minus(pass=1) -> AM_plus(pass=2)`. The final address and
orientation may equal the initial ones while the historical records remain
different.

The existing Pascal-bracket projection is the necessary negative control. Its
`+60 degree` and `-60 degree` spatial poses have identical complete 2D point
data under the declared orthographic XY projection, but different signed depth
and therefore different spatial states. An exact Cube handoff consequently
requires a record of the form

```text
H = (carrier, address, sheet, pass, signed_tilt_or_depth,
     residual, axis, frame, projection_contract, provenance).
```

This gives the controlling non-identity:

```text
same projection != same spatial pose != same historical record.
```

CARO Green Mirror is retained only as a neighboring view comparator: its
Open/Green and Closed/Black/Lotus display change, rotated Return glyph and five
manual day markers do not identify CARO closing with TM, Janus or Cube tilt.
Two Owner-supplied visual definition plates now bind `CaroThemanu` as the
source-defined transformation grammar

\[
\mathcal F = Nu\circ Ma\circ Thé\circ Ro\circ Ca,
\]

where the declared reading is Cut/Puncture, Rotation/Orientation,
Resonance/Coherence, Form/Storage and Return/Integration. The companion plate
places this grammar on the broader carrier sequence

```text
FIELD -> CUT -> SPACE -> POSITION -> RELATION -> WORLD.
```

This removes the earlier lexical ambiguity but does not create a canonical or
scientifically validated operator. The local Janus involution `T` remains a
sheet change inside the larger typed sequence, not an identity with
`mathcal F`. The visual definitions are Owner sources for terminology and
order only; they are not evidence for uniqueness, physical action or truth.

Controlling records:

- [Science Desk return](A0_BOOK/A0_RESEARCH_DESK.html#tm-lim-janus-cube-handoff-return-20261121)
- [Numbermagick crosswalk](A0_BOOK/A0_NUMBERMAGICK_GRID_RESEARCH.html#tm-lim-janus-cube-handoff-20261121)
- [existing tilt audit](A0_BOOK/results/a0-pascal-bracket-tilt-projection-2026-10-25.json)
- [machine-readable preparation receipt](A0_BOOK/results/a0-tm-lim-janus-cube-handoff-2026-11-21.json)

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
## Prime Projection address Return

<a id="prime-projection-address-return"></a>

### Preparation note — finite CRT address Return without integer identity


<a id="primecube-sz-khipu-return-preparation"></a>

### Preparation note — Primecube S/Z and Khipu Return without identity

The retained Primecube carrier supplies a compact non-identity example for this
paper. One source record can return through its Base-11 address, a CRT address,
a Z-slice, a mask-extrusion position or a full-envelope location without those
representations becoming identical. The signed closure
`102 degrees * 60 = 17 * 360 degrees` records `W=+17/-17` only after an
orientation has been declared. At the axis crossing, radius zero is a defined
state while polar angle is undefined; `null`, numeric zero and an unresolved
view coordinate therefore remain typed separately.

The Khipu comparison is limited to the representational principle that carrier,
position, twist and deliberate absence can jointly encode a reading. It does
not claim historical descent, a shared algorithm or an identity between an
Andean artefact and the Primecube instrument.

Reviewer figure `PC-RF-C-01` starts from retained source `496`, computes
Base-11 address `[0,1,4]` and CRT address `(6,1,2)` independently, and returns
to `496` through the declared codecs. It is an exportable illustration of
Return across non-identical representations; it adds no formal case or theorem.

[Open figure and five-stage receipt](A0_BOOK/A0_PRIMECUBE_GAP_FOLD_LAB.html#primecube-reviewer-packet)

Status: `INTERNAL PREPARATION NOTE / NO PROPOSITION CHANGE / NO PUBLICATION AUTHORITY`.

#### Existing Prime Projection address-return note

The A0 Prime Projection Test Suite supplies a compact finite example of the
paper's central distinction. For `n_k=37+100k`, the address
`(n mod 3,n mod 5,n mod 7)` advances by `(1,0,2)` and returns after 21 steps.
Thus `37` and `2137` share the address `(1,2,2)` while remaining different
integers. The exact Return belongs to the quotient address, not to the source
object. The source number therefore remains the required witness for lossless
reconstruction.

The paired Helix view adds a visual control: 40 twin-prime pairs and 19 finite
`Z37` involution orbits can be shown as rungs without equating pair membership,
orbit membership or screen position. This is manuscript preparation only; it
adds no theorem, Study, canonical Finding or publication authority.

[Science Desk return](A0_BOOK/A0_RESEARCH_DESK.html#prime-projection-helix-paper-routing-20261121) ·
[Instrument](A0_BOOK/A0_PRIME_PROJECTION_TEST_SUITE.html) ·
[Contract](A0_BOOK/A0_PRIME_PROJECTION_TEST_SUITE_CONTRACT_2026-11-21.md)

## Riemann mirror / fixed-set return {#riemann-mirror-fixed-set-return}

The map

\[
W(s)=1-\overline{s}
\]

is an affine anti-holomorphic involution of the complex plane. It preserves
the imaginary coordinate, reflects the real coordinate across
`Re(s)=1/2`, and satisfies `W(W(s))=s`. Its fixed set is exactly
`{s in C : Re(s)=1/2}`. This provides a clean Return-without-identity example:
off the line, source and partner remain distinct although the second
application returns exactly; on the line, source, mirror and return coincide.

This construction separates set invariance from pointwise fixation. The
functional equation and complex conjugation preserve the nontrivial zero set
under the familiar symmetry orbit, but symmetry alone permits distinct
partners on opposite sides of the line. RH asserts the stronger pointwise
condition that every nontrivial zero lies in the fixed set. No dynamic or
spectral no-crossing statement is inferred.

Evidence route: [interactive demonstrator](A0_BOOK/A0_RIEMANN_HALFLINE_THETA_RETURN.html#riemann-mirror-fixed-line),
[bounded contract](A0_BOOK/A0_RIEMANN_HALFLINE_THETA_RETURN_CONTRACT_2026-11-21.md),
and [R1 receipt](A0_BOOK/results/a0-riemann-halfline-theta-return-2026-11-21.json).

Claim boundary: exact operator and fixed-set mathematics; no RH proof, zero
localization or no-crossing theorem.
