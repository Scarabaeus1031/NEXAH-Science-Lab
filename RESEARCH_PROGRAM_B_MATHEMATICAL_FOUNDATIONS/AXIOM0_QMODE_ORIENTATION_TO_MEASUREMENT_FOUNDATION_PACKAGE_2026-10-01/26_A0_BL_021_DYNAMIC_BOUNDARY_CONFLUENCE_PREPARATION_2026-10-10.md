# A0-BL-021 — Dynamic Boundary and Confluence Preparation

Date: `2026-10-10`

Status:

```text
PREPARATION_COMPLETE
EXECUTED_UNDER_SEPARATE_ADMITTED_STUDY
OWNER_ACCEPTED_CLOSED
NO_CLAIM_PROMOTION
```

Owning identity: `NEXAH_AX0_QMODE_FOUNDATION_PACKAGE`

Reused evidence object: `PENT-06 — Pascal edge growth / dynamic boundary test`

## Purpose

This note originally prepared one formally decidable question without
executing it:

> When depth-six Pascal faces are attached along admissible open seams, under
> which conditions do different attachment histories such as `5+2` and
> `6+1` produce the same typed quotient?

It also records the owner's related idea of polygonal bodies with one missing
edge and the transition “through 7 to the octagon”. The latter receives a
precise combinatorial reading below; no regular metric polygon, solid,
physical channel or universal transition law is inferred.

## Execution return

The Human Owner subsequently admitted the bounded `f=5..7` combinatorial
scope. The separate Study package executed 9 admissible six-face and 100
admissible seven-face histories. They partition into 56 typed terminal classes,
with an explicit nonisomorphism witness between two connected 154-node
terminal carriers. The accepted final classification is
`VALIDATED_NEGATIVE_RESULT / PATH_DEPENDENT_WITH_WITNESS`.

See the [canonical Labreport](../../SCIENCE_LAB/LABREPORTS/MATHEMATICS/LABREPORT_A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_001.md),
[result assessment](../../SCIENCE_LAB/CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/03_RESULT_ASSESSMENT.md)
and [7×8 address/class crosswalk](../../SCIENCE_LAB/CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10/07_POST_RESULT_7X8_ADDRESS_CLASS_CROSSWALK.md).

## 1. Existing bounded result

PENT-06 already fixes a sequential depth-six Pascal-face operation. A single
face has `28` Pascal nodes. Gluing a new face along one compatible seven-node
radial seam identifies `7` seam nodes and contributes `21` new nodes:

```text
N_open(f) = 28 + 21(f-1) = 21f + 7
B_open(f) = f + 2
```

Here `f` is the number of Pascal faces and `B_open(f)` is the number of
coarse carrier-boundary edges. Each attachment consumes one current boundary
edge and exposes two new ones, hence

```text
B_open(f+1) = B_open(f) - 1 + 2 = B_open(f) + 1.
```

The existing verified range is `f=1..5`. Cyclic closure at `f=5` identifies
six non-apex lattice nodes and returns the separately verified 106-node
five-face quotient.

## 2. Three integers that must not be conflated

| Symbol | Meaning |
|---|---|
| `f` | number of attached Pascal faces |
| `B_open(f)` | number of edges in the current coarse outer boundary |
| `n` | polygon order of an independently declared polygon carrier |

The arithmetic coincidence `B_open(f)=n` does not by itself identify the
Pascal complex with a regular `n`-gon or an `n`-faced solid.

## 3. The exact “7 to octagon” seam

The existing boundary formula yields:

| Pascal faces `f` | Pascal nodes `N_open(f)` | coarse boundary edges `B_open(f)` |
|---:|---:|---:|
| 4 | 91 | 6 |
| 5 | 112 | 7 |
| 6 | 133 | 8 |
| 7 | 154 | 9 |
| 8 | 175 | 10 |

Therefore:

```text
five-face open carrier
  -> 7-edge boundary
  -> attach one face along one open edge
  -> 8-edge boundary
```

This is the presently justified sense in which the construction moves “over
the 7 to the octagon”: at the **coarse boundary-incidence level**, the next
attachment changes a seven-edge boundary cycle into an eight-edge boundary
cycle. The terms “heptagonal” and “octagonal” here describe only cycle length.
Regular angles, equal lengths, planarity of a chosen drawing and a 3D solid
require separate embeddings and metrics.

## 4. Polygon with one missing edge

For an independently declared polygon carrier, define the ported polygon

```text
C_n^- = (V(C_n), E(C_n) \ {e*}, p_-, p_+)
```

where `e*={p_-,p_+}` is the distinguished missing edge and its endpoints are
ordered ports. As an unlabelled graph, `C_n^-` is a path on `n` vertices.
The port labels preserve where closure or coupling may occur.

Two different operations must remain separate:

1. **Closure:** reinstate `e*`. This produces `C_n`, not `C_{n+1}`.
2. **Boundary growth:** replace one boundary edge `{u,v}` by
   `{u,w},{w,v}` with a new boundary vertex `w`. This changes `C_n` into
   a boundary cycle of length `n+1`.

The coarse boundary action of one Pascal-face attachment has the second form:
one edge is consumed and two are exposed. This supplies a candidate typed
bridge between the owner's open-edge bodies and the PENT-06 boundary grammar.
It does not identify their interiors.

## 4A. Angle Nodes / Corner Flags

Orientation at a boundary corner can be retained by an auxiliary Angle Node.
For consecutive directed boundary edges

```text
e_(i-1) -> v_i -> e_i
```

define the corner flag

```text
a_i = (e_(i-1), v_i, e_i, turn_i, theta_i, metric_source_i).
```

Its fields have different authority:

- `turn_i` is combinatorial orientation data such as left, right, straight
  or unresolved;
- `theta_i` is a metric angle and may be `null`;
- `metric_source_i` names the embedding or measurement that supplied
  `theta_i`.

An Angle Node is not a new vertex of the Pascal carrier by default. It is a
typed incidence/orientation record attached to one existing corner. If an
implementation materializes these records as nodes in an auxiliary incidence
graph, that graph must be counted separately and must not change
`N_open(f)`, the 106-node SCC-003 carrier or its graph fingerprint.

The oriented coarse boundary can therefore be recorded as a boundary word:

```text
W(partial K) = (e_1, a_1, e_2, a_2, ..., e_n, a_n).
```

For a regular metric `n`-gon, the standard control values are

```text
interior angle alpha_n = (n-2)pi/n
exterior turn  tau_n  = 2pi/n.
```

In particular, `tau_7 = 360 degrees / 7` and `tau_8 = 45 degrees`.
These values do not transfer automatically to a Pascal boundary. Without a
declared metric embedding, only the cyclic order and symbolic turn labels are
available.

For a ported polygon `C_n^-`, the two endpoints have open corner flags. A
complete two-edge angle at either endpoint is undefined until the missing
edge is restored or an external reference direction is declared. This makes
the endpoint incompleteness explicit instead of silently inventing an angle.

For a simple closed piecewise-linear planar embedding, the signed exterior
turns provide the standard control

```text
sum_i tau_i = +2pi or -2pi
```

according to orientation. No such closed-turn total is assigned to an open
boundary without endpoint frames.

## 5. Prepared attachment object

Let `P_6` be the declared depth-six Pascal triangular complex with:

- weighted vertices;
- internal Pascal adjacency;
- three oriented boundary chains `L`, `R`, `B`;
- seven lattice vertices and six lattice segments on each full side.

A dynamic-boundary state is

```text
S = (K, F, partial K, A, lambda, omega, C)
```

with:

- `K`: current quotient complex;
- `F`: face-incidence record;
- `partial K`: ordered boundary cycles;
- `A`: currently admissible oriented seam chains;
- `lambda`: boundary and port labels;
- `omega`: Pascal vertex weights.
- `C`: corner flags / Angle Nodes, with optional metric values.

For `e in A`, define the prepared operation

```text
Attach_e(S, P_6)
```

as the quotient obtained by identifying one oriented side of a fresh
`P_6` with `e` in reversed seam order, provided corresponding weights
match. The operation must update `partial K`, `A`, `lambda`, `C` and
the face-incidence record. Consumed corner flags must be retired or
re-expressed, and newly exposed corners must receive new flags with explicit
provenance. This definition is prepared but not activated as a new run
contract.

## 6. What “5+2 versus 6+1” can mean

If the six-face state in `6+1` is literally the intermediate state produced
by the first attachment in `5+2`, the equality is tautological. A genuine
confluence question exists only when the histories contain a different
admissible choice, grouping or orientation:

```text
H_(5+2) = Attach_e7(Attach_e6(K_5, P_6), P_6)

H_(6+1) = Attach_e7'(K_6', P_6)
```

where `K_6'` is obtained from `K_5` through a distinct admissible seam
choice or orientation.

The arithmetic count alone is insufficient:

```text
N_open(7) = 154
```

for both histories whenever each step identifies exactly one full seven-node
seam. Equal node counts do not imply equal quotients.

## 7. Typed confluence criterion

Two terminal states `S_h` and `S_g` count as the same only if there is an
isomorphism preserving all declared structure:

1. vertices and adjacency;
2. Pascal weights;
3. face-incidence membership;
4. seam-equivalence classes;
5. cyclic order of every boundary component;
6. marked open ports and their orientation;
7. the boundary word and Angle-Node turn labels;
8. metric angles only when both states cite compatible metric sources;
9. any declared `C_5` or `D_5` action.

This is stronger than graph isomorphism and stronger than equality of
`V,E,F`, degree multisets or node counts.

## 8. Prepared comparison matrix

No row below has been executed.

| Case | Histories | Purpose | Decisive readout |
|---|---|---|---|
| identity control | the same ordered attachments twice | verifier sanity | typed isomorphism must pass |
| reflection control | reflected seam order where `D_5` applies | symmetry covariance | pass only through declared reflection |
| adjacent-edge fork | two admissible neighboring boundary edges | local confluence | typed isomorphism or explicit obstruction |
| nonadjacent-edge fork | separated boundary edges | global path dependence | typed isomorphism or explicit obstruction |
| orientation fork | same edge, opposite admissible orientation | seam-order dependence | weight/port compatibility and certificate |
| angle-word control | same untyped graph with different corner-turn labels | orientation information beyond adjacency | typed isomorphism must preserve the corner word |
| open-edge polygon control | `C_7^-` closure versus boundary growth | separate closure from `7 -> 8` | `C_7` versus eight-edge boundary |

Prepared certificates:

- node, edge and face counts;
- boundary-component count and cyclic boundary word;
- Angle-Node count, turn word and metric-source ledger;
- degree and weight multisets;
- seam-class size multiset;
- canonical coloured-graph fingerprint;
- typed automorphism group;
- explicit witness map or first failing invariant.

## 9. Possible outcomes

| Result class | Meaning |
|---|---|
| `CONFLUENT_UNDER_DECLARED_CLASS` | every tested admissible local fork rejoins by typed isomorphism |
| `PATH_DEPENDENT_WITH_WITNESS` | at least one declared fork produces non-isomorphic typed states |
| `CONDITIONALLY_CONFLUENT` | confluence holds only under an explicit restriction |
| `UNDEFINED_CONTRACT` | admissible edges, port labels or equality criteria remain insufficient |
| `UNINFORMATIVE_CONTROL` | compared histories were the same construction in different notation |

Finite tests could disprove general confluence but cannot prove unrestricted
confluence without a separate theorem.

## 10. Admission gate

Before any execution, the Human Owner would need to accept:

1. the exact class of admissible attachment histories;
2. whether `f=6,7,8` are in scope;
3. whether only combinatorial boundaries or metric embeddings are compared;
4. the typed equality criterion in Section 7;
5. the comparison matrix and STOP conditions;
6. a Run Contract and intended reproducibility class.

## STOP boundaries

- Do not call a seven-edge boundary a regular heptagon without a metric
  embedding.
- Do not call an eight-edge boundary a regular octagon or an octagonal solid
  without the necessary geometry.
- Do not add Angle Nodes to the 106 carrier count; they belong to an auxiliary
  typed orientation layer unless a new carrier is explicitly declared.
- Do not assign regular-polygon angles to Pascal corners without a compatible
  metric embedding.
- Do not complete endpoint angles of `C_n^-` without a closing edge or
  endpoint reference frame.
- Do not infer `5+2 = 6+1` from `154=154`.
- Do not infer a universal polygon ladder from the finite PENT-06 grammar.
- Do not merge ported polygons, Pascal quotients, MONAD(t), coupled channels
  or the existing dodecahedron question without typed maps.
- Do not execute this preparation note during Structure Freeze.

## Source return

- [PENT-06 dynamic-boundary source](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_DYNAMIC_BOUNDARY_TEST_2026-10-10/README.md>)
- [SCC-003 reference package](<../../../../10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/SCC_003_REFERENCE/README.md>)
- [A0 backlog](24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md)

