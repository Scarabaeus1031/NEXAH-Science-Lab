# Check 63 — Tessarec Pentagon Fold/Contact and A7–Root7 Guard

Date: `2026-10-13`  
Status: `BOUNDED_ENGINEERING_DEMONSTRATOR`  
Study activation: `NO`  
Canonical surface: `A0_BOOK/A0_TESSAREC_BLUE_BODY_LAB.html#fold-contact`

## Question

Can four equal apex-truncated regular pentagons be hinged around a square rim,
and can their removed apex triangles close the aperture like the flaps of a
takeout box? Does the shell address `A7` thereby acquire a justified Root7
identity?

## Exact fold ledger

For regular-pentagon side `s` and a cut at fraction `t` along the two apex
edges, the cut edge and triangular flap leg are

```text
b = phi*t*s
L = t*s.
```

Four identical isosceles flaps on a square rim meet at one central apex only
when `L >= b/sqrt(2)`. Therefore the required leg multiplier relative to the
regular apex triangle is

```text
e* = phi/sqrt(2) = 1.1441228056...
```

At `t=0.5`, the regular flap (`e=1`) remains open. The ratio is scale-free, so
changing `t` alone cannot close it. An extension of about `14.4%` creates first
contact; a larger extension creates an overlap/tuck regime. This formalizes the
useful part of the takeout-box intuition while rejecting automatic closure.

The interactive view animates a top-down contact projection through
`OPEN -> TOUCH -> OVERLAP_TUCK` and back. It is a kinematic contact audit, not
a rigid-material, collision, thickness or fabrication simulation. A triangular
base is retained as a separate three-panel/kite topology.

The `t` control now changes the visible physical rim scale `b=phi*t*s` instead
of renormalizing every drawing back to the same size. It still does not change
the scale-free closure ratio. This makes both facts visible at once.

The host selector compares `A7`, `A2` and the equal-wirelength witness `D4`.
For interface testing it declares two label-derived adapters:

```text
A2 -> 3-fold / triangular branch
A7 -> 8-fold / staged only
```

Both are `HYPOTHESIS_ONLY`. In particular, the digit in a host address does
not prove a fold count. Only the A2 adapter is currently connected to a drawn
fold branch; A7 remains staged pending a seam witness.

Check 60 also exposes the central motif as a `4 x O8 overlap` projection. This
is an alternative envelope view of the same additive `560` baseline. It does
not replace the connected H7 face-vector witness and registers no new faces.
The animated lens now has a directed demonstrator adapter: its four indexed
overlap cells populate the four wall slots of the square-base fold at
`t=0.5`, `extension=1.25`, and `fold=180 deg`. This is a view-to-tool handoff,
not an identification of octagonal faces with the pentagonal wall geometry.

## CON-DAO portal adapter

The fold surface reuses the existing governed carrier
`NEXAH:CON_DAO_BREATH:V1` rather than defining another breath grammar. Its
thirteen states drive one bounded display map:

```text
CON-6 -> ... -> CON-1 -> STILL x2 -> DAO-1 -> ... -> DAO-6
state depth -> normalized closure phase -> displayed fold angle
```

The yellow center is the fixed Stillpoint marker in this lens. The exact local
seam ledger is separately typed: a normalized hinge address `0.5` is halved to
`0.25`, so four wall slots close the normalized account as `4 x 0.25 = 1`.
The displayed Sapphire-axis ledger is `1.5 = 1 + 0.5`, where `0.5` is an axial
reserve. These normalized addresses are not the geometric pentagon cut edge
`b = phi t s`, and the adapter claims no physiological or physical mechanism.

The carrier and source clocks remain explicitly different. The executable
address space is `6 + 1 + 6 = 13` states. The separately retained historical
trace has `21 = 3 x 7` ticks. Their coexistence is useful as a dual-clock view,
but there is no declared bijection or identity between the thirteen state
addresses and the twenty-one provenance ticks. Their exact residual is
`21 - 13 = 8 = 2^3`. This gives the adapter a reproducible residual ledger;
it does not yet identify that residual eight with the separate octave group in
the existing `8 + 4` lens.

## Decimal labels

The labels remain a number-view sidecar, not geometry parameters:

```text
phi(1111)=1000, gap=111
phi(3333)=2000, gap=1333
phi(4444)=2000, gap=2444
phi(7777)=6000, gap=1777
```

`3333` and `4444` therefore collide under the Totient view while retaining
different preimages and gaps. This is a useful identifiability control.

## A7 / Root7 typed comparison

`A7` is a shell-vertex address. In the present shell its local regular-face
signature is `{5,5,8}`, degree `3`, with angle sum `351 degrees` and defect
`9 degrees`. Check 62 already shows that the host address is not invariant
under the declared mapping ensemble.

Root7 is the existing exact metric lens
`NEXAH:NAVIGATOR:ROOT7:LOOK:2026-10-08`, with norm squared `7`. Its axis is not
identified and `epsilon7` remains unresolved. The shared glyph `7` supplies no
intertwiner.

```text
VERDICT = REJECT_IDENTITY_COLLAPSE
PERMITTED = TYPED_COMPARATOR_ONLY
```

No new Navigator entity, route or relation is created. The existing Root7 lens
and JARP fixture remain the source-bound return path; the parked Root7 follow-on
is not reactivated.

## Replay

```bash
node A0_BOOK/a0-tessarec-fold-contact-tests.cjs
```

Expected: `A0 Tessarec fold/contact: 25 assertions passed`.

## Claim boundary

This check establishes an exact planar flap threshold, a schematic animated
contact operator, four reproducible Totient profiles, a host-address selector,
an overlap projection and an A7/Root7 namespace guard. It does not establish a new polyhedron, a manufacturable container, a
Tessarec identity, a Root7 mechanism, an `epsilon7` definition, physical
dynamics, optimality or external novelty.
