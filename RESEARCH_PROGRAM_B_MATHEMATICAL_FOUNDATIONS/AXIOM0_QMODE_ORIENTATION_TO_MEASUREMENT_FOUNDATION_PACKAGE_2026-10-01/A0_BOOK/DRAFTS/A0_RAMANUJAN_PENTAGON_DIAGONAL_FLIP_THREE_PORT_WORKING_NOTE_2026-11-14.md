# Ramanujan Pentagon — Diagonal Flip, Three Shades and Three Ports

Date: `2026-11-14`

Status: `SOURCE_BOUND_WORKING_NOTE / DOCUMENTATION_ONLY / FORMAL_DESIGN_CANDIDATE / NOT_ACTIVE / NO_CLAIM_PROMOTION`

Existing lineage reused: `NODE:RAMANUJAN_ESCAPE` (`SOURCE_GENEALOGY_ONLY`)

Relationship boundary: this note is **not part of SCC-003**, does not change the SCC-003 theorem and does not identify the construction with any theorem of Srinivasa Ramanujan. `Ramanujan` is retained only as the historical source-local role name attached to the visual.

## Bounded question

Can the historical `3D Pentagon with Escape (Ramanujan Concept)` be reconstructed as a regular pentagonal carrier with one lifted escape profile, two explicitly alternative triangulations, three visible face records and a reversible diagonal flip, without inventing a physical channel or merging the object into SCC-003?

## Source lock

| Source | SHA-256 | Role |
|---|---|---|
| `Oval Studies/3D Pentagon with Escape (Ramanujan Concept).png` | `3ee2d062984a5cc85cf741841e40cc9f95dd57b429cd9d392676ca4376966e6e` | historical 486×422 visual |
| `Screenshot 2026-11-14 at 7.13.08 PM.png` | `90f20e0861ff85f589876b5cc9daa7c8a6b48b36dd2b99d489bd5f3275983825` | Owner annotation: projected rails, open edge and shadow reading |
| `NEXAH/EXPERIMENTAL/FRAMEWORK/NEXAH/geometry/oval_cut_branch_master.md` | `a1bc05b6bcf145923ec7ec8d9901ba26abd2b4ac26f936bc9ed245be19108304` | Core provenance for oval → cut → branch and `5–5–6`; conceptual only |
| `NEXAH/EXPERIMENTAL/BUILDER_LAB/proto_models/oval_membrane_field/README.md` | `089b0673d6de305b465f24641825c33c1a2c3d09b9152bb19e011fef86641227` | Core provenance for layered oval/membrane field; proto-model only |
| `NEXAH/EXPERIMENTAL/BUILDER_LAB/proto_models/oval_membrane_field/exchange_channels.md` | `8903a2547ce485fcbcee9c9d07aac18fb58907fa1246dfa570d690ddb8710157` | Core provenance for rain-like exchange-channel language; not formalized |

The exact generating script for the historical PNG was not recovered. Coordinates below are therefore separated into an exact planar reconstruction and a plot-read height hypothesis.

## 1. Point reconstruction

The companion `Positions of the Ovals` and `Ovals and Distances` visuals fix a regular pentagon of circumradius `R=3`. Their displayed adjacent and diagonal distances are

```text
side     = 2R sin(pi/5)  = 3.5267115138  -> 3.53
diagonal = 2R sin(2pi/5) = 5.7063390978  -> 5.71
```

Using the visual's cyclic labels gives the exact planar carrier

```text
P_j = (3 cos(2pi(j-1)/5), 3 sin(2pi(j-1)/5)).
```

Numerically:

| point | x | y | z status |
|---|---:|---:|---:|
| `P1` | `3.000000000` | `0.000000000` | `0` visible in plot |
| `P2` | `0.927050983` | `2.853169549` | `0.5` plot-read hypothesis |
| `P3` | `-2.427050983` | `1.763355757` | `2` visible top value |
| `P4` | `-2.427050983` | `-1.763355757` | `0` visible in plot |
| `P5` | `0.927050983` | `-2.853169549` | `0` visible in plot |

The planar coordinates are reconstructed from exact regular-pentagon geometry and the displayed `3.53/5.71` distances. The height vector

```text
h = (0, 0.5, 2, 0, 0)
```

matches the plotted axes and labels but remains `INFERRED_FROM_VISUAL` until the generator or source array is recovered.

Under this height hypothesis:

```text
|P2P4|_3D = 5.7282026762
|P3P5|_3D = 6.0466772610
|P2P5|_3D = 5.7282026764
```

No `60°` angle is asserted from the perspective image. It must be calculated after the source coordinates are recovered or explicitly frozen.

As a diagnostic only, the inferred height vector gives the following triangle
angles (degrees, in vertex order):

```text
125: 107.815772, 35.884308, 36.299920
245:  35.857916, 72.071042, 72.071042
234:  44.970498, 93.111736, 41.917766
235:  75.574827, 66.558239, 37.866934
345:  34.179107,105.592968, 40.227925
```

None is an exact `60°` triangle under that hypothesis. The apparent angle is
therefore a camera/view effect unless a different source coordinate set is
recovered.

## 2. Complete triangulation comparison

A convex pentagon has five triangulations. With cyclic order `P1,P2,P3,P4,P5`, they are:

| ID | diagonals | three triangular records |
|---|---|---|
| `T1` | `P1P3, P1P4` | `123, 134, 145` |
| `T2` | `P1P3, P3P5` | `123, 135, 345` |
| `T3` | `P1P4, P2P4` | `124, 234, 145` |
| `T4` | `P2P4, P2P5` | `125, 245, 234` |
| `T5` | `P2P5, P3P5` | `125, 235, 345` |

The Owner reading selects the pair `T4/T5`. Both retain the same base triangle `125` and the same diagonal `P2P5`. Only the quadrilateral `P2P3P4P5` changes its diagonal:

```text
T4 --flip(P2P4 -> P3P5)--> T5
T5 --flip(P3P5 -> P2P4)--> T4
```

This is a standard diagonal flip. The source-bound contribution candidate is not invention of diagonal flips, but the recovery of this particular flip as the exact formal reading of the annotated open-edge/shadow-edge pair.

## 3. Open-edge contract

The edges must be typed rather than visually conflated:

```text
carrier boundary: P1P2, P2P3, P3P4, P4P5, P5P1
common retained diagonal: P2P5
state A diagonal: P2P4
state B diagonal: P3P5
```

`P2P4 remains open` is therefore recorded as a state choice, not as a missing carrier edge:

- in `T4`, `P2P4` is present and `P3P5` is absent;
- in `T5`, `P3P5` is present and `P2P4` is absent;
- an aperture view may display the absent diagonal as an open or shadow candidate, but must not count it as an edge.

The two states must never be overlaid and then counted as one five-triangle complex unless a separate non-planar incidence object is declared.

## 4. Three shades / three ports

Each triangulation contains exactly three triangular face records. These are the bounded meaning of `three algorithmic shades` in this note:

```text
Shade set A = {125, 245, 234}
Shade set B = {125, 235, 345}
```

For projection `pi_z(x,y,z)=(x,y,0)`, the plot-read height hypothesis yields two non-zero descent fibers:

```text
d2: P2 -> pi_z(P2), length 0.5
d3: P3 -> pi_z(P3), length 2
```

`P5` already lies on the projection plane. It cannot honestly be called a third vertical drain. It may instead be declared as the planar outlet/return port:

```text
o5: pi_z(P5)=P5.
```

The resulting three-port candidate is therefore typed as

```text
D = {d2, d3, o5}
  = {two descent fibers, one planar outlet}.
```

Calling all three items identical drains would erase this distinction. A future channel model must declare the carried state, direction, update rule and failure semantics before `drain`, `gutter` or `exchange channel` becomes more than display language.

## 5. Return contract

Let the discrete triangulation state be

```text
sigma in {A, B},
A = T4,
B = T5.
```

Define the flip operator only on the declared quadrilateral:

```text
Phi(A)=B,
Phi(B)=A,
Phi^2=id.
```

This gives an exact combinatorial Return. It does **not** reconstruct a 3D point from a 2D shadow. For view return, the record must retain at least:

```text
R = (carrier_id, cyclic_order, height/profile record, projection frame, sigma).
```

Without the height/profile record, `pi_z` loses `z`; without `sigma`, the shadow does not say whether `P2P4` or `P3P5` was active. The Return residual is therefore non-zero unless those fields are preserved.

## 6. Relation boundaries

### To SCC-003

No merge is made. SCC-003 remains the finite quotient of five depth-six Pascal carriers with typed `D5` symmetry. This note studies one historical lifted pentagon and a diagonal flip. It neither extends SCC-003 nor uses its counts or theorem claims.

### To the NEXAH Core oval line

The Core material is relevant provenance but remains separate:

- `oval_cut_branch_master.md` supplies the conceptual sequence `oval -> cut -> branch -> loop` and records a dual pentagon `5–5` with possible `6` closure;
- `oval_membrane_field` supplies a thick transition-region picture;
- `exchange_channels.md` preserves the source-local rain-like channel intuition.

No recovered source maps the historical oval numbers `2 | 1, 1/2, 1/2` to `P1...P5`, to `T4/T5`, or to `d2,d3,o5`. Such a weight map remains open and must not be inferred from layout alone.

### To Ramanujan

No partition, modular-form, tau-function, series or other identified Ramanujan construction has been bound to this geometry. `Ramanujan Escape` remains a historical role name under the existing lineage node, not a theorem attribution.

## 7. Curtain / hull / projection comparator

Human Owner authorization on `2026-11-14` permits one bounded local
demonstrator exception under the existing structure freeze. The exception is
limited to a source-bound formal-design comparator. It creates no Study,
Navigator identity, relation, publication, deployment or external action.

The inferred five-point profile has an additional finite control that is not
visible in the original open-surface description. Its convex hull has

```text
V=5, E=9, F=6, V-E+F=2
```

and the six triangular hull faces

```text
123, 124, 135, 145, 234, 345.
```

This is the combinatorial type of a triangular bipyramid. The segment `P2P5`
is not a hull edge. It joins the two apices through the interior and pierces
the equatorial triangle `134` at an interior point. Under the declared
reconstructed coordinates the intersection parameter is approximately
`0.548232`; the barycentric weight at `P1` is approximately
`0.618033989`. The classification is exact for this fixture and is recorded as
`VERIFIED_FOR_DECLARED_RECONSTRUCTED_COORDINATES`. The input height vector is
separately recorded as `RECONSTRUCTED_FROM_VISUAL` and
`UNVERIFIED_AS_HISTORICAL_3D_SOURCE`; it is not recovered historical source
data.

The local comparator therefore separates three readings of the same points:

| display name | formal role | geometry effect |
|---|---|---|
| `CIKADA / CURTAIN` | open triangulated pentagon in state `T4` or `T5` | selects one of two three-face sheets |
| `SCARAB / HULL` | closed triangular-bipyramid convex-hull control | closes the same five declared points |
| `DRAGONFLY / 010 SOUTH CROSS` | transverse projection of curtain and hull | view only; creates no body or edge |

`Splinters` display hull edges outside the pentagonal boundary. `Slits` are
visibility-gap annotations and never count as edges or faces. `O/Cube` is a
projection frame. The existing `101` carrier/fold reading is not the binary
cube-direction code `101`; the declared South Cross route is the separate
view address `000 -> 010 -> 000`.

The primary instrument is integrated directly into
[`A0_MATHEMATICAL_JOINTS.html#ramanujan-pentagon-comparator`](../A0_MATHEMATICAL_JOINTS.html#ramanujan-pentagon-comparator).
It supports T4/T5 flip, independent Curtain/Hull/Axis/Splinter/Slit layers,
drag inspection and an explicit Return to the original Cikada/T4 carrier view.
The asset-local `index.html` is retained only as a technical test harness and
is not offered as the reader-facing route.

Placement follows the evidence function, not the visual motif. Mathematical
Joints is the primary home because coordinates, hull classification,
triangulations, the involutive flip and the return predicate are declared and
tested here. *The Architecture of Difference* may later point to this object as
a comparative representation lens, but it must not duplicate the demonstrator
or become the authority for its mathematical verification.

## Current disposition

The six requested items are now separated as:

1. regular planar carrier recovered; height profile partly inferred;
2. all five triangulations enumerated;
3. `P2P4` and `P3P5` typed as alternative flip diagonals;
4. three face records defined; ports typed as two descent fibers plus one planar outlet;
5. exact combinatorial Return defined; view-return residual specified;
6. SCC-003, Core Oval and Ramanujan claim boundaries kept separate;
7. triangular-bipyramid hull control and three-view comparator added under a
   bounded local Owner exception.

Result vocabulary:

```text
RECOVERED: regular planar pentagon and T4/T5 flip relation
INFERRED_FROM_VISUAL: height vector (0,0.5,2,0,0)
OPEN: generator source, channel state/update law, oval weight map
NOT_ESTABLISHED: 60-degree triangle, physical drain, Ramanujan theorem relation
CONTROL: triangular-bipyramid convex hull of the declared reconstructed points
```

Next permitted action under the current documentation boundary: recover the original generator/source array or create an explicitly new formal-design fixture whose coordinates and ports are declared as design choices rather than historical facts.

Machine-readable companion:
[`ramanujan-pentagon-three-port-contract.json`](../assets/ramanujan-pentagon/ramanujan-pentagon-three-port-contract.json)
