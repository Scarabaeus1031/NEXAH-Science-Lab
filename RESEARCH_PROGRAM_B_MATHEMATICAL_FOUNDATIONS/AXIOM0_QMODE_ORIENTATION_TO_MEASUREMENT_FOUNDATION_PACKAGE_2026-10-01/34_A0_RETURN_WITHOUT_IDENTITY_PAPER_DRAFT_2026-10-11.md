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
